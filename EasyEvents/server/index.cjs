
const express = require("express");
const db = require("./db.cjs");

const app = express();
const PORT = 3001;

app.use(express.json());

function parsePositiveInteger(value) {
  const text = typeof value === "number" ? String(value) : value;
  if (typeof text !== "string" || !/^[1-9]\d*$/.test(text)) {
    return null;
  }

  const parsed = Number(text);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function isValidISODate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= monthLengths[month - 1];
}

function getObjectBody(body) {
  return body && typeof body === "object" && !Array.isArray(body)
    ? body
    : {};
}

// =====================================================
// 1. DASHBOARD DATA
// =====================================================

app.get("/api/dashboard", (req, res) => {
  try {

    // -----------------------------------------------
    // Summary statistics
    // -----------------------------------------------

    const stats = {
      upcomingEvents: db.prepare(`
        SELECT COUNT(*) AS count
        FROM Events
        WHERE EventDate IS NOT NULL
          AND date(EventDate) >= date('now')
      `).get().count,

      pendingApplications: db.prepare(`
        SELECT COUNT(*) AS count
        FROM Applications A
        JOIN Events E
          ON A.EventID = E.EventID
        WHERE A.Status = 'pending'
          AND E.EventDate IS NOT NULL
          AND date(E.EventDate) >= date('now')
      `).get().count,

      registeredVendors: db.prepare(`
        SELECT COUNT(*) AS count
        FROM Registration R
        JOIN Events E
          ON R.EventID = E.EventID
        WHERE E.EventDate IS NOT NULL
          AND date(E.EventDate) >= date('now')
      `).get().count,

      totalApplications: db.prepare(`
        SELECT COUNT(*) AS count
        FROM Applications
      `).get().count
    };


    // -----------------------------------------------
    // Upcoming events
    // -----------------------------------------------

    const events = db.prepare(`
      SELECT
        E.EventID,
        E.Name,
        E.EventDate,
        E.Capacity,
        V.Name AS VenueName,

        -- Count registered vendors for this event
        (
          SELECT COUNT(*)
          FROM Registration R
          WHERE R.EventID = E.EventID
        ) AS RegisteredCount,

        -- Count applications awaiting review
        (
          SELECT COUNT(*)
          FROM Applications A
          WHERE A.EventID = E.EventID
            AND A.Status = 'pending'
        ) AS PendingCount,

        -- Count all applications for this event
        (
          SELECT COUNT(*)
          FROM Applications A
          WHERE A.EventID = E.EventID
        ) AS ApplicationCount

      FROM Events E

      JOIN Venue V
        ON E.VenueID = V.VenueID

      WHERE E.EventDate IS NOT NULL
        AND date(E.EventDate) >= date('now')

      ORDER BY date(E.EventDate) ASC
      LIMIT 8
    `).all();


    // -----------------------------------------------
    // Registered vendor categories for each event
    // Reuses the existing byCategory VIEW
    // -----------------------------------------------

    const eventCategories = db.prepare(`
      SELECT
        EventID,
        Category,
        VendorCount
      FROM byCategory
      WHERE EventID IN (
        SELECT EventID
        FROM Events
        WHERE EventDate IS NOT NULL
          AND date(EventDate) >= date('now')
      )
      ORDER BY EventID, Category
    `).all();

    // Group the category results by EventID.
    // This makes it easier for React to display
    // category statistics inside individual event cards.

    const categoryMap = {};

    eventCategories.forEach(category => {
      if (!categoryMap[category.EventID]) {
        categoryMap[category.EventID] = [];
      }

      categoryMap[category.EventID].push({
        Category: category.Category,
        VendorCount: category.VendorCount
      });
    });

    // Attach each event's registered vendor breakdown.
    const eventsWithCategories = events.map(event => ({
      ...event,
      CategoryBreakdown: categoryMap[event.EventID] || []
    }));


    // -----------------------------------------------
    // Overall vendor application pie chart
    // Counts applications, NOT registrations.
    // -----------------------------------------------

    const categories = db.prepare(`
      SELECT
        V.Category,
        COUNT(A.ApplicationID) AS VendorCount

      FROM Applications A

      JOIN Vendors V
        ON A.VendorID = V.VendorID

      GROUP BY V.Category

      ORDER BY VendorCount DESC
    `).all();


    // -----------------------------------------------
    // Applications requiring attention
    // -----------------------------------------------

    const attention = db.prepare(`
      SELECT
        E.EventID,
        E.Name,
        E.EventDate,
        COUNT(A.ApplicationID) AS PendingCount

      FROM Events E

      JOIN Applications A
        ON E.EventID = A.EventID

      WHERE A.Status = 'pending'
        AND E.EventDate IS NOT NULL
        AND date(E.EventDate) >= date('now')

      GROUP BY E.EventID

      HAVING COUNT(A.ApplicationID) > 0

      ORDER BY date(E.EventDate) ASC
      LIMIT 4
    `).all();


    // -----------------------------------------------
    // Return all dashboard information to React
    // -----------------------------------------------

    res.json({
      stats,
      events: eventsWithCategories,
      categories,
      attention
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      error: "Unable to retrieve dashboard information."
    });
  }
});


// =====================================================
// 2. DASHBOARD TO-DO LIST
// =====================================================


// GET all tasks
app.get("/api/tasks", (req, res) => {
  try {
    const tasks = db.prepare(`
      SELECT
        TaskID AS id,
        Description AS description,
        IsCompleted AS completed

      FROM dashboard_tasks

      ORDER BY TaskID DESC
    `).all();

    res.json(tasks);

  } catch (error) {
    console.error("Task retrieval error:", error);

    res.status(500).json({
      error: "Unable to retrieve tasks."
    });
  }
});


// POST a new task
app.post("/api/tasks", (req, res) => {
  try {
    const descriptionValue = getObjectBody(req.body).description;
    const description = typeof descriptionValue === "string"
      ? descriptionValue.trim()
      : "";

    if (!description) {
      return res.status(400).json({
        error: "Task description is required."
      });
    }

    if (description.length > 500) {
      return res.status(400).json({
        error: "Task description must be 500 characters or fewer."
      });
    }

    const result = db.prepare(`
      INSERT INTO dashboard_tasks (Description)
      VALUES (?)
    `).run(description);

    res.status(201).json({
      id: result.lastInsertRowid,
      description,
      completed: 0
    });

  } catch (error) {
    console.error("Task creation error:", error);

    res.status(500).json({
      error: "Unable to create task."
    });
  }
});


// PATCH task completion status
app.patch("/api/tasks/:id", (req, res) => {
  try {
    const taskID = parsePositiveInteger(req.params.id);
    const completed = getObjectBody(req.body).completed;

    if (
      taskID === null ||
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        error: "Invalid task update."
      });
    }

    const result = db.prepare(`
      UPDATE dashboard_tasks

      SET IsCompleted = ?

      WHERE TaskID = ?
    `).run(completed ? 1 : 0, taskID);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Task not found."
      });
    }

    res.json({
      success: true,
      id: taskID,
      completed
    });

  } catch (error) {
    console.error("Task update error:", error);

    res.status(500).json({
      error: "Unable to update task."
    });
  }
});


// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
  try {
    const taskID = parsePositiveInteger(req.params.id);

    if (taskID === null) {
      return res.status(400).json({
        error: "Invalid task ID."
      });
    }

    const result = db.prepare(`
      DELETE FROM dashboard_tasks
      WHERE TaskID = ?
    `).run(taskID);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Task not found."
      });
    }

    res.status(204).end();

  } catch (error) {
    console.error("Task deletion error:", error);

    res.status(500).json({
      error: "Unable to delete task."
    });
  }
});


// =====================================================
// 3. EVENT CATEGORY BREAKDOWN
// Reuses the existing byCategory VIEW
// =====================================================

app.get("/api/events/:eventID/categories", (req, res) => {
  try {
    const eventID = parsePositiveInteger(req.params.eventID);

    if (eventID === null) {
      return res.status(400).json({
        error: "Invalid event ID."
      });
    }

    const event = db.prepare(`
      SELECT EventID
      FROM Events
      WHERE EventID = ?
    `).get(eventID);

    if (!event) {
      return res.status(404).json({
        error: "Event not found."
      });
    }

    const categories = db.prepare(`
      SELECT
        Category,
        VendorCount

      FROM byCategory

      WHERE EventID = ?

      ORDER BY VendorCount DESC
    `).all(eventID);

    res.json(categories);

  } catch (error) {
    console.error("Event category error:", error);

    res.status(500).json({
      error: "Unable to retrieve event categories."
    });
  }
});


// =====================================================
// 4. UPCOMING EVENTS
// =====================================================

app.get("/api/events/upcoming", (req, res) => {
  try {
    const events = db.prepare(`
      SELECT
        E.EventID,
        E.Name,
        E.EventDate,
        E.ContactName,
        E.ContactPhoneNumber,
        E.Capacity,
        E.VenueID,
        V.Name AS VenueName,

        (
          SELECT COUNT(*)
          FROM Registration R
          WHERE R.EventID = E.EventID
        ) AS RegisteredCount,

        (
          SELECT COUNT(*)
          FROM Applications A
          WHERE A.EventID = E.EventID
        ) AS ApplicationCount,

        (
          SELECT COUNT(*)
          FROM Applications A
          WHERE A.EventID = E.EventID
            AND A.Status = 'pending'
        ) AS PendingCount,

        (
          SELECT COALESCE(SUM(A.ApplicationFee), 0)
          FROM Applications A
          WHERE A.EventID = E.EventID
        ) AS TotalFees

      FROM Events E
      JOIN Venue V
        ON E.VenueID = V.VenueID
      WHERE E.EventDate IS NOT NULL
        AND date(E.EventDate) >= date('now')
      ORDER BY date(E.EventDate) ASC
    `).all();

    const categoryRows = db.prepare(`
      SELECT
        A.EventID,
        Ven.Category,
        COUNT(*) AS VendorCount
      FROM Applications A
      JOIN Vendors Ven
        ON A.VendorID = Ven.VendorID
      WHERE A.EventID IN (
        SELECT EventID
        FROM Events
        WHERE EventDate IS NOT NULL
          AND date(EventDate) >= date('now')
      )
      GROUP BY A.EventID, Ven.Category
      ORDER BY A.EventID, VendorCount DESC
    `).all();

    const categoryMap = {};
    categoryRows.forEach(row => {
      if (!categoryMap[row.EventID]) {
        categoryMap[row.EventID] = [];
      }

      categoryMap[row.EventID].push({
        Category: row.Category,
        VendorCount: row.VendorCount
      });
    });

    const eventsWithCategories = events.map(event => ({
      ...event,
      CategoryBreakdown: categoryMap[event.EventID] || []
    }));

    res.json(eventsWithCategories);

  } catch (error) {
    console.error("Upcoming events error:", error);

    res.status(500).json({
      error: "Unable to retrieve upcoming events."
    });
  }
});


// =====================================================
// 5. VENUES
// =====================================================

app.get("/api/venues", (req, res) => {
  try {
    const venues = db.prepare(`
      SELECT VenueID, Name
      FROM Venue
      ORDER BY Name ASC
    `).all();

    res.json(venues);

  } catch (error) {
    console.error("Venues error:", error);

    res.status(500).json({
      error: "Unable to retrieve venues."
    });
  }
});


// =====================================================
// 6. CREATE EVENT
// =====================================================

app.post("/api/events", (req, res) => {
  try {
    const body = getObjectBody(req.body);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const venueID = parsePositiveInteger(body.venueID);
    const eventDateValue = body.eventDate;
    const eventDate = typeof eventDateValue === "string"
      ? eventDateValue.trim()
      : "";
    const contactName = typeof body.contactName === "string"
      ? body.contactName.trim()
      : "";
    const contactPhoneNumber = typeof body.contactPhoneNumber === "string"
      ? body.contactPhoneNumber.trim()
      : "";
    const capacityValue = body.capacity;
    const capacityText = typeof capacityValue === "string"
      ? capacityValue.trim()
      : capacityValue;
    const capacity =
      capacityText === null || capacityText === undefined || capacityText === ""
        ? null
        : parsePositiveInteger(capacityText);

    if (!name) {
      return res.status(400).json({
        error: "Event name is required."
      });
    }

    if (venueID === null) {
      return res.status(400).json({
        error: "Valid venue is required."
      });
    }

    if (eventDateValue !== undefined && eventDateValue !== null && typeof eventDateValue !== "string") {
      return res.status(400).json({
        error: "Event date must be a valid date."
      });
    }

    if (eventDate && !isValidISODate(eventDate)) {
      return res.status(400).json({
        error: "Event date must be a real date in YYYY-MM-DD format."
      });
    }

    if (!contactName) {
      return res.status(400).json({
        error: "Contact name is required."
      });
    }

    if (!contactPhoneNumber) {
      return res.status(400).json({
        error: "Contact phone number is required."
      });
    }

    if (name.length > 120) {
      return res.status(400).json({
        error: "Event name must be 120 characters or fewer."
      });
    }

    if (contactName.length > 120) {
      return res.status(400).json({
        error: "Contact name must be 120 characters or fewer."
      });
    }

    if (contactPhoneNumber.length > 40) {
      return res.status(400).json({
        error: "Contact phone number must be 40 characters or fewer."
      });
    }

    if (
      capacityValue !== null &&
      capacityValue !== undefined &&
      capacityText !== "" &&
      capacity === null
    ) {
      return res.status(400).json({
        error: "Capacity must be a positive whole number."
      });
    }

    const venue = db.prepare(`
      SELECT VenueID
      FROM Venue
      WHERE VenueID = ?
    `).get(venueID);

    if (!venue) {
      return res.status(400).json({
        error: "Venue not found."
      });
    }

    const result = db.prepare(`
      INSERT INTO Events (
        VenueID,
        Name,
        EventDate,
        ContactName,
        ContactPhoneNumber,
        Capacity
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      venueID,
      name,
      eventDate || null,
      contactName,
      contactPhoneNumber,
      capacity
    );

    res.status(201).json({
      EventID: result.lastInsertRowid,
      VenueID: venueID,
      Name: name,
      EventDate: eventDate || null,
      ContactName: contactName,
      ContactPhoneNumber: contactPhoneNumber,
      Capacity: capacity
    });

  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      error: "Unable to create event."
    });
  }
});


// =====================================================
// 7. DELETE EVENT
// =====================================================

app.delete("/api/events/:eventID", (req, res) => {
  try {
    const eventID = parsePositiveInteger(req.params.eventID);

    if (eventID === null) {
      return res.status(400).json({
        error: "Invalid event ID."
      });
    }

    const existing = db.prepare(`
      SELECT EventID
      FROM Events
      WHERE EventID = ?
    `).get(eventID);

    if (!existing) {
      return res.status(404).json({
        error: "Event not found."
      });
    }

    const deleteEvent = db.transaction(id => {
      db.prepare("DELETE FROM Registration WHERE EventID = ?").run(id);
      db.prepare("DELETE FROM Applications WHERE EventID = ?").run(id);
      db.prepare("DELETE FROM Events WHERE EventID = ?").run(id);
    });

    deleteEvent(eventID);

    res.status(204).end();

  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      error: "Unable to delete event."
    });
  }
});


// =====================================================
// 8. APPLICATIONS LIST
// =====================================================

app.get("/api/applications", (req, res) => {
  try {
    const { q: rawQuery = "", status: rawStatus = "", eventID: rawEventID = "" } = req.query;
    if (
      typeof rawQuery !== "string" ||
      typeof rawStatus !== "string" ||
      typeof rawEventID !== "string"
    ) {
      return res.status(400).json({
        error: "Search, status, and event filters must each be a single text value."
      });
    }

    const query = rawQuery.trim().toLowerCase();
    const status = rawStatus.trim().toLowerCase();
    const eventID = rawEventID.trim();

    if (query.length > 100) {
      return res.status(400).json({
        error: "Search text must be 100 characters or fewer."
      });
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Status must be pending, approved, or rejected."
      });
    }

    const whereClauses = [];
    const params = [];

    if (eventID) {
      const parsed = parsePositiveInteger(eventID);
      if (parsed === null) {
        return res.status(400).json({
          error: "Invalid eventID."
        });
      }

      whereClauses.push("A.EventID = ?");
      params.push(parsed);
    }

    if (status) {
      whereClauses.push("lower(A.Status) = ?");
      params.push(status);
    }

    if (query) {
      const likeQuery = `%${query}%`;

      whereClauses.push(`(
        lower(V.BusinessName) LIKE ? OR
        lower(V.OwnerName) LIKE ? OR
        lower(V.Category) LIKE ? OR
        lower(E.Name) LIKE ? OR
        lower(Ven.Name) LIKE ?
      )`);

      params.push(
        likeQuery,
        likeQuery,
        likeQuery,
        likeQuery,
        likeQuery
      );
    }

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const applications = db.prepare(`
      SELECT
        A.ApplicationID,
        A.AppDate,
        A.ApplicationFee,
        A.Status,

        V.VendorID,
        V.BusinessName,
        V.OwnerName,
        V.Email,
        V.Phone AS VendorPhone,
        V.Category,

        E.EventID,
        E.Name AS EventName,
        E.EventDate,

        Ven.Name AS VenueName

      FROM Applications A

      JOIN Vendors V
        ON A.VendorID = V.VendorID

      JOIN Events E
        ON A.EventID = E.EventID

      JOIN Venue Ven
        ON E.VenueID = Ven.VenueID

      ${whereSql}

      ORDER BY
        date(E.EventDate) ASC,
        A.ApplicationID DESC
    `).all(...params);

    res.json(applications);

  } catch (error) {
    console.error("Applications error:", error);

    res.status(500).json({
      error: "Unable to retrieve applications."
    });
  }
});


// =====================================================
// 5. START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`Easy Events API running at http://localhost:${PORT}`);
});
