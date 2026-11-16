-- TO DO: create a README.md file according to canvas instructions
-- TO DO: state all design changes~ businessname is a new addition
-- TO DO: update ERD diagram

DROP TABLE IF EXISTS Registration;
DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Vendors;
DROP TABLE IF EXISTS Venue;
DROP VIEW IF EXISTS byCategory;

PRAGMA foreign_keys = ON;

-- a table that stores information about event venues for public locations and contact/pricing information (may be null)
CREATE TABLE Venue (
    VenueID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    ContactName TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Setting TEXT,
    RentalPrice REAL CHECK (RentalPrice > 0)
);

-- a table to store information about upcoming events, including the name, date, capacity, and host of the event
CREATE TABLE Events (
    EventID INTEGER PRIMARY KEY,
    VenueID INTEGER NOT NULL,
    Name TEXT NOT NULL,
    EventDate DATE,
    ContactName TEXT NOT NULL,
    ContactPhoneNumber TEXT NOT NULL,
    Capacity INTEGER,
    FOREIGN KEY (VenueID) REFERENCES Venue(VenueID)
);

-- a table to store information about known vendors and local businesses 
CREATE TABLE Vendors (
    VendorID INTEGER PRIMARY KEY,
    OwnerName TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    BusinessName TEXT NOT NULL UNIQUE,
    Category TEXT NOT NULL
        CHECK (Category IN ('Food & Beverage', 'Arts & Crafts', 'Clothing & Accessories', 'Beauty', 'Performance', 'Other'))
);

-- a table to track applications from vendors to participate in variosu events (one vendor can submit one application per event, but many across different events)
CREATE TABLE Applications (
    ApplicationID INTEGER PRIMARY KEY,
    EventID INTEGER NOT NULL,
    VendorID INTEGER NOT NULL,
    AppDate DATE,
    ApplicationFee REAL NOT NULL CHECK (ApplicationFee > 0),
    Status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (EventID) REFERENCES Events(EventID),
    FOREIGN KEY (VendorID) REFERENCES Vendors(VendorID)
);

-- a table to track the vendors whose applications have been approved and the booth they have been assigned to at a particular event
CREATE TABLE Registration (
    EventID INTEGER NOT NULL,
    VendorID INTEGER NOT NULL,
    BoothID INTEGER,
    Setup TEXT,
    Electricity TEXT,
    PRIMARY KEY (EventID, VendorID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID),
    FOREIGN KEY (VendorID) REFERENCES Vendors(VendorID)
);

-- This view enables us to see the number of vendors registered for every category in every event
CREATE VIEW byCategory AS
SELECT
    Events.EventID,
    Events.Name AS EventName,
    Vendors.Category,
    COUNT(Registration.VendorID) AS VendorCount
FROM Registration
JOIN Events
    ON Registration.EventID = Events.EventID
JOIN Vendors
    ON Registration.VendorID = Vendors.VendorID
GROUP BY
    Events.EventID,
    Events.Name,
    Vendors.Category;

-- Creating an index to search vendors by their Business Name rather than sort through the entire table each time
CREATE INDEX idx_business_name
ON Vendors(BusinessName);
