--Write a SELECT query using:
  --  WHERE
  -- ORDER BY
--The query should answer a meaningful question about your data
SELECT * 
FROM Venue
ORDER BY RentalPrice DESC


--2. INNER JOIN
-- Write a query using INNER JOIN to combine related data from at least two tables.
SELECT Vendors.BusinessName, Events.Name, Applications.VendorID
FROM Applications
INNER JOIN Vendors
	ON Registration.VendorID = Vendors.VendorID
INNER JOIN Events
	ON Applications.EventID = Events.EventID

--3. LEFT JOIN

--Write a query using LEFT JOIN.
--Your sample data should include at least one case where the left table contains a row with no matching row on the right so that the outer join demonstrates a meaningful result.


--4. Three-Table Join

--Write a query that joins at least 3 tables.
--You may use inner joins, outer joins, or a combination.
--The query should produce useful information that would not be available from a single table.


--5. Aggregate Query
-- Write a query using at least one aggregate function, such as:


-- 6. Write a query using:

--GROUP BY
--HAVING

--The query should create meaningful groups, and the HAVING condition should meaningfully filter those groups.. GROUP BY and HAVING


--7. Subquery

--Write a query that uses a subquery.
--The subquery should serve a meaningful purpose in answering the question.


--8. Set Operation

--Write a query using a set operation supported by your DBMS, such as:

 --   UNION
  --  INTERSECT
   -- EXCEPT

--The SELECT statements being combined should represent logically related sets of data.
--Do not create an artificial set operation only to satisfy the requirement.

--9. View

--Write a query that uses the view created in Deliverable 3.
-- The query should demonstrate why the view is useful.

