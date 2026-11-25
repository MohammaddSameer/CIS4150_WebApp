# CampusWorkshops — React Software Testing Demo

A small, deterministic system under test (SUT) for the CIS*4150 group project on AI-generated tests.

## Run on your Mac

1. Open this project folder in VS Code.
2. In the Terminal, run `npm install` (once).
3. Run `npm start`.
4. Visit http://localhost:3000.

**This uses Create React App (not Vite), so run `npm start`, not `npm run dev`.**

## Features

- Full name and email validation
- Workshop selection (3 workshop types)
- Quantity validation (1 to 5 tickets per registration)
- Limited seat availability
- 20% student discount
- Valid promo code `SAVE10` (10% off)
- Total price calculation and registration confirmation
- Reset demo button for repeatable Selenium tests

**This is a frontend-only demo.** 

## Important files

- `src/App.js` — renders the main component
- `src/WorkshopRegistration.js` — React form and UI
- `src/workshopLogic.js` — business rules, prices, seats, and validation
- `src/index.css` — styles
- `TESTING_GUIDE.md` — expected behavior for the group's testing experiment

## Experiment design note

Use this **correct version** as the known baseline, then create **separate, controlled buggy variants** rather than hiding multiple bugs inside the main code. Run the same test sets against each variant. Record detected bugs, false positives, test execution success, fixes, and token usage.

The supplied demo is not a full authentication or booking system. This is deliberate; the goal is reliable GUI testing rather than building a production service.
