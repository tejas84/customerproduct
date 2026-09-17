# API

Base URL: `/api/v1`

Success:

```json
{ "success": true, "message": "...", "data": {} }
```

Error:

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "mobile", "message": "..." }] }
```

## Public

| Method | Path | Auth |
|---|---|---|
| GET | `/health` (root, not under `/api/v1`) | No |
| GET | `/form-options` | No |
| POST | `/enquiries` | No (rate limited) |
| POST | `/whatsapp/webhook` | Webhook secret header |

## Auth

| Method | Path |
|---|---|
| POST | `/auth/login` |
| GET | `/auth/me` |
| POST | `/auth/logout` |

Header: `Authorization: Bearer <token>`

## Enquiries / customers

| Method | Path |
|---|---|
| GET | `/enquiries` |
| GET | `/enquiries/:id` |
| PUT | `/enquiries/:id` |
| PATCH | `/enquiries/:id/status` |
| PATCH | `/enquiries/:id/assign` |
| POST | `/enquiries/:id/remarks` |
| GET | `/customers` |
| GET | `/customers/:id` |

Query for list: `page`, `limit`, `search`, `status`, `enquiry_type`, `product_service`, `assigned_to`, `source`, `from`, `to`, `sortBy`, `sortOrder`.

## Follow-ups, dashboard, reports

| Method | Path |
|---|---|
| POST/GET | `/followups` |
| PUT | `/followups/:id` |
| PATCH | `/followups/:id/status` |
| GET | `/dashboard/summary` |
| GET | `/dashboard/enquiries-trend` |
| GET | `/dashboard/status-summary` |
| GET | `/dashboard/type-summary` |
| GET | `/dashboard/product-summary` |
| GET | `/dashboard/monthly-trend` |
| GET | `/reports/enquiries` |
| GET | `/reports/conversion` |
| GET | `/reports/enquiries/export` |

## WhatsApp, confirmations, users

| Method | Path |
|---|---|
| GET | `/whatsapp` |
| POST | `/whatsapp/send` |
| POST | `/whatsapp/:id/retry` |
| GET | `/confirmations/:id` |
| GET | `/confirmations/:id/download` |
| GET | `/confirmations/enquiry/:enquiryId/download` |
| GET | `/users` |
| GET | `/users/assignable` |
| POST | `/users` |
| PUT | `/users/:id` |
| PATCH | `/users/:id/status` |
| GET | `/audit-logs` |
| GET/PUT | `/settings` |

Staff endpoints still authorize on the server. Frontend hiding is not sufficient.
