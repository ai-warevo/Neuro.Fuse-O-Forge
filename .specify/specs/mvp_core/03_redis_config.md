# Redis Configuration

## Settings
* Host: `redis`
* Port: `6379`
* Database: `0`
* Ack Timeout: `300` seconds
* Heartbeat Interval: `10` seconds

## Path Correction
All internal paths must use `/app/output/` instead of `/volumes/output/` for Docker consistency.
