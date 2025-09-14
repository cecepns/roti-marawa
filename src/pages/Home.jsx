import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/api";
import bannerImage from "../assets/banner.jpeg";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Fetch first 3 products as featured products
      const response = await apiService.get("/products?limit=3");
      if (response.success) {
        setFeaturedProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      // Fallback to static data if API fails
      setFeaturedProducts([
        {
          id: 1,
          name: "Roti Tawar Premium",
          price: 15000,
          image_path: null,
          description: "Roti tawar lembut dengan tekstur yang sempurna",
        },
        {
          id: 2,
          name: "Croissant Butter",
          price: 25000,
          image_path: null,
          description: "Croissant renyah dengan butter premium",
        },
        {
          id: 3,
          name: "Donat Glazed",
          price: 12000,
          image_path: null,
          description: "Donat lembut dengan glazed manis",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Test AOS Element */}

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
            data-aos="fade-up"
          >
            Roti Marawa
          </h1>
          <p
            className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Roti Segar Berkualitas Tinggi, Dibuat dengan Resep Tradisional Turun
            Temurun
          </p>
          <div
            className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link to="/products" className="btn-primary inline-block">
              Lihat Produk
            </Link>
            <Link to="/about" className="btn-secondary inline-block">
              Tentang Kami
            </Link>
          </div>
        </div>

        {/* Floating bread icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-10 text-6xl text-white/30 animate-bounce drop-shadow-lg"
            style={{ animationDelay: "0s" }}
          >
            🥖
          </div>
          <div
            className="absolute top-40 right-20 text-4xl text-white/30 animate-bounce drop-shadow-lg"
            style={{ animationDelay: "1s" }}
          >
            🥐
          </div>
          <div
            className="absolute bottom-40 left-20 text-5xl text-white/30 animate-bounce drop-shadow-lg"
            style={{ animationDelay: "2s" }}
          >
            🍞
          </div>
          <div
            className="absolute bottom-20 right-10 text-3xl text-white/30 animate-bounce drop-shadow-lg"
            style={{ animationDelay: "0.5s" }}
          >
            🥯
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai roti segar dan berkualitas tinggi yang dibuat
              dengan bahan-bahan premium
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat produk unggulan...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        product.image_path
                          ? `https://api-inventory.isavralabel.com/roti-marawa/uploads/${product.image_path}`
                          : "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary-800 mb-2">
                      {product.name}
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{ __html: product.description }}
                      className="text-gray-600 mb-4 line-clamp-4"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="btn-primary"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12" data-aos="fade-up">
            <Link to="/products" className="btn-primary">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-primary-800 mb-4">
              Mengapa Pilih Roti Marawa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami adalah memberikan roti berkualitas terbaik dengan
              pelayanan yang memuaskan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">
                Bahan Premium
              </h3>
              <p className="text-gray-600">
                Menggunakan bahan-bahan pilihan terbaik dan berkualitas tinggi
                untuk setiap produk
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">
                Resep Tradisional
              </h3>
              <p className="text-gray-600">
                Resep turun temurun yang telah terbukti menghasilkan roti dengan
                cita rasa autentik
              </p>
            </div>

            <div
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🕒</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">
                Selalu Segar
              </h3>
              <p className="text-gray-600">
                Diproduksi setiap hari untuk menjamin kesegaran dan kualitas
                roti yang optimal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" data-aos="fade-up">
            Rasakan Kelezatan Roti Marawa
          </h2>
          <p
            className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Kunjungi toko kami atau hubungi untuk pemesanan. Nikmati roti segar
            berkualitas tinggi!
          </p>
          <div
            className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link
              to="/contact"
              className="bg-white text-primary-600 hover:bg-cream-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
            >
              Hubungi Kami
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
