.mode box

-- 1. Select and Order By
-- This simple order by query helps us understand the prices of various venues, with the most expensive at the bottom.
SELECT * 
FROM Venue
ORDER BY RentalPrice ASC;

-- 2. Inner Join
-- This query helps us figure out the businesses that have sent in applications and the events that each application corresponds to. It can help planners recognize popular events and the events that need more marketing.
SELECT Vendors.BusinessName, Events.Name, Applications.VendorID
FROM Applications
INNER JOIN Vendors
	ON Applications.VendorID = Vendors.VendorID
INNER JOIN Events
	ON Applications.EventID = Events.EventID;

-- 3. Left Join
-- This query uses left joins to find the businesses that applied and are actualy registered for events. This is useful for planners because not every vendor that applied is actually accepted into the event, so we can track the vendors that are 
SELECT Vendors.BusinessName, Events.Name, Registration.BoothID
FROM Registration
LEFT JOIN Applications
	ON Registration.VendorID = Applications.VendorID
    	AND Registration.EventID = Applications.EventID -- this line avoids duplicate rows per vendor
LEFT JOIN Events
	ON Registration.EventID = Events.EventID
LEFT JOIN Vendors
	ON Registration.VendorID = Vendors.VendorID;

--4. Three-Table Join
-- This shows vendors that have registered for multiple events and lists which events they registered for. Event planners can see popularly accepted vendors and try to give less frequent vendors more opportunities at future events.
SELECT
    Vendors.BusinessName,
    Events.Name AS EventName,
    Registration.BoothID
FROM Vendors
INNER JOIN Registration
    ON Vendors.VendorID = Registration.VendorID
INNER JOIN Events
    ON Registration.EventID = Events.EventID
WHERE Vendors.VendorID IN (
    SELECT VendorID
    FROM Registration
    GROUP BY VendorID
    HAVING COUNT(EventID) > 1
)
ORDER BY Vendors.BusinessName;

--5. Aggregate Query
-- Useful to get an idea of the total amount of money raised from application fees for events and which venue they are occurring at, especially if event planners want to track the budget or profits.
SELECT Events.Name, Venue.Name,  SUM(Applications.ApplicationFee) AS Payments
FROM Applications
LEFT JOIN Events
	ON Applications.EventID = Events.EventID
LEFT JOIN Venue
	ON Events.VenueID = Venue.VenueID
GROUP BY Events.Name;


-- 6. Grouping Query
-- Grouping venues by their setting and then filtering to see the locations that require payment to reserve
SELECT * 
FROM Venue
GROUP BY Setting
HAVING RentalPrice > 0;


--7. Subquery
-- Finding the vendors that have registered for large capacity events (capacities greater than 100 individuals)
SELECT
    BusinessName,
    OwnerName,
    Category
FROM Vendors
WHERE VendorID IN (
    SELECT VendorID
    FROM Registration
    WHERE EventID IN (
        SELECT EventID
        FROM Events
        WHERE Capacity > 100
    )
);

--8. Set Operation
-- Vendors that applied but have not registered (maybe their application is pending or rejected). this makes it clear to a planning committee which applications are left to be reviewed 
SELECT VendorID, EventID 

FROM Applications
EXCEPT

SELECT VendorID, EventID
FROM Registration;

--9. View
-- This query helps us see events that have more than 3 vendors registered in the food and beverage category. This is helpful if a planner wants to check if the minimum food/bev businesses for their event have been met.
SELECT
    EventName,
    Category,
    VendorCount
FROM byCategory
WHERE Category = 'Food & Beverage'
    AND VendorCount > 3
ORDER BY VendorCount DESC;


