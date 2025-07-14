'use client';

import { useState } from 'react'; // Import useState
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe

// Reusable Input Component with state handling
const Input = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div>
    <label className="text-xs text-gray-800">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-800 focus:outline-none text-black"
    />
  </div>
);

const ShoppingBagIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
    </svg>
);

// Main Checkout Page Component
export default function CheckoutPage() {
  const { cartItems, subtotal } = useCart();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- START OF FIX ---
  const handlePayNow = async () => {
    setIsLoading(true);

    // 1. Load Stripe
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const stripe = await stripePromise;

    // 2. Call your n8n workflow to create a checkout session
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CREATE_CHECKOUT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItems: cartItems, 
          totalAmount: subtotal, 
          email: email // Use the email from the form
        }),
      });
      
      const session = await response.json();
      
      // The n8n workflow might return the session object nested
      const checkoutSession = session.json || session;

      if (!checkoutSession.id) {
          throw new Error("Failed to create Stripe session.");
      }

      // 3. Redirect to Stripe's hosted checkout page
      await stripe.redirectToCheckout({ sessionId: checkoutSession.id });

    } catch (error) {
      console.error('Checkout failed:', error);
      alert("Checkout failed. Please try again."); // Replace with a better error UI
      setIsLoading(false);
    }
  };
  // --- END OF FIX ---

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="border-b border-gray-200">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex justify-end items-center py-6 px-6">
            <div className="w-full max-w-xl">
              <Link href="/" className="text-2xl font-bold tracking-wider text-black">NUVILA</Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-start py-6 px-6 bg-gray-50 border-l border-gray-200">
            <div className="w-full max-w-md">
              <button className="ml-auto block"><ShoppingBagIcon /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-end py-12 px-6">
          <div className="w-full max-w-xl">
            <div className="text-center border-b border-gray-200 pb-8">
              <p className="text-sm text-gray-800 mb-4">Express checkout</p>
              <div className="flex justify-center space-x-2">
                <button className="flex-1 py-3 bg-[#5a31f4] text-white font-bold rounded-md">Shop Pay</button>
                <button className="flex-1 py-3 bg-gray-200 text-black font-bold rounded-md">Apple Pay</button>
                <button className="flex-1 py-3 bg-[#ffc439] text-black font-bold rounded-md">G Pay</button>
              </div>
            </div>

            <div className="text-center my-4 text-xs text-gray-500">OR</div>

            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-black">Contact</h2>
                    <a href="#" className="text-sm text-blue-600">Log in</a>
                </div>
                <Input 
                  label="Email or mobile phone number" 
                  placeholder="Email or mobile phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="offers" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="offers" className="ml-2 text-sm text-gray-800">Email me with news and offers</label>
                </div>
              </section>
              
              <section>
                <h2 className="text-lg font-semibold mb-4 text-black">Delivery</h2>
                <div className="space-y-4">
                  <Input label="Country/Region" placeholder="United States" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First name (optional)" />
                    <Input label="Last name" />
                  </div>
                  <Input label="Address" placeholder="Address" />
                  <Input label="Apartment, suite, etc. (optional)" />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="City" />
                    <Input label="State" placeholder="Texas" />
                    <Input label="ZIP code" />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-4 text-black">Payment</h2>
                <p className="text-xs text-gray-800">All transactions are secure and encrypted.</p>
                <div className="border border-gray-300 rounded-md mt-4 p-4">
                  <div className="space-y-4">
                    <Input label="Card number" placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiration date (MM / YY)" />
                      <Input label="Security code" />
                    </div>
                    <Input label="Name on card" />
                  </div>
                </div>
              </section>
            </div>

            <button 
              onClick={handlePayNow} 
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Pay now'}
            </button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto bg-gray-50 border-l border-gray-200">
          <div className="flex justify-start py-16 px-6">
            <div className="w-full max-w-md">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex items-center justify-between py-4 space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 rounded-md border border-gray-200">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded-md" />
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-black">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.size}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm text-black whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-8 mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-800">Subtotal</p>
                  <p className="font-medium text-black">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-800 flex items-center">
                    Shipping
                    <svg className="w-4 h-4 ml-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  </p>
                  <p className="text-xs text-gray-600">Enter shipping address</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-xl text-black">
                  <p>Total</p>
                  <p>USD ${subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
