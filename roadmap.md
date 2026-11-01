# Telegram support
- [x] Investigate reported outage: current preview delivered a real message to Telegram and saved its Telegram message ID; live deployment is older and does not include the chat.
- [ ] Make Telegram chat available on the live site: awaiting the user's request to publish the current version.
- [x] Fix detected chat bugs; verify sending, keyboard focus and all public pages without runtime errors or overflow.
- [x] Add small bottom-right chat with sending, reply display and email fallback.
- [x] Secure message storage and implement signed Telegram webhook.
- [x] Register webhook: public endpoint is reachable and Telegram registration confirmed with no pending updates or delivery errors.
- [x] Connect support destination and verify website messages reach Telegram and appear in chat history.
- [ ] Verify an actual support reply returns to the visitor: awaiting a reply from the support operator in Telegram.
- [x] Verify chat open/close and delivery-failure state, run security tests and apply required package update; latest build OK.