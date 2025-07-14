import ProductDetailClient from '@/app/components/ProductDetailClient';

// This function fetches data on the server.
async function getProduct(id) {
  const singleProductUrl = process.env.NEXT_PUBLIC_GET_SINGLE_PRODUCT_URL;
  if (!singleProductUrl) {
    console.error("URL not set");
    return null;
  }
  const url = new URL(singleProductUrl);
  url.searchParams.append('id', id);
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.json || data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// This is the main page component. It's an async Server Component.
export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  return (
    <div className="bg-white text-gray-800">
      <main className="pt-24 md:pt-32">
        <div className="container mx-auto px-6">
          {/* We render the client component and pass the fetched product data as a prop */}
          <ProductDetailClient product={product} />
        </div>
        
        <section className="bg-gray-50 mt-16">
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

       <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NUVILA, Powered by VLS
        </div>
      </footer>
    </div>
  );
}