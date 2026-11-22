---
name: kevinkraemer-com
description:
  Find, read, and cite the log entries and pages on kevinkraemer.com, the portfolio of Kevin
  Kraemer, a full-stack developer and former financial risk analyst in Luxembourg. Use when a task
  needs verified facts about his experience, skills, projects, or writing, or when the user mentions
  Kevin Kraemer or links to kevinkraemer.com.
---

# kevinkraemer.com

kevinkraemer.com is the portfolio of Kevin Kraemer: a curriculum vitae, a project case file, and a
small archive of log entries on software architecture, type systems, and lessons from finance.

Everything is public and static, so use unauthenticated HTTPS `GET` requests. The market and
terminal presentation is a design metaphor. No number on the site is live market data, and none of
it should be cited as market information.

## Find content

1. Fetch https://www.kevinkraemer.com/llms.txt. It lists every page and machine-readable file with a
   line on when each one is useful.
2. When the question is only about the writing, fetch https://www.kevinkraemer.com/logs-llms.txt
   instead.
3. To read everything at once, fetch https://www.kevinkraemer.com/llms-full.txt. It holds every log
   entry and every project case in one file.

The index is complete. Do not crawl the HTML pages to discover content.

## Read content

- A log entry, as authored: append `.md` to its URL, for example
  `https://www.kevinkraemer.com/logs/{slug}.md`. The file opens with YAML front matter (`title`,
  `description`, `date`, `tags`, `canonical`) followed by the entry with absolute links.
- Any other page: request the page URL with the `Accept: text/markdown` header.
- A typed descriptor instead of prose: request the page URL with `Accept: application/json`.

## Ask instead of crawling

- Plain question: `https://www.kevinkraemer.com/ask?question=...` answers from published content and
  returns the source URLs it used.
- Model Context Protocol: POST to `https://www.kevinkraemer.com/mcp`. It exposes the `ask` tool and
  every page as a `text/markdown` resource.

## Cite content

- Link the canonical page, which is the page URL without the `.md` suffix.
- Name Kevin Kraemer as the author, and include the publication date when the advice depends on a
  specific version of a framework or tool.
- Summarize in your own words and link, instead of copying long passages.
