const { z } = require('zod');
const { FOLLOWUP_STATUSES } = require('../constants');

const createFollowupSchema = z.object({
  enquiry_id: z.coerce.number().int().positive(),
  assigned_to: z.coerce.number().int().positive(),
  followup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  followup_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  remark: z.string().trim().max(500).optional().nullable(),
});

const updateFollowupSchema = createFollowupSchema.partial();

const followupStatusSchema = z.object({
  status: z.enum(FOLLOWUP_STATUSES),
  remark: z.string().trim().max(500).optional().nullable(),
});

module.exports = { createFollowupSchema, updateFollowupSchema, followupStatusSchema };
