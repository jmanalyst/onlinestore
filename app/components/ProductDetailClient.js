'use client';

import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function ProductDetailClient({ product }) {
  const [selectedSize, setSelectedSize] = useState('XS');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  
  const addButtonRef = useRef(null);
  const [flyingImage, setFlyingImage] = useState(null);
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    // --- START OF FIX ---
    // Pass the selectedSize to the addToCart function
    addToCart(product, quantity, selectedSize);
    // --- END OF FIX ---
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    const cartIcon = document.getElementById('cart-icon-button');
    if (!cartIcon || !addButtonRef.current) return;

    const buttonRect = addButtonRef.current.getBoundingClientRect();
    setFlyingImage({
      src: product.image_url,
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
    });
  };

  useEffect(() => {
    if (!flyingImage) return;
    const cartIcon = document.getElementById('cart-icon-button');
    if (!cartIcon) return;
    const cartRect = cartIcon.getBoundingClientRect();
    const flyingEl = document.getElementById('flying-image');
    if (!flyingEl) return;
    const timeoutId = setTimeout(() => {
      flyingEl.style.left = `${cartRect.left + cartRect.width / 2}px`;
      flyingEl.style.top = `${cartRect.top + cartRect.height / 2}px`;
      flyingEl.style.transform = 'translate(-50%, -50%) scale(0)';
      flyingEl.style.opacity = '0';
    }, 10);
    const cleanupId = setTimeout(() => {
      setFlyingImage(null);
    }, 600);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(cleanupId);
    };
  }, [flyingImage]);


  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!product) {
    return <div className="text-center p-10"><h1 className="text-2xl font-bold">Product not found.</h1></div>;
  }

  return (
    <>
      {flyingImage && (
        <img
          id="flying-image"
          src={flyingImage.src}
          className="fixed object-cover rounded-lg z-[999] transition-all duration-500 ease-in-out"
          style={{
            left: `${flyingImage.startX}px`,
            top: `${flyingImage.startY}px`,
            width: '100px',
            height: '100px',
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
          }}
          alt=""
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><img src={product.image_url || 'https://placehold.co/600x800'} alt={product.name} className="w-full h-full object-cover" /></div>
          <div><img src="https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=2187&auto=format&fit=crop" alt="Detail" className="w-full h-full object-cover" /></div>
          <div><img src="https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=2187&auto=format&fit=crop" alt="Detail" className="w-full h-full object-cover" /></div>
        </div>

        <div className="sticky top-24 py-8">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-3xl">${product.price}</p>
          
          <div className="mt-8">
            <div className="flex justify-between items-center"><h2 className="text-sm font-medium">Size</h2><a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</a></div>
            <div className="mt-2 grid grid-cols-5 gap-4">
              {sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`border rounded-md py-3 px-4 text-sm font-medium uppercase transition-colors ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={handleDecrement} className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-50">-</button>
              <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
              <button onClick={handleIncrement} className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-50">+</button>
            </div>
            <button 
              ref={addButtonRef}
              onClick={handleAddToCart}
              className={`w-full py-4 px-8 font-semibold transition-colors duration-300 ${isAdded ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              {isAdded ? '✓ Added' : 'Add to cart'}
            </button>
          </div>
          
          <div className="mt-10">
            <h3 className="text-sm font-medium">Description</h3>
            <div className="mt-4 prose prose-sm text-gray-500"><p>{product.description}</p></div>
          </div>
        </div>
      </div>
    </>
  );
}