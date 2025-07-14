'use client'; 

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Cart from './components/Cart';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {pathname !== '/checkout' && <Header />}
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}