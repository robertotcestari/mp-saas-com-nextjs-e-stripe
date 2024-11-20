import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function fetchSubscriptionByEmail(email: string) {
  const customers = await stripe.customers.list({
    limit: 1,
    email: email,
    expand: ['data.subscriptions'],
  });

  if (customers.data.length === 0) {
    return null;
  }

  const customer = customers.data[0];

  if (customer.subscriptions?.data.length === 0) {
    return null;
  }

  const subscription = customer.subscriptions?.data[0];

  return subscription;
}

export function translateSubscriptionStatus(status: string) {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'canceled':
      return 'Cancelado';
    default:
      return status;
  }
}

export function translateSubscriptionInterval(interval: string) {
  switch (interval) {
    case 'month':
      return 'Mensal';
    case 'year':
      return 'Anual';
    default:
      return interval;
  }
}
