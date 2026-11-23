# Easy Events

Easy Events is a small event management app for organizers. The dashboard summarizes upcoming events, vendor applications, registrations, and planning tasks. The Events page lists upcoming events and lets organizers add or remove them; the Applications page helps track all vendor applications.

Note: the project root is in EasyEvents/

## Run locally

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. From the project root, install dependencies:

   ```sh
   npm install
   ```

3. Start the app:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173).

The development command starts the Vite frontend on port 5173 and the Express API on port 3001. Vite proxies `/api` requests to the API server.

## SQL safety and input validation

API queries bind user-provided values with `better-sqlite3` placeholders; dynamic search conditions are assembled only from fixed SQL fragments. The API validates event and task fields, positive IDs and capacities, real event dates, search length, and allowed application statuses, and rejects malformed values with clear client errors.

## Required operations for Deliverable 6

1. **Search or browse data:** Browse upcoming events on Events, or search and filter records on Applications.
2. **Display related data:** Event and application views combine related venue, vendor, registration, and application details using database joins.
3. **Add data:** Use the plus button on Events to add an event to the database.
4. **Update or delete data:** Delete events by clicking on the delete trash can icon at the top right of each event card under the Events tab. 
5. **Summary or report:** The dashboard reports event and application totals and vendor category summaries using SQL aggregates and grouping.
6. **Additional operation:** Use Quick To-Do to create persistent planning tasks separate from event records.
