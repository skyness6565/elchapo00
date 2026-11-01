import { test, expect } from 'bun:test';
import { accessHash, validWebhook, webhookSecret, supportChatId } from './support.server';

test('support destination is the ID supplied by the user', () => {
  expect(supportChatId).toBe('9133958736');
});
test('only the matching Telegram webhook signature is accepted', () => {
  const syntheticToken = 'synthetic-test-token';
  expect(validWebhook(webhookSecret(syntheticToken), syntheticToken)).toBe(true);
  expect(validWebhook('', syntheticToken)).toBe(false);
  expect(validWebhook(webhookSecret('other-test-token'), syntheticToken)).toBe(false);
});
test('different visitor capabilities resolve to separate conversations', () => {
  expect(accessHash('a'.repeat(64))).not.toBe(accessHash('b'.repeat(64)));
});