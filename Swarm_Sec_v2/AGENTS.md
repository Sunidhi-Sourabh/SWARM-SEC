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

- Keep the shared security playground state in a root provider so input and results survive navigation without browser storage; unsaved enterprise source never leaves browser memory.
- Use the Lezer Python parser and bounded deterministic rules for live analysis; generated remediation and tests are review artifacts, never claim executed exploit or compliance certification.
- Encrypt saved audit payloads with AES-GCM and a per-user key derived from the server encryption secret; private server functions and owner-scoped RLS enforce access.
- Store contact submissions before attempting the owner's fixed Formspree destination; only report email acceptance when the provider confirms it.
