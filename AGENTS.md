<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Mount the Telegram support chat once in the root layout so it remains available across all pages.
- Support conversations use random browser-held capabilities stored only as hashes server-side; service-only tables prevent visitors from accessing other chats.
- Telegram requests use the explicitly supplied plain project bot secret server-side; webhook signatures and the configured support chat must both match before replies are stored.
- Match Telegram support replies by the original outgoing message ID and deduplicate update IDs so each reply reaches only its own visitor.
- Support polling is serialized and ignores stale reads during sends; delivered messages and successful transfers must never be reported as failed merely because receipt/history loading failed.
