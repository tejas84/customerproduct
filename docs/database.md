# Database

Engine: MySQL 8, charset `utf8mb4`.

## Tables

- `roles` — SUPER_ADMIN, ADMIN, STAFF
- `users` — staff accounts (`password_hash`, `role_id`, `is_active`)
- `customers` — one row per unique mobile
- `enquiry_counters` — yearly sequence for `ENQ-YYYY-000001`
- `enquiries` — business records (unique `enquiry_number`, not the auto-increment id)
- `enquiry_status_history` — every status/remark change
- `followups`
- `enquiry_confirmations` — PDF metadata
- `whatsapp_messages`
- `audit_logs`
- `settings`

## Relationships

- Role 1—N User (RESTRICT delete)
- Customer 1—N Enquiry (RESTRICT)
- User 1—N assigned Enquiry (SET NULL)
- Enquiry 1—N StatusHistory (CASCADE)
- Enquiry 1—N Followup (RESTRICT)
- Enquiry 1—N Confirmation (RESTRICT)
- Enquiry 1—N WhatsappMessage (SET NULL)
- User 1—N AuditLog (SET NULL)

Indexes exist on mobile, email, enquiry status, type, product, assignee, source, created_at, and common foreign keys.

## Migrations

```bash
cd backend
npm run db:migrate
npm run db:seed
npm run db:migrate:undo
```
