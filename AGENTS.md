## Read the repository bundle first

Always read `repomix-output.xml` at the repo root before starting anything. If it does not exist, generate it first with:

```sh
npx repomix@latest
```

### Issue tracker

Issues live as markdown under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
