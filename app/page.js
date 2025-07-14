'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_GET_PRODUCTS_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (data && data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getProducts();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="pt-20">
        <section 
          className="relative h-[60vh] md:h-[80vh] bg-cover bg-top flex items-end justify-center pb-20 text-white"
          style={{ backgroundImage: "url('https://ueyfymtssdhcsyrwxxil.supabase.co/storage/v1/object/public/product-images//fashionhero.png?q=80&w=2187&h=1000&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">New arrivals</h1>
            <button className="mt-6 px-8 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
              Shop now
            </button>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.slice(0, 8).map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 mb-2">
                  <img 
                    src={product.image_url || 'https://placehold.co/600x800'} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">${product.price}</p>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="bg-gray-50">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Join the club</h2>
            <p className="mt-2 text-gray-600">Get exclusive deals and early access to new products.</p>
            <div className="mt-6 max-w-md mx-auto">
              <form className="flex">
                <input type="email" placeholder="Email address" className="flex-grow p-3 border border-r-0 border-gray-300 focus:ring-1 focus:ring-gray-800 focus:outline-none"/>
                <button type="submit" className="px-6 bg-gray-800 text-white font-semibold hover:bg-gray-700">→</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NUVILA, Powered by VLS
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <ProductDisplay />;
}