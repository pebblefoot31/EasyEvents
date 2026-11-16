import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import "./styles.css";

const COLORS = [
  "#ff8f91",
  "#f5b7a8",
  "#a5b8e8",
  "#a6d6c5",
  "#c9a9df",
  "#ead08e"
];

function usePathname() {
  const [pathname, setPathname] = useState(
    () => window.location.pathname
  );

  useEffect(() => {
    function onPopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(to) {
    const url = new URL(to, window.location.origin);

    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return;
    }

    window.history.pushState({}, "", url);
    setPathname(url.pathname);
  }

  return {
    pathname,
    navigate
  };
}

function NavLink({ to, pathname, navigate, children }) {
  const isActive = pathname === to;

  function onClick(e) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    navigate(to);
  }

  return (
    <a
      href={to}
      className={isActive ? "active" : ""}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2 className="numeric">{value ?? "—"}</h2>
      <small>{subtitle}</small>
    </div>
  );
}

function EventIllustration({ eventName }) {
  const name = String(eventName || "").toLowerCase();
  const isWinterMarket = name.includes("winter");
  const isAsianFestival = name.includes("asian culture");
  const isSpringFair = name.includes("spring");
  const isSummerMusic = name.includes("summer music");
  const isFallFestival = name.includes("fall festival");
  const theme = isWinterMarket
    ? "winter"
    : isAsianFestival
      ? "dragon"
      : isSpringFair
        ? "spring"
        : isSummerMusic
          ? "music"
          : isFallFestival
            ? "fall"
            : "fair";
  const label = {
    winter: "Snowy winter festival illustration",
    dragon: "Asian culture festival dragon illustration",
    spring: "Spring flower illustration",
    music: "Summer music illustration",
    fall: "Autumn festival leaves illustration",
    fair: "Cheerful fair tent illustration"
  }[theme];

  return (
    <svg
      className={`event-illustration event-illustration--${theme}`}
      viewBox="0 0 220 170"
      role="img"
      aria-label={label}
    >
      {isWinterMarket ? (
        <>
          <ellipse cx="110" cy="150" rx="72" ry="8" fill="#d5e6e5" />
          <circle cx="110" cy="111" r="34" fill="#fffaf3" />
          <circle cx="110" cy="65" r="24" fill="#fffaf3" />
          <circle cx="102" cy="63" r="2.5" fill="#49332f" />
          <circle cx="118" cy="63" r="2.5" fill="#49332f" />
          <path d="m110 70 13 4-13 4z" fill="#d88959" />
          <path d="M94 88q16 10 32 0l4 10q-20 12-40 0z" fill="#bd6659" />
          <circle cx="98" cy="112" r="3" fill="#d88979" />
          <circle cx="110" cy="125" r="3" fill="#d88979" />
          <circle cx="122" cy="112" r="3" fill="#d88979" />
          <path className="snowfall" d="M39 47v26m-13-13h26m-22-9 18 18m0-18L30 69M173 91v22m-11-11h22m-19-8 16 16m0-16-16 16" stroke="#8baeb4" strokeWidth="3" strokeLinecap="round" />
          <path d="m94 41 16-8 16 8" fill="none" stroke="#bd8b62" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isAsianFestival ? (
        <>
          <path className="dragon-sway" d="M43 110q35-37 74 0t61-8" fill="none" stroke="#bd6659" strokeWidth="18" strokeLinecap="round" />
          <path d="M57 111q26-22 54 1t55-9" fill="none" stroke="#e9aa78" strokeWidth="5" strokeLinecap="round" />
          <path d="M54 96 42 82l20 3 9-16 5 23m85 9 15-13-20 3-8-16-5 23" fill="#bd6659" />
          <path d="m55 96-12-3 11 13m95-5 13-3-12 13" fill="#f4dfb8" />
          <circle cx="75" cy="101" r="3" fill="#49332f" />
          <circle cx="154" cy="101" r="3" fill="#49332f" />
          <path d="M66 112q10 8 20 0m58 1q10 8 20 0" fill="none" stroke="#49332f" strokeWidth="2" strokeLinecap="round" />
          <g className="festival-lantern lantern-left">
            <path d="M67 38v13" stroke="#49332f" strokeWidth="2" />
            <path d="M58 51h18l-2 20H60z" fill="#d88979" />
            <path d="M58 55h18m-17 12h16" stroke="#f4dfb8" strokeWidth="2" />
            <path d="M67 71v6" stroke="#bd6659" strokeWidth="2" />
          </g>
          <g className="festival-lantern lantern-right">
            <path d="M154 29v14" stroke="#49332f" strokeWidth="2" />
            <path d="M145 43h18l-2 20h-14z" fill="#d88979" />
            <path d="M145 47h18m-17 12h16" stroke="#f4dfb8" strokeWidth="2" />
            <path d="M154 63v6" stroke="#bd6659" strokeWidth="2" />
          </g>
          <path d="M110 35v29m-12-15h24m-20-9 16 18m0-18-16 18" stroke="#8f9b72" strokeWidth="4" strokeLinecap="round" />
          <circle cx="110" cy="35" r="7" fill="#f4dfb8" />
        </>
      ) : isSpringFair ? (
        <>
          <path d="M110 145V79m0 42q-23-26-42-13m42 2q24-28 43-13" fill="none" stroke="#71875d" strokeWidth="6" strokeLinecap="round" />
          <path d="M67 108q19-2 26 15-18 4-26-15m69 3q11-17 29-15-5 18-29 15" fill="#8f9b72" />
          <g className="flower-bloom" fill="#e9aa9a">
            <ellipse cx="110" cy="52" rx="8" ry="18" />
            <ellipse cx="110" cy="52" rx="8" ry="18" transform="rotate(72 110 68)" />
            <ellipse cx="110" cy="52" rx="8" ry="18" transform="rotate(144 110 68)" />
            <ellipse cx="110" cy="52" rx="8" ry="18" transform="rotate(216 110 68)" />
            <ellipse cx="110" cy="52" rx="8" ry="18" transform="rotate(288 110 68)" />
          </g>
          <circle className="flower-bloom" cx="110" cy="68" r="8" fill="#e9aa78" />
          <g fill="#d88979">
            <circle cx="66" cy="70" r="8" /><circle cx="66" cy="52" r="8" />
            <circle cx="66" cy="34" r="8" /><circle cx="57" cy="43" r="8" />
            <circle cx="75" cy="43" r="8" />
          </g>
          <circle cx="66" cy="43" r="6" fill="#f4dfb8" />
          <path d="M42 146h136" stroke="#d99a83" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isSummerMusic ? (
        <>
          <circle cx="110" cy="82" r="54" fill="#f4dfb8" />
          <g className="music-notes">
            <path d="M92 104V58l41-9v46" fill="none" stroke="#bd6659" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="80" cy="109" rx="14" ry="10" transform="rotate(-20 80 109)" fill="#bd6659" />
            <ellipse cx="121" cy="100" rx="14" ry="10" transform="rotate(-20 121 100)" fill="#bd6659" />
          </g>
          <path d="M145 42v30m-14-15h28m-24-10 20 20m0-20-20 20" stroke="#d88979" strokeWidth="4" strokeLinecap="round" />
          <path d="M54 61v21m-10-11h20m-17-7 14 14m0-14L47 74" stroke="#8f9b72" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 143h76" stroke="#d99a83" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : isFallFestival ? (
        <>
          <path d="M110 145V52m0 65q-24-25-43-12m43-17q24-26 45-12" fill="none" stroke="#71875d" strokeWidth="6" strokeLinecap="round" />
          <g className="autumn-leaf autumn-leaf--left">
            <path d="M68 100q-5-25 23-31 2 27-23 31z" fill="#d88959" />
            <path d="m70 98 17-24" stroke="#9a5e46" strokeWidth="2" />
          </g>
          <g className="autumn-leaf autumn-leaf--right">
            <path d="M151 84q8-26-19-35-7 26 19 35z" fill="#bd6659" />
            <path d="m149 82-13-27" stroke="#8e5149" strokeWidth="2" />
          </g>
          <g className="autumn-leaf autumn-leaf--top">
            <path d="M96 54q-1-25 25-28 0 27-25 28z" fill="#e9aa78" />
            <path d="m98 51 18-21" stroke="#9a5e46" strokeWidth="2" />
          </g>
          <path d="M42 146h136" stroke="#d99a83" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="110" cy="151" rx="83" ry="8" fill="#d99a83" opacity="0.35" />
          <path d="M43 91 110 35l67 56v52H43z" fill="#fff5e9" />
          <path d="M34 91 110 27l76 64H34z" fill="#bd6659" />
          <path d="m59 91 25-21 26-43 26 43 25 21z" fill="#f3c6a9" />
          <path d="M84 70 110 27l26 43-13 11h-26z" fill="#fff5e9" />
          <path d="M43 91h134v12H43z" fill="#e9aa78" />
          <path d="M54 103h12v40H54zm100 0h12v40h-12z" fill="#bd6659" />
          <path d="M91 143v-29a19 19 0 0 1 38 0v29z" fill="#d88979" />
          <path d="M101 143v-28a9 9 0 0 1 18 0v28z" fill="#49332f" />
          <path d="M34 91h152" stroke="#49332f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="74" cy="59" r="4" fill="#f4dfb8" />
          <circle cx="146" cy="59" r="4" fill="#f4dfb8" />
          <path d="M110 27V12" stroke="#49332f" strokeWidth="2" />
          <path className="tent-flag" d="m110 12 17 5-17 5z" fill="#8f9b72" />
        </>
      )}
    </svg>
  );
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  const [year, month, day] = String(date).split("-");

  return new Date(Number(year), Number(month) - 1, Number(day))
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
}

function formatMoney(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value));
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setError("");

      const [dashboardResponse, taskResponse] =
        await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/tasks")
        ]);

      if (!dashboardResponse.ok || !taskResponse.ok) {
        throw new Error("Unable to retrieve dashboard data.");
      }

      const dashboardData = await dashboardResponse.json();
      const taskData = await taskResponse.json();

      setDashboard(dashboardData);
      setTasks(taskData);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: newTask
        })
      });

      if (!response.ok) {
        throw new Error("Unable to add task.");
      }

      const task = await response.json();

      setTasks(prev => [task, ...prev]);
      setNewTask("");

    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    const completed = !Boolean(task.completed);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed })
      });

      if (!response.ok) {
        throw new Error("Unable to update task.");
      }

      setTasks(prev =>
        prev.map(item =>
          item.id === task.id
            ? { ...item, completed: completed ? 1 : 0 }
            : item
        )
      );

    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete task.");
      }

      setTasks(prev =>
        prev.filter(task => task.id !== id)
      );

    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="loading">
        Loading dashboard...
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="loading">
        <p>{error || "Unable to load dashboard."}</p>
        <button onClick={loadDashboard}>Try again</button>
      </main>
    );
  }

  const {
    stats,
    events,
    categories,
    attention
  } = dashboard;

  return (
    <main className="dashboard">

      <div className="page-title">

        <div>
          <p className="eyebrow">EVENT MANAGEMENT</p>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your events.</p>
        </div>

        <button onClick={loadDashboard}>
          Refresh
        </button>

      </div>

      {error && (
        <p className="error">{error}</p>
      )}

      <section className="stats-grid">

        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle="Scheduled events"
        />

        <StatCard
          title="Applications to Review"
          value={stats.pendingApplications}
          subtitle="Pending for upcoming events"
        />

        <StatCard
          title="Registered Vendors"
          value={stats.registeredVendors}
          subtitle="Upcoming event vendor spots"
        />

        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          subtitle="Across all events"
        />

      </section>

      <section className="dashboard-grid">

        <section className="panel">

          <h2>Upcoming Events</h2>

          <div className="event-list">

            {events.length === 0 && (
              <p>No upcoming events.</p>
            )}

            {events.map(event => (
              <article
                className="event-card"
                key={event.EventID}
              >

                <div className="event-date">

                  <strong className="numeric">
                    {new Date(
                      ...event.EventDate.split("-").map(
                        (v, i) =>
                          i === 1
                            ? Number(v) - 1
                            : Number(v)
                      )
                    ).getDate()}
                  </strong>

                  <small>
                    {new Date(
                      ...event.EventDate.split("-").map(
                        (v, i) =>
                          i === 1
                            ? Number(v) - 1
                            : Number(v)
                      )
                    ).toLocaleDateString("en-US", {
                      month: "short"
                    })}
                  </small>

                </div>

                <div className="event-info">

                  <h3>{event.Name}</h3>
                  <p>{event.VenueName}</p>

                  <small className="numeric">
                    {formatDate(event.EventDate)}
                  </small>

                  <div className="event-meta">

                    <span>
                      <span className="numeric">{event.RegisteredCount}</span> registered
                    </span>

                    <span>
                      <span className="numeric">{event.PendingCount}</span> pending
                    </span>

                  </div>

                  {event.CategoryBreakdown?.length > 0 && (
                    <div className="event-categories">

                      {event.CategoryBreakdown.map(category => (
                        <span key={category.Category}>
                          {category.Category}: <span className="numeric">{category.VendorCount}</span>
                        </span>
                      ))}

                    </div>
                  )}

                </div>

              </article>
            ))}

          </div>

        </section>

        <section className="panel">

          <h2>Needs Attention</h2>

          {attention.length === 0 ? (

            <p className="empty">
              You're all caught up!
            </p>

          ) : (

            attention.map(event => (
              <div
                className="attention-item"
                key={event.EventID}
              >

                <div>
                  <strong>{event.Name}</strong>
                  <p>
                    <span className="numeric">{event.PendingCount}</span> applications awaiting review
                  </p>
                </div>

                <span className="pending-badge">
                  <span className="numeric">{event.PendingCount}</span>
                </span>

              </div>
            ))

          )}

        </section>

        <section className="panel">

          <h2>Quick To-Do</h2>

          <form
            onSubmit={addTask}
            className="task-form"
          >

            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Add a task..."
            />

            <button type="submit">
              +
            </button>

          </form>

          {tasks.map(task => (
            <div
              className="task-row"
              key={task.id}
            >
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => toggleTask(task)}
              />

              <span className={
                task.completed ? "completed" : ""
              }>
                {task.description}
              </span>

              <button
                className="delete-task"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                ×
              </button>
            </div>
          ))}

          {tasks.length === 0 && (
            <p className="empty">
              Your to-do list is empty.
            </p>
          )}

        </section>

        <section className="panel chart-panel">

          <h2>Vendor Applications by Category</h2>

          {categories.length > 0 ? (
            <>

              <ResponsiveContainer width="100%" height={240}>
                <PieChart>

                  <Pie
                    data={categories}
                    dataKey="VendorCount"
                    nameKey="Category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >

                    {categories.map((item, index) => (
                      <Cell
                        key={item.Category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="category-legend">

                {categories.map((item, index) => (
                  <div key={item.Category}>

                    <span
                      className="legend-dot"
                      style={{
                        background: COLORS[index % COLORS.length]
                      }}
                    />

                    <span>{item.Category}</span>
                    <strong className="numeric">{item.VendorCount}</strong>

                  </div>
                ))}

              </div>

            </>
          ) : (
            <p className="empty">
              No applications yet.
            </p>
          )}

          <small className="chart-note">
            Counts applications, not just approved vendors.
          </small>

        </section>

      </section>

    </main>
  );
}

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [eventID, setEventID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextQuery = params.get("q") || "";
    const nextStatus = params.get("status") || "";
    const nextEventID = params.get("eventID") || "";

    setQuery(nextQuery);
    setStatus(nextStatus);
    setEventID(nextEventID);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        setError("");

        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (status) params.set("status", status);
        if (eventID) params.set("eventID", eventID);

        const response = await fetch(
          `/api/applications?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve applications.");
        }

        const data = await response.json();
        if (!cancelled) {
          setApplications(data);
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, status, eventID]);

  return (
    <main className="dashboard">

      <div className="page-title">
        <div>
          <h1>Applications</h1>
        </div>
      </div>

      <section className="panel">

        <div className="filter-bar">
          <input
            className="filter-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by vendor, category, event, or venue..."
          />

          <select
            className="filter-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {eventID && (
            <button
              type="button"
              className="filter-clear"
              onClick={() => setEventID("")}
            >
              Clear Event Filter
            </button>
          )}
        </div>

        {error && (
          <p className="error">{error}</p>
        )}

        {loading ? (
          <p className="empty">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="empty">No applications found.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Status</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Event</th>
                  <th>Event Date</th>
                  <th>Venue</th>
                  <th>Fee</th>
                  <th>Applied</th>
                </tr>
              </thead>

              <tbody>
                {applications.map(app => (
                  <tr key={app.ApplicationID}>
                    <td className="numeric">#{app.ApplicationID}</td>
                    <td>
                      <span
                        className={`status-pill status-${String(app.Status).toLowerCase()}`}
                      >
                        {app.Status}
                      </span>
                    </td>
                    <td>{app.BusinessName}</td>
                    <td>{app.Category}</td>
                    <td>{app.EventName}</td>
                    <td className="numeric">{formatDate(app.EventDate)}</td>
                    <td>{app.VenueName}</td>
                    <td className="numeric">{formatMoney(app.ApplicationFee)}</td>
                    <td className="numeric">{formatDate(app.AppDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

    </main>
  );
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    name: "",
    venueID: "",
    eventDate: "",
    contactName: "",
    contactPhoneNumber: "",
    capacity: ""
  });

  async function loadUpcoming() {
    try {
      setError("");
      setLoading(true);

      const response = await fetch("/api/events/upcoming");
      if (!response.ok) {
        throw new Error("Unable to retrieve upcoming events.");
      }

      setEvents(await response.json());

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  async function loadVenues() {
    const response = await fetch("/api/venues");
    if (response.ok) {
      setVenues(await response.json());
    }
  }

  useEffect(() => {
    loadUpcoming();
  }, []);

  useEffect(() => {
    if (showAdd && venues.length === 0) {
      loadVenues();
    }
  }, [showAdd, venues.length]);

  async function submitEvent(e) {
    e.preventDefault();

    const missingFields = [];
    if (!form.name.trim()) missingFields.push("Event Name");
    if (!form.venueID) missingFields.push("Venue");
    if (!form.contactName.trim()) missingFields.push("Contact Name");
    if (!form.contactPhoneNumber.trim()) missingFields.push("Contact Phone");

    if (missingFields.length > 0) {
      setFormError(
        `Please fill in the required fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    try {
      setError("");
      setFormError("");

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          venueID: form.venueID,
          eventDate: form.eventDate,
          contactName: form.contactName,
          contactPhoneNumber: form.contactPhoneNumber,
          capacity: form.capacity
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Unable to create event.");
      }

      setShowAdd(false);
      setFormError("");
      setForm({
        name: "",
        venueID: "",
        eventDate: "",
        contactName: "",
        contactPhoneNumber: "",
        capacity: ""
      });

      await loadUpcoming();

    } catch (err) {
      setFormError(err.message);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setError("");

      const response = await fetch(
        `/api/events/${deleteTarget.EventID}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Unable to delete event.");
      }

      setDeleteTarget(null);
      await loadUpcoming();

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="dashboard events-page">

      <div className="events-title">
        <h1>UPCOMING EVENTS</h1>
        <div className="events-rule" />
      </div>

      {error && (
        <p className="error">{error}</p>
      )}

      {loading ? (
        <p className="empty">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="empty">No upcoming events.</p>
      ) : (
        <section className="upcoming-list">
          {events.map(event => {
            const capacity = event.Capacity;
            const applicationCount = event.ApplicationCount || 0;
            const vendorCapacity =
              capacity && capacity >= 800
                ? 100
                : 50;

            const vendorInterest = Math.min(
              vendorCapacity > 0
                ? applicationCount / vendorCapacity
                : 0,
              1
            );

            return (
              <article
                key={event.EventID}
                className="upcoming-card"
              >

                <div className="event-poster">
                  <EventIllustration eventName={event.Name} />
                </div>

                <div className="event-card-body">

                  <div className="event-header">
                    <h2>{String(event.Name).toUpperCase()}</h2>
                    <p>
                      {String(event.VenueName).toUpperCase()}&nbsp;&nbsp;&nbsp;
                      <span className="numeric">
                        {String(formatDate(event.EventDate)).toUpperCase()}
                      </span>
                    </p>

                    <button
                      type="button"
                      className="delete-event"
                      onClick={() => setDeleteTarget(event)}
                      aria-label="Delete event"
                      title="Delete"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v9h-2v-9zm4 0h2v9h-2v-9zM7 10h2v9H7v-9z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="event-metrics">

                    <div className="metric-box image-box">
                      <div className="metric-placeholder">
                        <EventIllustration eventName={event.Name} />
                      </div>
                    </div>

                    <div className="metric-box interest-box">
                      <div className="interest-meter" aria-hidden="true">
                        <div
                          className="interest-fill"
                          style={{
                            width: `${Math.round(vendorInterest * 100)}%`
                          }}
                        />
                      </div>
                      <p className="metric-label">VENDOR INTEREST</p>
                      <small className="metric-sub numeric">
                        {`${applicationCount}/${vendorCapacity}`}
                      </small>
                    </div>

                    <div className="metric-box legend-box">
                      {event.CategoryBreakdown?.length ? (
                        <div className="legend-list">
                          {event.CategoryBreakdown.map((item, index) => (
                            <div
                              key={item.Category}
                              className="legend-row"
                            >
                              <span
                                className="legend-swatch"
                                style={{
                                  background: COLORS[index % COLORS.length]
                                }}
                              />
                              <span className="legend-name">
                                {String(item.Category).toUpperCase()}
                              </span>
                              <strong className="legend-count numeric">
                                {item.VendorCount}
                              </strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty">No applications yet.</p>
                      )}
                    </div>

                    <div className="metric-box funds-box">
                      <p className="funds-label">FUNDS</p>
                      <div className="funds-value numeric">
                        {formatMoney(event.TotalFees)}
                      </div>
                    </div>

                  </div>

                </div>

              </article>
            );
          })}
        </section>
      )}

      <div className="add-event-row">
        <button
          type="button"
          className="add-event-button"
          onClick={() => {
            setFormError("");
            setShowAdd(true);
          }}
          aria-label="Add event"
        >
          +
        </button>
      </div>

      {showAdd && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal">

            <div className="modal-header">
              <h2>Add Event</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setFormError("");
                  setShowAdd(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={submitEvent}
              onChange={() => setFormError("")}
            >

              {formError && (
                <p className="error form-error" role="alert">
                  {formError}
                </p>
              )}

              <label>
                Event Name
                <input
                  value={form.name}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="e.g., Winter Makers Market"
                />
              </label>

              <label>
                Venue
                <select
                  value={form.venueID}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    venueID: e.target.value
                  }))}
                >
                  <option value="">Select a venue...</option>
                  {venues.map(venue => (
                    <option
                      key={venue.VenueID}
                      value={venue.VenueID}
                    >
                      {venue.Name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Event Date
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    eventDate: e.target.value
                  }))}
                />
              </label>

              <label>
                Contact Name
                <input
                  value={form.contactName}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    contactName: e.target.value
                  }))}
                />
              </label>

              <label>
                Contact Phone
                <input
                  value={form.contactPhoneNumber}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    contactPhoneNumber: e.target.value
                  }))}
                />
              </label>

              <label>
                Capacity
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    capacity: e.target.value
                  }))}
                  placeholder="Optional"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-secondary"
                  onClick={() => {
                    setFormError("");
                    setShowAdd(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-primary">
                  Add Event
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal">

            <div className="modal-header">
              <h2>Delete Event</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="modal-text">
              Are you sure you want to delete
              {" "}
              <strong>{deleteTarget.Name}</strong>?
              This will also remove its applications and registrations.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}

function ComingSoonPage({ title }) {
  return (
    <main className="dashboard">

      <div className="page-title">
        <div>
          <p className="eyebrow">EASY EVENTS</p>
          <h1>{title}</h1>
          <p>This section is coming soon.</p>
        </div>
      </div>

      <section className="panel">
        <p className="empty">Nothing to show here yet.</p>
      </section>

    </main>
  );
}

function AboutPage() {
  return (
    <main className="dashboard">
      <div className="page-title">
        <div>
          <p className="eyebrow">EASY EVENTS</p>
          <h1>About</h1>
        </div>
      </div>

      <section className="panel">
        <p className="about-summary">
          Easy Events helps organizers manage community events in one place.
          Track upcoming events, review vendor applications, monitor registrations,
          and keep event planning tasks organized from the dashboard.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  const { pathname, navigate } = usePathname();

  let content;
  if (pathname === "/") {
    content = <DashboardPage />;
  } else if (pathname === "/applications") {
    content = <ApplicationsPage />;
  } else if (pathname === "/events") {
    content = <EventsPage />;
  } else if (pathname === "/about") {
    content = <AboutPage />;
  } else {
    content = <ComingSoonPage title="Not Found" />;
  }

  return (
    <div className="app">

      <header className="navbar">

        <h1 className="logo">EASY EVENTS</h1>

        <nav>
          <NavLink to="/" pathname={pathname} navigate={navigate}>
            HOME
          </NavLink>
          <NavLink to="/events" pathname={pathname} navigate={navigate}>
            EVENTS
          </NavLink>
          <NavLink to="/applications" pathname={pathname} navigate={navigate}>
            APPLICATIONS
          </NavLink>
          <NavLink to="/about" pathname={pathname} navigate={navigate}>
            ABOUT
          </NavLink>
        </nav>

      </header>

      {content}

    </div>
  );
}
