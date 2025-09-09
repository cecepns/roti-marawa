import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/products/${id}`);
      if (response.success) {
        const productData = response.data;
        setProduct(productData);
        
        // Set default variant if variants exist
        if (productData.variants && productData.variants.length > 0) {
          const firstVariant = productData.variants[0];
          setSelectedVariant(typeof firstVariant === 'string' ? firstVariant : firstVariant.name || firstVariant);
        }
      } else {
        setError('Produk tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Terjadi kesalahan saat memuat produk');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await apiService.get('/settings');
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchSettings();
  }, [fetchProduct, fetchSettings]);


  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            {error || 'Produk Tidak Ditemukan'}
          </h2>
          <div className="space-x-4">
            <button 
              onClick={fetchProduct}
              className="btn-secondary"
            >
              Coba Lagi
            </button>
            <Link to="/products" className="btn-primary">
              Kembali ke Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedVariantData = product.variants && product.variants.find(v => 
    (typeof v === 'string' ? v : v.name || v) === selectedVariant
  );
  const currentPrice = selectedVariantData && selectedVariantData.price ? selectedVariantData.price : product.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    if (!settings?.phone) {
      alert('Nomor WhatsApp tidak tersedia. Silakan hubungi admin.');
      return;
    }

    const phoneNumber = settings.phone.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const variantText = selectedVariant ? `\nVarian: ${selectedVariant}` : '';
    const totalPrice = formatPrice(currentPrice * quantity);
    
    const message = `Halo! Saya ingin memesan:

*${product.name}*${variantText}
Jumlah: ${quantity} pcs
Harga per item: ${formatPrice(currentPrice)}
Total: ${totalPrice}

Apakah produk ini masih tersedia?`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-40">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary-600">Produk</Link>
            <span className="mx-2">/</span>
            <span className="text-primary-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div data-aos="fade-right">
            <div className="mb-4">
              <img
                src={product.image_path ? `https://api-inventory.isavralabel.com/roti-marawa/uploads/${product.image_path}` : 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
            {/* For now, we'll show a single image since the API only stores one image path */}
            {/* If you want multiple images, you'll need to modify the database schema */}
          </div>

          {/* Product Info */}
          <div data-aos="fade-left">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 text-primary-600 text-sm px-3 py-1 rounded-full mb-4">
                {product.category_name || 'Tidak Berkategori'}
              </span>
              <h1 className="text-3xl font-bold text-primary-800 mb-2">
                {product.name}
              </h1>
              {/* Rating section removed since it's not in the API response */}
            </div>

            <p dangerouslySetInnerHTML={{__html: product.description}} className="text-gray-600 mb-6 leading-relaxed" />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary-800 mb-3">Pilih Varian</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => {
                    const variantName = typeof variant === 'string' ? variant : variant.name || variant;
                    const variantPrice = typeof variant === 'object' && variant.price ? variant.price : product.price;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variantName)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
                          selectedVariant === variantName
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-200 text-gray-600 hover:border-primary-300'
                        }`}
                      >
                        {variantName}
                        <span className="block text-xs">
                          {formatPrice(variantPrice)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price and Quantity */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-gray-500 ml-2">per item</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  product.in_stock 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {product.in_stock ? 'Tersedia' : 'Habis'}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <label className="text-sm font-medium text-gray-700">Jumlah:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!product.in_stock}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Order via WhatsApp - {formatPrice(currentPrice * quantity)}</span>
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h3 className="text-lg font-semibold text-primary-800 mb-3">Informasi Produk</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {/* <div>
                      <span className="text-gray-600">ID Produk:</span>
                      <span className="font-medium ml-2">#{product.id}</span>
                    </div> */}
                    <div>
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium ml-2">{product.category_name || 'Tidak Berkategori'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Harga:</span>
                      <span className="font-medium ml-2">{formatPrice(product.price)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ml-2 ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.in_stock ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                    {product.variants && product.variants.length > 0 && (
                      <div>
                        <span className="text-gray-600">Varian Tersedia:</span>
                        <span className="font-medium ml-2">{product.variants.length} pilihan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;