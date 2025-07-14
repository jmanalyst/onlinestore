'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ cartItems, totalAmount, email }) {
  const handleCheckout = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CREATE_CHECKOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, totalAmount, email }),
      });

      const session = await response.json();

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: session.id });

    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return <button onClick={handleCheckout} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Checkout</button>;
}
