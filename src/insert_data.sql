-- Dummy data and test queries for the event vendor database.
-- Run this after creating the schema shown in the project SQL file.
-- SQLite example:
--   sqlite3 events.db < dummy_data_and_tests.sql
--
-- This script clears existing rows in dependency order, inserts sample data,
-- then runs SELECT-based checks. The test queries display results; they do not
-- automatically fail the script if a result is unexpected.

PRAGMA foreign_keys = ON;
.mode box

-- Clear existing sample data (keep the schema, view, and indexes).
DELETE FROM Registration;
DELETE FROM Applications;
DELETE FROM Events;
DELETE FROM Vendors;
DELETE FROM Venue;

-- Adding Venues
INSERT INTO Venue (VenueID, Name, ContactName, Phone, Setting, RentalPrice) VALUES
    (1, 'Riverside Park', 'Jordan Lee', '865-555-0101', 'Outdoor', 450.00),
    (2, 'Knoxville Convention Center', 'Morgan Patel', '865-555-0102', 'Indoor', 700.00),
    (3, 'Market Square', 'Taylor Brooks', '865-555-0103', 'Outdoor', NULL),
    (4, 'Worlds Fair Park', 'Abbie Gold', '865-555-0104', 'Outdoor', NULL);

-- Adding Events
INSERT INTO Events
    (EventID, VenueID, Name, EventDate, ContactName, ContactPhoneNumber, Capacity)
VALUES
    (1, 1, 'Fall Festival', '2026-10-31', 'Jamie Carter', '865-555-0201', 1200),
    (2, 2, 'Winter Makers Market', '2026-11-21', 'Alex Rivera', '865-555-0202', 600),
    (3, 3, 'Spring Community Fair', '2027-04-17', 'Casey Morgan', '865-555-0203', 900),
    (4, 1, 'Summer Music Night', '2027-06-12', 'Riley Davis', '865-555-0204', 1500),
    (5, 4, 'Asian Culture Festival', '2027-03-10', 'Judy Yamato', '865-555-0205', 1000);

-- Adding Vendors
INSERT INTO Vendors
    (VendorID, OwnerName, Phone, Email, BusinessName, Category)
VALUES
    (1, 'Avery Green', '865-555-1001', 'hello@smokymountaincoffee.example', 'Smoky Mountain Coffee', 'Food & Beverage'),
    (2, 'Quinn Baker', '865-555-1002', 'orders@sweetpeabakery.example', 'Sweet Pea Bakery', 'Food & Beverage'),
    (3, 'Drew Wilson', '865-555-1003', 'contact@mountainclay.example', 'Mountain Clay Studio', 'Arts & Crafts'),
    (4, 'Emerson Chen', '865-555-1004', 'shop@threadandtimber.example', 'Thread & Timber', 'Clothing & Accessories'),
    (5, 'Harper James', '865-555-1005', 'hello@wildflowerbeauty.example', 'Wildflower Beauty', 'Beauty'),
    (6, 'Skyler Reed', '865-555-1006', 'booking@riverbendmusic.example', 'Riverbend Music', 'Performance'),
    (7, 'Rowan Price', '865-555-1007', 'info@brightdayprints.example', 'Bright Day Prints', 'Arts & Crafts'),
    (8, 'Finley Brooks', '865-555-1008', 'team@communityroots.example', 'Community Roots', 'Other');

-- 4. Applications
-- Status uses pending, approved, and rejected
INSERT INTO Applications
    (ApplicationID, EventID, VendorID, AppDate, ApplicationFee, Status)
VALUES
    (1, 1, 1, '2026-09-01', 25.00, 'approved'),
    (2, 1, 2, '2026-09-02', 25.00, 'approved'),
    (3, 1, 3, '2026-09-03', 20.00, 'approved'),
    (4, 1, 4, '2026-09-04', 20.00, 'pending'),
    (5, 1, 6, '2026-09-05', 30.00, 'approved'),
    (6, 2, 1, '2026-09-10', 25.00, 'approved'),
    (7, 2, 3, '2026-09-11', 20.00, 'approved'),
    (8, 2, 5, '2026-09-12', 20.00, 'rejected'),
    (9, 2, 7, '2026-09-13', 20.00, 'approved'),
    (10, 3, 2, '2027-02-01', 25.00, 'pending'),
    (11, 3, 5, '2027-02-02', 20.00, 'approved'),
    (12, 3, 8, '2027-02-03', 15.00, 'approved'),
    (13, 4, 6, '2027-04-01', 30.00, 'approved'),
    (14, 4, 1, '2027-04-02', 25.00, 'pending');

-- 5. Registrations
-- Registration rows represent vendors approved/assigned to an event
-- The (EventID, VendorID) primary key prevents duplicate registrations (i.e., the same vendor at the same event)
INSERT INTO Registration (EventID, VendorID, BoothID, Setup, Electricity) VALUES
    (1, 1, 101, '10x10 tent', 'Yes'),
    (1, 2, 102, '10x10 tent', 'Yes'),
    (1, 3, 103, 'Table', 'No'),
    (1, 6, 104, 'Small stage', 'Yes'),
    (2, 1, 201, '10x10 tent', 'Yes'),
    (2, 3, 202, 'Table', 'No'),
    (2, 7, 203, 'Table', 'No'),
    (3, 5, 301, '10x10 tent', 'Yes'),
    (3, 8, 302, 'Information booth', 'No'),
    (4, 6, 401, 'Main stage', 'Yes'),
    (4, 1, 402, 'Coffee cart', 'Yes');



-- TEST QUERIES
-- ============================================================

-- Test 1: Confirm the sample rows were inserted
SELECT 'Venue' AS TableName, COUNT(*) AS RowCount FROM Venue
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'Vendors', COUNT(*) FROM Vendors
UNION ALL
SELECT 'Applications', COUNT(*) FROM Applications
UNION ALL
SELECT 'Registration', COUNT(*) FROM Registration;

-- Test 2: Inspect the event/category registration counts using the byCategory view
-- Expected combinations: Fall Festival / Food & Beverage = 2 and Fall Festival / Performance = 1
SELECT EventID, EventName, Category, VendorCount
FROM byCategory
ORDER BY EventID, Category;

-- Test 3: Search for a vendor by exact business name (uses an index
-- on BusinessName, though UNIQUE on BusinessName already creates an index).
SELECT VendorID, BusinessName, OwnerName, Phone, Email, Category
FROM Vendors
WHERE BusinessName = 'Smoky Mountain Coffee';

-- Test 4: Show applications and whether the vendor has a registration
-- for that same event
SELECT
    E.Name AS EventName,
    V.BusinessName,
    A.Status AS ApplicationStatus,
    CASE
        WHEN R.VendorID IS NOT NULL THEN 'Registered'
        ELSE 'Not registered'
    END AS RegistrationStatus
FROM Applications AS A
JOIN Events AS E ON E.EventID = A.EventID
JOIN Vendors AS V ON V.VendorID = A.VendorID
LEFT JOIN Registration AS R
    ON R.EventID = A.EventID
   AND R.VendorID = A.VendorID
ORDER BY E.EventID, V.BusinessName;

-- Test 5: Check for applications whose status is NOT one of the expected sample statuses
-- Expected result: zero rows
SELECT *
FROM Applications
WHERE Status NOT IN ('pending', 'approved', 'rejected');

-- Test 6: Check for duplicate business names or emails
-- Expected result: zero rows for both queries
SELECT BusinessName, COUNT(*) AS DuplicateCount
FROM Vendors
GROUP BY BusinessName
HAVING COUNT(*) > 1;

SELECT Email, COUNT(*) AS DuplicateCount
FROM Vendors
GROUP BY Email
HAVING COUNT(*) > 1;

-- Test 7: Check that registrations point to valid events and vendors
-- Expected result: zero rows for both queries
SELECT R.*
FROM Registration AS R
LEFT JOIN Events AS E ON E.EventID = R.EventID
WHERE E.EventID IS NULL;

SELECT R.*
FROM Registration AS R
LEFT JOIN Vendors AS V ON V.VendorID = R.VendorID
WHERE V.VendorID IS NULL;

-- Test 8: Inspect indexes on Vendors
PRAGMA index_list('Vendors');
