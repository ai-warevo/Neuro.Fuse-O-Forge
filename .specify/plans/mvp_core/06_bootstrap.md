# 6. Bootstrap Procedure

## API Startup
**Steps:**
1. **Verify Redis Consumer Groups:**
   * Check if `forge-customer-group` exists for `forge:tasks:{type}`.
   * Create if not exists using `XGROUP CREATE`.
   * Similarly for `api_result_group` on `forge:results`.

2. **Database Migrations:**
   * Run SQLAlchemy migrations.
   * Create tables if they don't exist.
   * Apply schema changes.

3. **Configuration Validation:**
   * Load and validate `config.yaml`.
   * Ensure all required models are available.

4. **Health Checks:**
   * Verify Redis connectivity.
   * Test database connection.
   * Confirm volume mounts are accessible.

**Success Criteria:**
* Consumer groups are created in Redis.
* Database schema is up-to-date.
* All required services are reachable.
* API reports healthy status.

## Implementation Notes
* Bootstrap runs automatically on API startup.