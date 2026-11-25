import { useState } from 'react';
import {
  WORKSHOPS,
  findWorkshop,
  initialSeats,
  calculateTotalCents,
  formatCurrency,
  validateRegistration,
  MAX_TICKETS,
} from './workshopLogic';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  workshopId: 'python',
  quantity: '1',
  isStudent: false,
  promoCode: '',
};

function WorkshopRegistration() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [seats, setSeats] = useState(initialSeats);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const selected = findWorkshop(form.workshopId);
  const remainingSeats = selected ? seats[selected.id] : 0;
  const totalCents = calculateTotalCents(form);

  function updateField(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setConfirmation(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegistration(form, seats);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setConfirmation(null);
      return;
    }

    const count = Number(form.quantity);
    const bookedWorkshop = findWorkshop(form.workshopId);
    setSeats((old) => ({ ...old, [bookedWorkshop.id]: old[bookedWorkshop.id] - count }));
    setConfirmation({
      fullName: form.fullName.trim(),
      workshopName: bookedWorkshop.name,
      quantity: count,
      totalCents,
    });
  }

  function resetDemo() {
    setForm({ ...EMPTY_FORM });
    setSeats(initialSeats());
    setErrors({});
    setConfirmation(null);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true">W</span> Campus<span className="brand-accent">Workshops</span></div>
      </header>

      <div className="page-grid">
        <aside className="intro-panel">
          <div className="eyebrow"><span className="eyebrow-dot" /> LEARN SOMETHING NEW</div>
          <h1>Build skills.<br /><span>Find your workshop.</span></h1>
          <p className="intro-copy">Choose a hands-on programming workshop, reserve your seat, and get an instant demo confirmation.</p>

          <div className="workshop-list" aria-label="Available workshops">
            {WORKSHOPS.map((workshop) => (
              <div className="workshop-card" key={workshop.id}>
                <div className="workshop-icon" aria-hidden="true">{workshop.icon}</div>
                <div className="workshop-details">
                  <strong>{workshop.name}</strong>
                  <span>{workshop.duration} · {seats[workshop.id]} seats left</span>
                </div>
                <span className="workshop-price">{formatCurrency(workshop.priceCents)}</span>
              </div>
            ))}
          </div>
          <p className="side-note">No account or payment needed. Registrations are simulated and reset when you refresh the page.</p>
        </aside>

        <section className="form-card" aria-labelledby="form-heading">
          <div className="form-header">
            <div>
              <span className="section-kicker">RESERVE YOUR SPOT</span>
              <h2 id="form-heading">Workshop Registration</h2>
              <p>Fill in the details below to register.</p>
            </div>
            <button id="reset-demo" data-testid="reset-demo" className="reset-button" type="button" onClick={resetDemo}>Reset demo</button>
          </div>

          {confirmation && (
            <div id="confirmation" data-testid="confirmation" className="confirmation" role="status">
              <span className="confirmation-check" aria-hidden="true">✓</span>
              <div><strong>Registration successful!</strong><p>{confirmation.fullName}: {confirmation.quantity} ticket(s) for {confirmation.workshopName}. Total: {formatCurrency(confirmation.totalCents)}.</p></div>
            </div>
          )}
          {Object.values(errors).some(Boolean) && (
            <p className="form-warning" role="alert" data-testid="form-warning">Please correct the highlighted fields.</p>
          )}

          <form id="registration-form" data-testid="registration-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field">
                <label htmlFor="full-name">Full name <span aria-hidden="true">*</span></label>
                <input id="full-name" data-testid="full-name" type="text" autoComplete="name" placeholder="Alex Morgan" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'name-error' : undefined} />
                {errors.fullName && <span className="field-error" id="name-error" role="alert">{errors.fullName}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
                <input id="email" data-testid="email" type="email" autoComplete="email" placeholder="alex@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <span className="field-error" id="email-error" role="alert">{errors.email}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="workshop">Select workshop <span aria-hidden="true">*</span></label>
              <select id="workshop" data-testid="workshop" value={form.workshopId} onChange={(e) => updateField('workshopId', e.target.value)} aria-invalid={Boolean(errors.workshopId)}>
                {WORKSHOPS.map((workshop) => <option value={workshop.id} key={workshop.id}>{workshop.name} — {formatCurrency(workshop.priceCents)}</option>)}
              </select>
              <span className="field-hint" data-testid="seats-remaining">{remainingSeats} seat(s) remaining for {selected?.name}</span>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="quantity">Tickets (1–{MAX_TICKETS}) <span aria-hidden="true">*</span></label>
                <input id="quantity" data-testid="quantity" type="number" step="1" min="1" max={MAX_TICKETS} value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? 'quantity-error' : undefined} />
                {errors.quantity && <span className="field-error" id="quantity-error" role="alert">{errors.quantity}</span>}
              </div>
              <div className="field">
                <label htmlFor="promo-code">Promo code <span className="optional">optional</span></label>
                <input id="promo-code" data-testid="promo-code" type="text" placeholder="SAVE10" value={form.promoCode} onChange={(e) => updateField('promoCode', e.target.value)} aria-invalid={Boolean(errors.promoCode)} aria-describedby={errors.promoCode ? 'promo-error' : undefined} />
                {errors.promoCode && <span className="field-error" id="promo-error" role="alert">{errors.promoCode}</span>}
              </div>
            </div>

            <label className="check-row" htmlFor="student-discount">
              <input id="student-discount" data-testid="student-discount" type="checkbox" checked={form.isStudent} onChange={(e) => updateField('isStudent', e.target.checked)} />
              <span><strong>I'm a student</strong><small>Apply a 20% student discount</small></span>
              <span className="check-tag">20% OFF</span>
            </label>

            <div className="summary">
              <div className="summary-top"><strong>Order summary</strong><span>{selected?.name || 'No workshop selected'}</span></div>
              <div className="summary-line"><span>Price per ticket</span><span data-testid="unit-price">{selected ? formatCurrency(selected.priceCents) : '—'}</span></div>
              <div className="summary-line"><span>Quantity</span><span data-testid="quantity-summary">{form.quantity || '0'}</span></div>
              <div className="summary-line"><span>Student discount</span><span>{form.isStudent ? '20%' : 'None'}</span></div>
              <div className="summary-line"><span>Promo discount</span><span>{form.promoCode.trim().toUpperCase() === 'SAVE10' ? '10%' : 'None'}</span></div>
              <div className="summary-total"><strong>Total</strong><strong id="total-price" data-testid="total-price">{formatCurrency(totalCents)}</strong></div>
            </div>

            <button id="register-button" data-testid="register-button" className="submit-button" type="submit">Complete Registration <span aria-hidden="true">→</span></button>
            <p className="disclaimer">Demo only — no real reservation, payment, or email is created.</p>
          </form>
        </section>
      </div>
      <footer>CampusWorkshops · CIS*4150 Software Testing Project · Demo application</footer>
    </div>
  );
}

export default WorkshopRegistration;
