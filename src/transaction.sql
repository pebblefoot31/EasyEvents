-- Transaction: Approve Thread & Timber and assign a booth

BEGIN TRANSACTION;

-- 1. Approve Thread & Timber's application for Fall Festival
UPDATE Applications
SET Status = 'approved'
WHERE VendorID = (
    SELECT VendorID
    FROM Vendors
    WHERE BusinessName = 'Thread & Timber'
)
AND EventID = 1;

-- 2. Register Thread & Timber and assign a booth
INSERT INTO Registration (EventID, VendorID, BoothID, Setup, Electricity)
SELECT
    1,
    VendorID,
    15,
    'Tent',
    'No'
FROM Vendors
WHERE BusinessName = 'Thread & Timber';

-- Demonstrate rollback so sample data stays unchanged
ROLLBACK;
