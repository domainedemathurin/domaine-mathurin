import Stripe from 'npm:stripe@13.10.0';

// Assurez-vous d'utiliser la clé secrète de test Stripe
export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});