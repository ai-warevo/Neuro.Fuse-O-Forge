# 8. Zombie Task Detection

## Timeout Watchdog
**Purpose:** Prevent stuck tasks from accumulating in the system.

**Mechanism:**
* Monitor tasks with status `PROCESSING`.
* Compare current time with `updated_at` timestamp.
* If difference exceeds `max_gen_time` (from config), mark as timeout.

**Configuration:**
* `max_gen_time`: Maximum processing time in seconds (configurable in `config.yaml`).
* Watchdog interval: 30 seconds (configurable).

**Detection Process:**
1. Query database for tasks with status `PROCESSING` and `updated_at < (now - max_gen_time)`.
2. For each detected zombie task:
   * Update status to `ERROR (TIMEOUT)`.
   * Set `error_message` to "Task exceeded maximum processing time".
   * Log warning with task details.
3. Optionally: Attempt to cancel worker processing (if possible).

## Redis Heartbeats
**Purpose:** Detect orphaned workers and their tasks.

**Implementation:**
* Workers send heartbeat messages to Redis every 15 seconds.
* Heartbeat key: `worker:{worker_id}:heartbeat`.
* Expiry: 45 seconds (3× heartbeat interval).

**Zombie Worker Detection:**
* Check for expired heartbeat keys.
* For each expired worker:
  * Mark all its assigned tasks as `ERROR (WORKER_DOWN)`.
  * Requeue tasks for other workers.

**Success Criteria:**
* Tasks are marked as `ERROR (TIMEOUT)` after exceeding `max_gen_time`.
* Orphaned tasks from dead workers are properly handled.
* Watchdog runs periodically without performance impact.
* Logs provide clear information about detected zombies.
