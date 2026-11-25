# Testing Guide: Requirements and Seeded-Fault Ideas

## Deterministic test environment

- Framework: React 17 + Create React App, run with `npm start`.
- Start URL: `http://localhost:3000`.
- Backend: none; no network requests are required.
- Reset state: click `#reset-demo` or refresh the browser before each independent test.
- All important form controls have fixed IDs and `data-testid` attributes.

## Intended behavior (test oracle)

| Rule | Expected behavior |
| --- | --- |
| Full name | Required; whitespace is trimmed; minimum 2 non-whitespace characters |
| Email | Required; must resemble `name@example.com` |
| Workshop | Python Basics $20, Web Development $30, Introduction to AI $40 |
| Initial seats | Python 8, Web 4, AI 6 |
| Quantity | Whole number from 1 through 5, inclusive |
| Availability | Quantity cannot exceed remaining seats |
| Student checkbox | 20% off |
| Promo code | Blank or `SAVE10` (case-insensitive); code gives 10% off |
| Discounts | Apply student 20% first, then promo 10%; they may stack |
| Invalid submission | Visible error(s); no success message; seats unchanged |
| Valid submission | Success message with name/workshop/quantity/total; seats decrease |
| Reset demo | Restores original inputs, error/success state, and all seats |
| Refresh | Restores starting state because data is only held in memory |

Currency is CAD. For example, two Python tickets with both discounts cost $28.80 (2 × $20 × 0.8 × 0.9). Calculations use cents, rounded to the nearest cent at each discount step.

## Useful Selenium selectors

`#full-name`, `#email`, `#workshop`, `#quantity`, `#student-discount`, `#promo-code`, `#register-button`, `#reset-demo`, `#total-price`, `#confirmation`, `[data-testid="form-warning"]`.

## Input space partitions

- Full name: blank / one character / valid two-or-more-character name
- Email: blank / malformed / valid
- Quantity: zero or negative / 1 to 5 / greater than 5 / noninteger / larger than available seats
- Student discount: unchecked / checked
- Promo code: blank / `SAVE10` / invalid
- Availability: enough seats / insufficient seats / zero remaining

## Candidate seeded faults (create one separate faulty variant per item)

These are **ideas**, not active bugs in the supplied correct source.

1. Name validation: accept blank names. Change `name.length < 2` in `validateRegistration`.
2. Quantity boundary: allow 6 tickets. Alter the `count > MAX_TICKETS` condition and set available seats accordingly (e.g., Python has 8).
3. Discount percentage: apply a 10% student discount instead of 20% in `calculateTotalCents`.
4. Availability bug: skip the `count > seats[workshop.id]` validation.
5. Email validation: accept malformed addresses that should fail.
6. Promo bug: accept an invalid code as valid.
7. Price bug: use the wrong price for the AI workshop.

Keep a git commit or branch for the **correct baseline**. For repeatable experiments, use one fault at a time and run the same test suites on each version. Document exactly which line was modified. Never inform the AI being evaluated about the planted defects in its prompt.

## Fair-comparison note

Your earlier goal document compares source-only, screenshot-only, and both, plus human-written Selenium tests. Your later initial draft also mentions rendered DOM as an input condition. Confirm with your group which conditions will be evaluated, and keep the task instructions constant across conditions.
