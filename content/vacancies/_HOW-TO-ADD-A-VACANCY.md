# How to add a vacancy

Each vacancy is one markdown file in this folder. Add a file, commit it, and it
appears on `/careers` — no code change needed.

`EXAMPLE-care-assistant.md` is a template, not a real job. It has
`draft: true`, so it does **not** appear on the site. Copy it, rename it, fill
it in, and set `draft: false` when the role is real and open.

When there are no published vacancies, the careers page says so plainly and
invites a speculative application. It never shows an invented role.

## Front matter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | The job title as you would advertise it |
| `draft` | yes | `true` hides it. Set `false` to publish |
| `location` | yes | e.g. "Rugby and surrounding villages" |
| `type` | yes | e.g. "Full time", "Part time", "Bank" |
| `hours` | no | e.g. "Nights, 20:00–08:00" |
| `pay` | no | **Only put a real, agreed figure here.** Leave it out and the card says pay is discussed on application. Never guess a rate |
| `closing` | no | `YYYY-MM-DD`. Omit if the role is open-ended |
| `summary` | yes | One or two sentences, shown on the card |

Everything below the front matter is the full description, in markdown.

Delete a file (or set `draft: true`) when the role is filled.
