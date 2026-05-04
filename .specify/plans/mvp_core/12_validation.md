# 12. Validation Checkpoints

## 1. Data Layer Validation
**Tests:**
* Verify SQLAlchemy models create correct database schema.
* Test database connection and migration process.
* Check index creation on frequently queried fields.
* Validate data integrity constraints.

**Validation Steps:**
1. Run migrations and verify table creation.
2. Insert test data and verify retrieval.
3. Test edge cases (null values, constraints).
4. Verify schema evolution with new migrations.

**Success Criteria:**
* Database schema matches model definitions.
* Migrations apply without errors.
* Data integrity is maintained.
* Queries perform efficiently.

## 2. API Core Validation
**Endpoints to Test:**
* `POST /tasks/` — task creation with valid/invalid data.
* `GET /tasks/{task_id}` — status retrieval.
* `DELETE /tasks/{task_id}` — task cancellation.

**Test Cases:**
* Valid input → 201 Created.
* Invalid schema → 422 Unprocessable Entity.
* Missing required fields → 422.
* Non‑existent task ID → 404 Not Found.
* Server errors → 500 Internal Server Error.

**Success Criteria:**
* All endpoints return correct HTTP status codes.
* Response bodies match Pydantic schemas.
* Error messages are descriptive.
* Swagger documentation is accurate.

## 3. Universal Worker Validation
**Processing Tests:**
* Submit tasks of each type (SOUND, IMAGE, TEXT).
* Verify worker consumes from Redis.
* Check output files are saved in correct directories.
* Confirm task status updates in database.

**Pipeline‑Specific Tests:**
* Audio: Generate short audio clip, verify `.wav` format.
* Image: Generate image, verify dimensions and format.
* Text: Generate text, verify content length.

**Success Criteria:**
* Workers process tasks without crashing.
* Output files are correct format and accessible.
* Task statuses update properly.
* Redis messages are acknowledged (`XACK`).

## 4. Hot‑Swap and OOM Handling
**Hot‑Swap Test:**
1. Change model alias in `config.yaml`.
2. Submit new task.
3. Verify correct model is used.
4. Check logs for model loading.

**OOM Test:**
* Simulate high VRAM usage.
* Verify `torch.cuda.empty_cache()` is called.
* Test CPU fallback mechanism.
* Monitor memory usage before/after processing.

**Success Criteria:**
* Model switching works without service restart.
* GPU memory is properly managed.
* CPU fallback occurs gracefully when needed.
* No memory leaks detected.

## 5. Result Listener & Zombie Task Detection
**Result Listener Tests:**
* Submit task, verify result is processed.
* Test retry logic with non‑existent `task_id`.
* Verify ghost tasks are logged and cleared.
* Check `XACK` is sent after processing.

**Zombie Detection Tests:**
* Create task that exceeds `max_gen_time`.
* Verify it's marked as `ERROR (TIMEOUT)`.
* Simulate worker failure, check orphaned tasks.
* Test heartbeat mechanism with expired workers.

**Success Criteria:**
* Results are processed reliably.
* Unknown task IDs are handled with retries.
* Timeout tasks are properly marked.
* Orphaned tasks from dead workers are recovered.
* Logs provide clear diagnostic information.

---

## Overall Validation Strategy

**Testing Levels:**
* **Unit Tests:** Individual functions and classes.
* **Integration Tests:** Service interactions (API ↔ Redis ↔ Worker).
* **End‑to‑End Tests:** Full task lifecycle from creation to result.
* **Load Tests:** High task volume to test scalability.
* **Failure Tests:** Simulate service failures to test resilience.

**Automated Checks:**
* Run on every PR via CI/CD.
* Code coverage ≥ 80 %.
* Performance benchmarks.
* Security scanning.

**Manual Checks:**
* UI functionality testing.
* Edge case scenarios.
* Configuration changes impact.
* Disaster recovery procedures.

**Final Acceptance Criteria:**
* All validation checkpoints pass.
* System meets performance requirements.
* Documentation is complete and accurate.
* All known issues are documented.
* Ready for production deployment.