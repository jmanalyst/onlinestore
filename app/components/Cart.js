'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

// --- Reusable Trash Icon Component ---
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);


export default function Cart() {
  const { isCartOpen, closeCart, cartItems, subtotal, cartCount, removeFromCart, updateQuantity } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/25 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-semibold text-gray-900">Cart</h2>
              {cartCount > 0 && (
                <span className="flex items-center justify-center h-6 w-6 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {cartCount}
                </span>
              )}
            </div>
            <button onClick={closeCart} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close panel</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-grow p-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Your cart is empty</p>
                <button onClick={closeCart} className="mt-4 px-6 py-2 bg-gray-800 text-white font-semibold hover:bg-gray-700">
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.cartItemId} className="flex py-6 px-6 space-x-4">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <h3><Link href={`/products/${item.id}`}>{item.name}</Link></h3>
                        <p className="ml-4 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                      <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-50">-</button>
                          <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-50">+</button>
                        </div>
                        <div className="flex">
                          <button onClick={() => removeFromCart(item.cartItemId)} type="button" className="font-medium text-gray-500 hover:text-gray-800">
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 py-6 px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                {/* --- START OF FIX --- */}
                <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700">
                  Checkout
                </Link>
                {/* --- END OF FIX --- */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}