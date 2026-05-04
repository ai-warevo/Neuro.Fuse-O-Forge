# 7. API Result Listener (Event‑Driven Flow)

## Initialize Redis Stream Groups
**Purpose:** Ensure consumer groups are properly initialized for result processing.

**Groups to Initialize:**
* `forge-customer-group` for `forge:tasks:{type}` streams.
* `api_result_group` for `forge:results` stream.

**Implementation:**
* Use `XGROUP CREATE` command with `MKSTREAM` flag.
* Run during API bootstrap procedure.
* Verify existence before attempting creation.

**Success Criteria:**
* Consumer groups are initialized in Redis.
* Streams are created if they don't exist.
* No errors are thrown if groups already exist.

## Implement API Result Listener
**Purpose:** Process results from workers and update task statuses.

**Workflow:**
1. Use `XREADGROUP` to read messages from `forge:results`.
2. Parse result payload (task_id, status, output_path, error_message).
3. Update task status in SQLite database.
4. Handle different result types (SUCCESS, ERROR).
5. Acknowledge message in Redis (`XACK`).

**Retry Logic for Unknown Task IDs:**
* If `task_id` not found in database:
  * Wait 500 ms.
  * Retry up to 3 times.
  * Log warning after all retries fail.
  * Clear message from stream to prevent reprocessing.

**Error Handling:**
* Log warnings for ghost tasks (non‑existent task IDs).
* Clear problematic messages after logging.
* Continue processing next messages.

**Success Criteria:**
* API reads results from Redis reliably.
* Task statuses are updated correctly in database.
* Unknown `task_id`s are handled with retry logic.
* Ghost tasks are logged and cleared properly.
