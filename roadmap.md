# Telegram support
- [ ] Fix detected chat bugs and verify smooth loading, sending, scrolling and page navigation.
- [x] Add small bottom-right chat with sending, reply display and email fallback.
- [x] Secure message storage and implement signed Telegram webhook.
- [ ] Register webhook: stable public preview endpoint currently returns 404; must become reachable before registration.
- [ ] Connect support destination and verify message/reply flow: Telegram reports chat not found for supplied ID 9133958736. User must start the bot and provide a reachable support chat ID.
- [x] Verify chat open/close and delivery-failure state, run security tests and apply required package update; latest build OK.