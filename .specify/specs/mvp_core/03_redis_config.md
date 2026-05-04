# Redis Configuration

## Settings
* Host: `redis`
* Port: `6379`
* Database: `0`
* Ack Timeout: `300` seconds
* Heartbeat Interval: `10` seconds

## Path Correction
All internal paths must use `/app/output/` instead of `/volumes/output/` for Docker consistency.

## Task Streams

- **Stream Key**: `forge:tasks:{type}`
- **Consumer Group**: `forge-customer-group`

## Result Streams

- **Stream Key**: `forge:results`
- **Consumer Group**: `api_result_group`

The API should use the following command to consume messages from the `forge:results` stream:
```bash
redis-cli XREADGROUP GROUP api_result_group my-api-client STREAMS forge:results >
```