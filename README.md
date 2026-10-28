# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 investigation

The supplied report data and accepted decision 0001 are preserved unchanged; revised current guidance and added findings are published alongside them. Decision 0001 and the report/tenant data remain unchanged.

- [Findings source](src/routes/kb/incidents/4471-findings/+page.svx)
- [Rendered findings](rendered/kb/incidents/4471-findings/index.html) — download/open this HTML, or serve `rendered/` locally. It includes computed tables, the timeline, and the signature-derived desk reference.
- [Parser ticket: 379 reports](https://github.com/nicholashu/mega-s01e03/issues/1)
- [Hint ticket: 33 reports](https://github.com/nicholashu/mega-s01e03/issues/2)

Counts describe the 4 October export. Five flagged symptoms remain unresolved within the parser routing count; the newer desk update reports the parser fixed and booking-v3 retired, without an independent runtime test here. The course signature is deliberately included in the new pages as required; private request logs are kept outside this repository.

Build with Node.js 24 or later: `npm ci`, `npm run audit`, `npm run build`. The build compiles the actual Svelte/mdsvex pages and produces self-contained HTML in `rendered/`, including interactive dedupe examples. To browse all routes: `python3 -m http.server 4173 --directory rendered`, then open `http://localhost:4173/kb/incidents/4471-findings/`.
