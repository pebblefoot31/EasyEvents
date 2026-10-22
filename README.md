
## Testing & Recreating 

This database uses the Sqlite3 DBMS. 

To recreate the database, you first need to initialize the database file with the schema outlined in schema.sql. Next,
the insert_data.sql file will populate and test the database with dummy data. Run the following commands to recreate and test the database:

sqlite3 events.db < schema.sql
sqlite3 events.db < insert_data.sql

Make sure to run the files in the exact order given above.

    Any DBMS-specific setup steps
    Any required step for enabling foreign-key enforcement

## View

This database uses the byCategory view, which is a series of SQL commands that enable the event planner to see the number of vendors registered for each event
based on what business category they belong to. This relies on strategic joins between the Events, Vendors, and Registrations tables. Since event planners
strive to have a balanced number of each type of vendor, it can be a good way to discern categories that are falling short in the number of registered
vendors. 

## Index

The index supports search of a vendor by their business name. This is useful because it can help event planners quickly find contact details about
a particular vendor if they remember the name of the business. It can also help the event planner get an idea of the kind of products that a vendor sells 
(based on the name).

## Design Changes

I made a couple of minor changes to my database design. For the Vendors table, I added a TEXT column titled 'BusinessName' to store the name of the vendor's business. 
I also changed the name of the 'date' column across Events and Applications tables to be more descriptive, updating the field name to 'EventDate' and 'AppDate' respectively.

