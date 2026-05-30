# .agents/raw/ — Immutable Source Documents

Drop files here when you want agents to ingest them into the wiki.

**Rules:**
- Never modify files once added
- Never delete files from this folder

**Ingest workflow:**
1. Drop the file here
2. Ask agents: "Ingest `.agents/raw/<filename>` into the wiki"
3. agent reads the file, creates or updates wiki pages
4. agent updates `.agents/wiki/index.md` and `.agents/wiki/log.md`
