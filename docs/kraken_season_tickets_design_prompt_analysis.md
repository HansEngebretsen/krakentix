# Kraken Season Ticket Analyzer & Playoff Predictor: System Architecture, Design Intent & Prompt History

---

## Part 1: Executive Summary & Design Intent Analysis

### 1. Overview & Core Purpose
This document provides complete system context, design philosophy, and user interaction history for the **Kraken Season Ticket Cost Analyzer** and **NHL Playoff Predictor/Simulator** web application suite.

What began as a financial ROI tracker for a Seattle Kraken season ticket holder (comparing upfront package costs against resold single-game tickets) evolved into an interactive data visualization platform. It combines a financial ledger with a real-time statistical simulation engine tracking playoff odds across the NHL.

---

### 2. Systematic Design Principles & User Intentionality
Throughout development, design decisions were driven by specific UX principles, mathematical constraints, and intentional design choices:

#### A. Monochromatic & Brutalist Aesthetics
* **Restraint Over Clutter**: The interface adheres strictly to a high-contrast, 3-color palette (Stark White, Deep Charcoal/Black `#1e293b`, and Slate `#dce5eb` / Neutral Muted Grays) with subtle green (`#059669`) and red (`#dc2626`) accents reserved exclusively for positive/negative financial numbers or team status changes.
* **Functional Density**: Designed for rapid visual scanning on desktop and mobile without gratuitous drop shadows or decorative fluff.

#### B. Typographic Precision (Bringhurst Principles)
* **Tabular Numerals (`font-variant-numeric: tabular-nums`)**: All monetary values, standings points, and counts use monospace tabular numbers to maintain strict alignment across vertical data grids during real-time updates.
* **Top-Aligned Superscript Currency (`$`)**: Dollar signs are rendered in superscript top-aligned to the text ascender, while units like `/g` (per game) are baseline-subscripted. Plus/minus indicators (`+`/`–`) remain standard size.
* **Optical Scale & Tracking**: Display numbers feature tight letter-spacing (`-0.04em`), while section headers and column labels use wider tracking (`0.08em` to `0.1em`) for maximum legibility.

#### C. Mathematical Concentricity in Layout Geometry
* **Nested Border Radii**: To prevent visual gaps or clipping when wrapping tables inside cards, all outer and inner radii follow the mathematical formula:
  $$R_{\text{inner}} = \max(0, R_{\text{outer}} - \text{Padding})$$
* **Responsive Scaling**: Container radii scale dynamically using CSS `clamp()` functions (e.g., `clamp(9px, 3vw, 18px)`).

#### D. Data Architecture & 3-Tier Hydration Engine
To guarantee zero loading latency while keeping data accurate and live, the application implements a 4-layer fallback pipeline:
1. **Tier 1 (Live Official NHL API)**: Direct REST fetch to `api-web.nhle.com/v1/standings/now` (bypassing CORS via a proxy layer).
2. **Tier 2 (ESPN Standings API)**: Public standings/schedule endpoint fallback (`site.api.espn.com`).
3. **Tier 3 (Gemini AI Search API Grounding)**: Structured query utilizing Google Search grounding to fetch today's standings when APIs are blocked.
4. **Tier 4 (Hardcoded Baseline Cache)**: Local fallback snapshot guaranteeing instant app boot with zero blank screens.

#### E. High-Performance Motion & Interaction Design
* **Hardware Acceleration**: All timeline transforms use GPU-bound `translate3d(0, Y, 0)` with `will-change: transform`.
* **Digit-Specific Rolodex Odometer**: Standings and percentage updates roll vertically like a slot machine reel, animating *only* the specific digit that changed (e.g., changing from 72 to 73 rolls the 2 to a 3 while the 7 remains static).
* **Zero-Latency Touch Scrubbing**: When the user drags across the 24-game simulation timeline, CSS spring transitions drop to `0ms` to lock bars directly to touch input, resuming smooth 400ms spring physics upon release.

---

## Part 2: Chronological Enumeration of User Prompts

Below is the complete sequence of user directions, prompt revisions, and requirements provided throughout the evolution of this project:

### Phase 1: Ticket Analyzer Creation & Initial Data
1. **Initial Concept & Monochromatic Constraint**:
   > *"Using only black and white design I wnat you to create a season ticket holder app cost comparison tool. It should allow me to compare the price i paid for tickets and show neat organized sortable, responsive and easy to filter tables for each ticket that was sold or bought for each season - I should be able to have a table view where i can sort by year, opponent, sold or attended and cost, and i can also just arbiturarily type strings at the top and it should live filter. above the tables shoudl be basic metrics on each season focusing on total price paid, total games attended and gain.loss of total sold tickets, cost per ticket attended - use neat pie charting and easy to read graphics for this..."*
2. **Formatting & Filter Adjustments**:
   > *"for games attended have like 9/24 and if we're filtering don't show the stats. lets improve the stats so there more visible and scnalable and add soem stats at the top for the cumulative stats over all seasons. also add in this season: and make sure we retain the links to the emails..."*
3. **Table Column Reordering & Metric Tweaks**:
   > *"put g/l as the first column in all of the tables, then revenue then cost then number sold then the rest of the columns. Remove the "total recouped" and have the pie chart be a single pie chart that has lables on left and right for sold and kept. also hav ethe "cost per kept ticket be the main number in the final tile and the net season cost be the bottom mnumber..."*
4. **Data Dataset Ingestion & Accuracy Verification**:
   > *"Update thet data and the numbers according to this: 25-26 Season... 24-25 Season... 23-24 Season... 22-23 Season..."*
5. **Brutalist 3-Color Visual Pass**:
   > *"The top stat "total tickets sold" should be "sold/kept and do a pie chart there. Get rid of th elabel "lifetime statistics, and overall lets make this a bit more visual, but keep it flat and just 3 colors"*
6. **Removing Cents & Clean Scanning**:
   > *"we don't need to maintain the cents, so make sur eyou take that out of the numbers so they concat well especially for the summaries maek thsi a bit less brutalist and maek sure its' heatly responsive make it quick and easy to scan visual and easy to understand"*

---

### Phase 2: Ledger Redesign, Superscript Formatting & Bar Charts
7. **Ledger Table Format & Typography**:
   > *"Get rid fo the "12 records" and make the season title a bit smaller. Change the top section to a table that looks like this for each season: make it accurate and use superscript $ that is aligned with the top of the ascender"*
8. **Monospace & Alignments**:
   > *"Also use monospace font, and amkes ure all dollar signs on the whole siter are superscript aligned to the top make sure the summary table at the top has nealty aligned rows so everythign is in line like the screenshot i sent you. the plus and minus inducations should not be super script and the /g indication shoould be subscript aligned with baseline"*
9. **Header Styling & Color Rules**:
   > *"update the styling to match this exactly but use the existing superscript logic, don't recolor the pipes in the header stats:"*
10. **Reordering Ledger Rows & Header Totals**:
    > *"put the kept row on top so it's above "paid" then sold, then paid (reverse the order) and don't letter space that or any of the numbers or anything, match the same exact font size and style as the header row lables for the tables below. adjust the input at the top of the page for the placeholder to just say (/) to filter by opponent, date or amount" change the titel of the ssite to "What hans paid for kraken tickets" and left justify it... replace the top totals with: $/s, sold / attended, avg price /t, +/-"*
11. **Per-Game Gain/Loss Bar Charts & Interactive Sync**:
    > *"Change the titles to just 25-26, etc for better syntax. remove the emojis from the row headers. Add a bar chart at the bottom of each table that's subtle, where the x axis it eh g/l of a game sold and the Y axis is a n individual bar for each table row in the the table rows of things sold. when i hover a bar or a table row. it higlights in the bar chart below and visa versa."*
12. **Dynamic Chart Scaling & Theme Inversion**:
    > *"make sure the x height of the bar chart is determined by the data inside the season... change the background on the kept label to be #1e293b and the text color to be white... set the background color of the top stats to be #f9fafc..."*
13. **Keyboard Shortcuts & Header Unwrapping**:
    > *"Wire up the keyboard shortcutl of / to be active in the filter... take that part and the titel fo the page and the input outside of a card and put it at the top of the page - also take the "global averages" outside of a card and make them a tiny bit bigger. and make sure it's lableed as "Average per season""*
14. **Y-Axis Range & Proportionate Bars**:
    > *"so no labels on teh x axis and on the y axis it should be the greatest gain in a single set of ticket sales... $0 is put on the proportionate apprpriate part of the x axis (in the middle)... make sure that the entire table wrapper on top with the chart is colored with the slate background color..."*
15. **Transparent Charts & Min/Max Labels**:
    > *"mkae the pipes in teh summary the same color as the text iand add a space before and after them. Also make sure that the "averaage per season" label is on a different row at teh top left above the stats... make sure the gains in the bar chart are colored a subtle green and make sure that we have an x label on the x axis that shows the max loss and max gain for that given season chagne the background of the entire chart to be transparent omstead of grey"*
16. **Chart & Table Structural Reorganization**:
    > *"okay new plan, remove the last column on the summary table (the +/- ) and put the net gain/ or loss of the sold in teh same style at the top right of the bar chart . Then lets move the bar chart to above the table..."*
17. **Concentric Border Radius Rules**:
    > *"adjust the inner border radius for the data table and for the tables themselves to this: Use $R_{inner} = \max(0, R_{outer} - \text{Padding})$ for concentricity, clamp() for responsiveness, and 9999px for pill shapes..."*

---

### Phase 3: Expansion to Playoff Predictor & Mobile Simulator
18. **Initial Playoff Probability Tool**:
    > *"Make me a quick visualization of the probablitlity of the kraken making the playoffs. Assume they win tonight make it simple and easy to interact with use just black on white e"*
19. **Single-Screen Mobile Density & Schedule Correction**:
    > *"Is that true that they only have 5 more games left? Add some small big bold obvious kraken specific details. Make this so I can interact with it in one view on mobile. High density."*
20. **Pacific Division Timeline Simulator & Scenario Tabs**:
    > *"Add a tab that simulated three separate scenarios for the pacific division and plays the standings for the next 24 games across a timeline showi no it’s effect in the visual bar graph of teams scenario one is the most likely two is kraken do well and three is kraken don’t do well."*
21. **Auto-Play Loop, Cutoff Lines & Position Flashes**:
    > *"Have the simulator auto play... and make the games left tracker in the auto play a bit more visual... Fix those svgs for the team logos... simulate the wildcard spot teams... highlight the playoff spots visually in that graph and visually highlight when the kraken change positions."*
22. **Physics Easing & Global Scenario Sync**:
    > *"Make sure that there’s smooth meaningful motion and movement of the bars when changing places. Right now it’s jittery also make sure that the three tab options at the top exist in both simulate and predictor mode so that we can quickly use those tabs to quickly select the below settings in batch in predictor mode too"*
23. **Interactive Scrubbing & Rolodex Odometer**:
    > *"For the “simulating game” replace the counter text with 18/24 games left | April 2 also add a sorta Rolodex text effect to the text on the standing number as they update"*
24. **Digit-Specific Rolodex Math & CSS System Architecture**:
    > *"Only Rolodex the number that changes. For instance if it’s “72” changing to “73” then don’t Rolodex the 7 too just the 2 to 3. Finally let’s prepare for this to be reused. Make a quick strategy for applying mindful efficient css classes..."*
25. **Decoupled Data Layer & 32-Team Support**:
    > *"Think of 10 ways you could make this app more modern, simpler, quicker and more efficient... along with storing the data as a separate layer (we’re going to eventually allow someone to select ANY TEAM...)"*
26. **Global Standings Dropdown Menu**:
    > *"Make the dropdown the current global standings by division. Make sure that this is an entire separate set of data that we can host somewhere else and update nightly or something."*
27. **3-Stop Segmented Scenario Control**:
    > *"make the slider for surge or statistical average a multi-toggle that uses anchor position to transition the mackground smoothly. Make sure the subtext appears as subtext and selecting something new doesn’t shift the layout of the thing you just selected... Also show the remaining players in the division..."*
28. **Bringhurst Typographic Refinement**:
    > *"You’re a Nobel prize winning typographer. Specialties in things like brignhurst elements of typographic style. Hierarchy alignment balance and priority are key fix the site so it’s much more carefully crafted and typography is perfect and finely tuned..."*

---

### Phase 4: Live Data Hydration, API Fallbacks & Final Visual Layout
29. **NHL Live API Integration**:
    > *"Do some research and look at github for people who have understood and figured out the nhl app and figure out a way to hook into the nhl api for this so our data is super fresh and live. Don’t change anything at all about the ui..."*
30. **3-Tier Hydration Fallback Waterfall**:
    > *"You should use 3 fallbacks that don’t effect the hi: 1 - nhl API 2 - Gemini call that asks for the data in a consistent format and to the exact updated date 3 - cached data that you’ve updated"*
31. **ESPN API & Live Data Inspector Overlay**:
    > *"Use ESPN for the rest of the scheudle... then also add it to the fallbacks so we have the NHL live API then fallback to ESPN scores then gemini. add a hyperlink at the bottom of the page next to the API that says "view data" and it takes hover and allows me to view the current cache, the NHL live API and make a request to get the GEmini data..."*
32. **Fixing Central Division Wildcard Seeding Logic**:
    > *"something is not being calculated correctly because right now the simulator has colorado in place for the wildcard game and they're the best in the league, so they would never be wildcard in most scenarios"*
33. **Schedule & Discrete Pace Slider Layout**:
    > *"in the "next 5 games" box rename it to "schedule" and below the fifth game, have a reversed out label that says "Following X games"... the righthand side of that should be a sorta discreet slider that indicates the options for < .500, .500, .600, and .700 + ... make sure the "rivals" box lays out full width..."*
34. **Consider Wildcard Toggle & Top-3 Division Rules**:
    > *"at the bottom of predictor in the header of the "wildcard rivals" have a toggle... for "consider wildcard" when it's toggled off it disables the wildcard rivals and removes the wildcard spot from the calculation... togglign it off shoudl assume that noone CAN take the wildcard spot - meaning that it doesn't exist - so the team would HAVE to be in the top 3 in the division"*
35. **Scroll-Bound Sticky Header & Franchise Color Pulsing**:
    > *"Don't stick the header of the predictor page. allow me to scroll but when i scroll, stick the number but have it use css scroll bound animation to make it smaller as i scroll and it sticks to the top... instead of green and red... highlight the team with the team's approproaite color... clicking on different places in the simulator timeline should skip tot hat piont..."*
36. **Proportional Menu Bars & Division Leader Tabs**:
    > *"make sure in teh menu the width of the blocks are somewhat proportionate to the number (100% width being the top team in the leagues nubmer and 50% being the bottom team's number) For the teams in the top 3 in the division - show their svg logo to the left of the name text - with a background in the team color..."*
37. **Unified Single-View Layout (Schedule + Simulator Stack)**:
    > *"lets just have the SIM underneath of the predict section - so that we dont' ahve two views/pages we just place the kt-stack kt-flex-1 that is in if we click SIM to below the data in predict and we remove the view: predict and SIM form the header"*
38. **Vertical Bar Baseline Justification & Centered Chart Grid**:
    > *"Justify the graphs at their baseline so they all stack on teh X and the height of the different sections changes when the growinstead of the bottom fo them. Also my dropdown now isn't working please make sure it works"*
39. **API Hydration Documentation Spec**:
    > *"Create a separate .md file that is a design doc spec for the specific methodoloy we've discussed for utilizing the nhl api, and the espn api, and the gemini as fallback and cache as fallback... include the limitiations and strategies to reduce the amount of calls, and update cache"*
40. **Ticket Sales Confirmation Email Searches**:
    > *"Do some research in my email based on all the kraken tickets that I sold last year (the 2025-26 season) they shoudl be under a ticketmaster receipt email called orderinfo... make a table on game date, game time and total sold for... include the number of tickets that sold with the order... assume that I'm paying $80/ticket/game add a column that is loss/gain... pair them with the right email links and add opponent..."*

---

## Part 3: Data Schema & Package Definition Reference

### 1. Half-Season Package Allocation (Red vs. Blue Line)
The Seattle Kraken divide home games into two 22-game half-season packages at Climate Pledge Arena:
* **Red Line Package**: Contains Home Opener (e.g., Oct 23 vs Canucks in 21-22), key rivalry games, and 3 Original Six matchups.
* **Blue Line Package**: Contains Home Season Finale, balanced Pacific Division games, and 3 Original Six matchups.

### 2. Five-Year Ticket Cost & Attendance Snapshot
* **Seat Location**: Section 202, Row B (3 Seats)
* **2021-2022**: ~\$90/ticket cost basis ($270/game) | Recoup model applied to 21 Blue Line games.
* **2022-2023**: \$90/ticket cost basis ($270/game) | 39 tickets kept (13 games attended) | Net Regular Season Cost: \$2,820 | Cost/Kept Tix: \$72.31.
* **2023-2024**: \$93/ticket cost basis ($279/game) | 28 tickets kept (10 games attended) | Net Season Cost: \$1,959 | Cost/Kept Tix: \$70.00.
* **2024-2025**: \$93/ticket cost basis ($279/game) | 40 tickets kept (14 games attended) | Net Season Cost: \$3,487 | Cost/Kept Tix: \$87.17.
* **2025-2026**: \$85/ticket cost basis ($255/game) | 24 tickets kept (9 games attended) | Net Season Cost: \$2,164 | Cost/Kept Tix: \$90.16.

---

## Summary
This document encapsulates the complete system specifications, typographic design guidelines, API fallback workflows, and historical prompts for the **Kraken Season Ticket Analyzer & Playoff Predictor**. It serves as an authoritative context file for future LLM iterations or system maintenance.