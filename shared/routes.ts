
import { z } from 'zod';
import { analyzeRequestSchema, insertAnalysisHistorySchema, analysisHistory } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    input: analyzeRequestSchema,
    responses: {
      200: z.custom<import('./schema').AnalyzeResponse>(),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof analysisHistory.$inferSelect>()),
      },
    },
    clear: {
      method: 'DELETE' as const,
      path: '/api/history',
      responses: {
        204: z.void(),
      },
    }
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
