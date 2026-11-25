export const WORKSHOPS = [
  { id: 'python', name: 'Python Basics', description: 'Write your first Python programs.', priceCents: 2000, startingSeats: 8, duration: '90 minutes', icon: '🐍' },
  { id: 'web', name: 'Web Development', description: 'Build an interactive website.', priceCents: 3000, startingSeats: 4, duration: '2 hours', icon: '💻' },
  { id: 'ai', name: 'Introduction to AI', description: 'Explore practical AI concepts.', priceCents: 4000, startingSeats: 6, duration: '90 minutes', icon: '✨' },
];

export const MAX_TICKETS = 5;
export const STUDENT_DISCOUNT_PERCENT = 20;
export const PROMO_CODE = 'SAVE10';
export const PROMO_DISCOUNT_PERCENT = 10;

export function initialSeats() {
  return Object.fromEntries(WORKSHOPS.map(({ id, startingSeats }) => [id, startingSeats]));
}

export function findWorkshop(workshopId) {
  return WORKSHOPS.find(({ id }) => id === workshopId);
}

export function validPromoCode(promoCode) {
  const code = promoCode.trim().toUpperCase();
  return !code || code === PROMO_CODE;
}

export function calculateTotalCents({ workshopId, quantity, isStudent, promoCode }) {
  const workshop = findWorkshop(workshopId);
  const count = Number(quantity);
  if (!workshop || !Number.isInteger(count) || count < 1) return 0;

  let total = workshop.priceCents * count;
  if (isStudent) total = Math.round(total * (100 - STUDENT_DISCOUNT_PERCENT) / 100);
  if (promoCode.trim().toUpperCase() === PROMO_CODE) {
    total = Math.round(total * (100 - PROMO_DISCOUNT_PERCENT) / 100);
  }
  return total;
}

export function formatCurrency(cents) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

export function validateRegistration(form, seats) {
  const errors = {};
  const name = form.fullName.trim();
  const email = form.email.trim();
  const workshop = findWorkshop(form.workshopId);
  const quantityText = String(form.quantity).trim();
  const count = Number(quantityText);

  if (name.length < 2) errors.fullName = 'Enter your full name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!workshop) errors.workshopId = 'Choose a workshop.';

  if (!/^\d+$/.test(quantityText) || !Number.isInteger(count) || count < 1 || count > MAX_TICKETS) {
    errors.quantity = 'Choose between 1 and 5 tickets.';
  } else if (workshop && count > seats[workshop.id]) {
    errors.quantity = `Only ${seats[workshop.id]} seat(s) left for this workshop.`;
  }

  if (!validPromoCode(form.promoCode)) {
    errors.promoCode = 'Invalid code. Try SAVE10 or leave it blank.';
  }
  return errors;
}
