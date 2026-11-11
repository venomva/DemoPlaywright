import { expect, type APIRequestContext } from '@playwright/test';

/**
 * Deterministic starting state for the sandbox shop.
 * Same recipe used by tests/shop/shop.spec.ts: POST /api/reset {"size":"medium"}.
 * The path is relative so it follows the configured baseURL (Development/Production).
 */
export const RESET_BODY = { size: 'medium' };

export async function resetState(request: APIRequestContext): Promise<void> {
  const res = await request.post('/api/reset', { data: RESET_BODY });
  expect(res.ok(), 'POST /api/reset should succeed').toBeTruthy();
}
