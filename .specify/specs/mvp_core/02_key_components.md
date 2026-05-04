# Key Components of MVP Core Specification for Neuro.Fuse-O-Forge
1. **Redis Configuration**: Configure Redis to handle task queues for Sonic-Forge.
2. **Docker Compose Setup**: Define services for Redis, Python worker, and NVIDIA runtime support.
3. **Pydantic Schemas**: Create detailed Pydantic models for audio generation tasks with validation logic based on `config.yaml`.
4. **Worker Consumer Loop**: Implement a consumer loop that uses the Audiocraft library to process tasks.
5. **Universal Worker Strategy**: Detailed logic of how a single worker code uses `FORGE_TYPE` to load different pipelines (Audiocraft, Diffusers, or Transformers).
6. **State Machine**: Define task statuses and responsibilities for updating each status in SQLite.
7. **I/O Operations**: Specific paths for saving files: `/app/output/{type}/{date}/{task_id}.ext`.
8. **Reliability Layer**:
   - **Transactional Outbox (API)**: Use a "Database-First" atomic approach.
     - *Logic:* Start a DB transaction -> Create Task record (status: PENDING) -> Emit to Redis Stream -> Commit DB. If Redis fails, roll back the DB transaction.
   - **Transactional Inbox (Worker)**: Leverage Redis Streams **PEL (Pending Entries List)**.
     - *Logic:* Read with `XREADGROUP` (claim task) -> Process -> `XACK`. 
     - *Recovery:* On startup, the worker must first check for pending tasks in its own name (PEL) and process/ack them before taking new ones from the `>` stream.
   - **Idempotency (Update)**: Refine the check.
     - Instead of just checking the DB, the worker MUST check for the physical file in `/app/output/{type}/{task_id}.*`. If the file is there, it's a 100% SUCCESS, just `XACK` it and update the DB.

