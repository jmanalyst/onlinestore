import Link from 'next/link';

async function getProductsByCategory(category) {
  const url = new URL(process.env.NEXT_PUBLIC_GET_PRODUCTS_URL);
  url.searchParams.append('category', category);

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch products for category. Status: ${res.status}`);
    const data = await res.json();
    return (data && data.data && Array.isArray(data.data)) ? data.data : [];
  } catch (error) {
    console.error(`Error in getProductsByCategory for ${category}:`, error);
    throw error;
  }
}

export default async function CategoryPage({ params }) {
  const categoryName = decodeURIComponent(params.name);
  let products = [];
  let fetchError = null;

  try {
    products = await getProductsByCategory(categoryName);
  } catch (error) {
    fetchError = error.message;
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="pt-20">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold tracking-tight">{categoryName}'s Collection</h1>
        </div>
        
        <section className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {fetchError ? (
              <p className="col-span-full text-center text-red-500">Error: Could not load products. Please check your n8n workflow.</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 mb-2">
                    <img src={product.image_url || 'https://placehold.co/600x800'} alt={product.name} className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">${product.price}</p>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center">No products found in this category.</p>
            )}
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