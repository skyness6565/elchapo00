import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { accessHash, validWebhook, webhookSecret, supportChatId } from './support.server';

test('support destination is the ID supplied by the user', () => {
  assert.equal(supportChatId, '9133958736');
});
test('only the matching Telegram webhook signature is accepted', () => {
  const syntheticToken = 'synthetic-test-token';
  assert.equal(validWebhook(webhookSecret(syntheticToken), syntheticToken), true);
  assert.equal(validWebhook('', syntheticToken), false);
  assert.equal(validWebhook(webhookSecret('other-test-token'), syntheticToken), false);
});
test('different visitor capabilities resolve to separate conversations', () => {
  assert.notEqual(accessHash('a'.repeat(64)), accessHash('b'.repeat(64)));
});