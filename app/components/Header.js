'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
const UserIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>);
const SearchIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>);

// --- START OF FIX ---
// The CartIconButton now uses a shopping bag icon.
const CartIconButton = () => {
  const { openCart, cartCount } = useCart();
  return (
    <button id="cart-icon-button" onClick={openCart} className="relative hover:text-gray-500">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
      </svg>
      {cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">{cartCount}</span>}
    </button>
  );
};
// --- END OF FIX ---

export default function Header() {
  const headerClasses = 'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm';
  const navTextClasses = 'text-gray-800';
  return (<header className={headerClasses}><div className="container mx-auto px-6 py-4 flex justify-between items-center"><Link href="/" className={`text-xl font-bold tracking-wider ${navTextClasses}`}>NUVILA</Link><nav className={`hidden md:flex items-center space-x-8 ${navTextClasses}`}><Link href="/category/Men" className="hover:text-gray-500">Men</Link><Link href="/category/Women" className="hover:text-gray-500">Women</Link></nav><div className={`flex items-center space-x-6 ${navTextClasses}`}><button className="hover:text-gray-500"><SearchIcon /></button><button className="hover:text-gray-500"><UserIcon /></button><CartIconButton /></div></div></header>);
}