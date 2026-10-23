# Make your own

Instructions for Claude. The person running you wants this site rebuilt around **their** season tickets: every game in their plan, which ones they went to, which ones they resold, and what it all cost. Any team, any sport.

The site reads one file, `data/tickets.json`. It currently holds Hans's Kraken tickets as an example. Your job is to replace it with theirs. Don't change the app's code or styling.

Work in this order and keep the person informed with short updates. If a step fails, say what you tried and ask; don't guess silently.

## 0. Clean the copy

This folder is a copy of Hans's site. Before anything else:

- Delete `demos/`, `og.png` and `docs/` if they exist.
- In `index.html`, delete every `<meta property="og:…">` and `<meta name="twitter:…">` tag.
- Replace `README.md` with two lines: a `# ` title naming their team, and "Built with [krakentix](https://github.com/HansEngebretsen/krakentix)."
- Leave `<hans-footer>` and its script alone. It's the credit line.

## 1. Ask once, then go

Ask these in a single message. Offer the obvious default where there is one:

1. Team (and sport, if it's not obvious)
2. Seats per game (e.g. 2)
3. Plan: full season, half, or a number of games
4. Which seasons (default: every season you can find tickets for)
5. Where their tickets live: Ticketmaster, AXS, SeatGeek, a team app, or something else
6. The name to show in the subtitle, e.g. "Sam's" (or none)

## 2. Find the data

Use the first source that works. Tell them which one you're using.

**a. Gmail (preferred).** Use the Gmail connector's search. If you can't find Gmail tools, tell them to connect Gmail at claude.ai → Settings → Connectors, restart Claude Code, and try again. Run several searches and widen them until the counts make sense. Searches to start with (swap in their platform and team):

| What | Search |
|---|---|
| Resale payouts | `from:ticketmaster.com ("you sold" OR "sold your tickets" OR "payment" OR "orderinfo")` |
| | `from:(axs.com OR seatgeek.com OR stubhub.com) (sold OR payout OR "payment sent")` |
| Season plan cost | `"season ticket" (invoice OR "payment plan" OR receipt OR renewal) <team>` |
| | `from:<team domain> (invoice OR payment OR "account statement")` |
| Which games are in the plan | `"<team>" ("your games" OR "your schedule" OR "half season" OR "ticket package")` |

For Ticketmaster, the precise search is `subject:"tickets sold"` (from `orderinfo@ticketmaster.com` or `ticketexchangesupport@ticketmaster.com`), limited to the season with `after:` / `before:`. Each match is one sale.

Read every match. From each resale email take:
- the **game date** from the Date line in the body, not the date the email arrived (sales happen days or weeks before the game)
- the opponent
- the quantity sold
- the **payout that actually reached them** after fees: Ticketmaster's "Total Payment to you", not the listing price

Skip these, which show up in the same searches:
- **"Listed" / "Listing Confirmation" emails.** A listing isn't a sale, and the game may still have been attended.
- **"Tickets Have Been Returned" emails**, and newsletters.
- **Sales for games outside the plan**, such as an away game or a one-off they bought separately. Ask if you're unsure.

These emails list the exact seats ("Seat(s) …") and an order number. Never copy those anywhere (see the privacy rule in step 5).

**b. Their ticket account.** If there's no Gmail, use Claude in Chrome (if available) to open their ticket account's "My Tickets" / resale or sales history. They sign in themselves. Read the history. Don't change anything in the account.

**c. Files.** Ask them to drop exports into an `inbox/` folder here: a Google Takeout `.mbox`, CSV exports from the ticket site, PDF invoices or statements. Read those. `inbox/` is gitignored.

**d. Paste.** As a last resort, ask them to paste the sold-ticket emails or a list.

## 3. Work out the cost

- **Cost per game** = what the season plan cost ÷ the number of games in the plan. Look for the season invoice, renewal or payment-plan total. If a season had a different price, use that season's.
- **Cost of a resale** = cost per seat × seats sold. Cost per seat = cost per game ÷ seats.
- If you can't find a season's price, ask. Don't invent one.

## 4. Find every game in the plan

Every game they paid for gets a row, including the ones they went to. Sold games are easy because they come from step 2. For the rest:

- Use the "your games" emails or the account's ticket list first.
- If that's not available, get the team's home schedule and ask which games their plan included. Schedule sources:
  - NHL: `https://api-web.nhle.com/v1/club-schedule-season/{TEAM}/{YYYYYYYY}` (e.g. `SEA/20252026`), home games only
  - NBA, NFL, MLB, MLS and others: ESPN's public schedule (`https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams/{team}/schedule?season=YYYY`) or a web search
- Match each sale to its scheduled game by date and **full** opponent name. Watch for partial matches such as "Calgary Flames" vs "Florida": match whole team names, not fragments.

## 5. Write `data/tickets.json`

Overwrite the whole file. Shape (the current file is a full example):

```json
{
  "title": "Season ticket analyzer",
  "subtitle": "Sam's data from 3 seasons of season tickets, 2023–2026",
  "logoLabel": "Team name",
  "seats": 2,
  "about": "each matched to the official schedule. Every seat I resold went through Ticketmaster.",
  "seasons": [
    {
      "id": "25-26",
      "games": [
        { "date": "2025-10-11", "opponent": "Vegas Golden Knights", "cost": 170, "ticketsSold": 2, "ticketsKept": 0, "soldFor": 178.2, "gainLoss": 8.2, "emailLink": "https://mail.google.com/mail/u/0/#all/<threadId>" },
        { "date": "2025-10-18", "opponent": "Vancouver Canucks", "cost": 170, "ticketsSold": 0, "ticketsKept": 2, "soldFor": 0, "gainLoss": 0 }
      ]
    }
  ]
}
```

Rules:

- **Seasons:** newest first. Use ids like `"25-26"` for seasons that span two years, or `"2025"` for single-year sports.
- **One row per plan game.** A game they attended gets `ticketsSold: 0`, `ticketsKept: <seats>` and `soldFor: 0`.
- **Seats:** `ticketsSold + ticketsKept` must equal `seats` on every plan game.
- **Gain/loss:** `gainLoss = soldFor − cost` when every seat was sold. When only some seats were sold, set `cost` to the full game cost and `gainLoss` to `0`.
- **Playoffs and preseason:** add `" (Playoffs)"` or `" (Preseason)"` to the opponent name. Playoff rows also get `"isPackage": false`, which keeps them out of the season totals. Their cost is just the seats they bought.
- **Dates:** always `YYYY-MM-DD`, in the game's local time.
- **Email links:** `emailLink` is optional. Use a Gmail link to the source thread so they can click through. The links only open for them.
- **Text fields:** `about` finishes the sentence "N games across N seasons, …". `logoLabel` is the screen-reader name for the logo.

**Privacy. This file may end up public.** Never write any of these into it, or into any other file here:

- exact seat numbers
- order or confirmation numbers
- barcodes
- account or member IDs
- addresses, phone numbers or card digits

Section and row are fine only if they ask for them. `npm run check` fails on fields that look like these.

Also set `<title>` and `<meta name="description">` in `index.html` to match their team.

**Logo (optional):** if they want their team's logo, save a transparent PNG as `assets/logo.png`. The site uses it as a one-colour silhouette. Otherwise leave it.

## 6. Check and open

```bash
npm install
npm run check
npm run dev
```

- Fix anything `npm run check` reports. Warnings are worth a look too.
- Open the URL `npm run dev` prints. Use the Browser pane or the preview tools if you have them.
- Then give them a short summary:
  - each season's games, attended, resold, net cost and cost per game (the check prints this)
  - **every game where you assumed something**, such as a game you couldn't find an email for and counted as attended, or a price you inferred

Ask them to correct anything that looks off, then re-run the check.

## 7. Publishing (only if they ask)

Ask first, and say plainly that a public repo makes `data/tickets.json` public: dollar amounts, dates and email links (the links only open for them).

1. Create a repo, then `git init`, commit and push.
2. Turn on GitHub Pages with "GitHub Actions" as the source. `.github/workflows/static.yml` already builds and deploys on every push to `main`.
3. Send them the Pages URL once the workflow has finished.
