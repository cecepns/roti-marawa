import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });

      if (selectedCategory !== "Semua") {
        params.append("category", selectedCategory);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await apiService.get(`/products?${params}`);
      if (response.success) {
        setProducts(response.data);
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      } else {
        setError("Gagal memuat produk");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Terjadi kesalahan saat memuat produk");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    selectedCategory,
    searchTerm,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.get("/categories");
      if (response.success) {
        const categoryNames = [
          "Semua",
          ...response.data.map((cat) => cat.name),
        ];
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary-50 to-cream-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Produk Kami
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi berbagai pilihan roti segar dan berkualitas tinggi yang
              kami tawarkan
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search */}
            <div className="w-full md:w-1/3" data-aos="fade-right">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2" data-aos="fade-left">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat produk...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button onClick={fetchProducts} className="btn-primary">
                Coba Lagi
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16" data-aos="fade-up">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah filter atau kata kunci pencarian
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
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
                      <div className="mb-2">
                        <span className="inline-block bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                          {product.category_name || "Tidak Berkategori"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-primary-800 mb-2">
                        {product.name}
                      </h3>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                        className="text-gray-600 mb-4 text-sm line-clamp-4"
                      />

                      {/* Variants */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Varian:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.variants.map((variant, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {typeof variant === "string"
                                  ? variant
                                  : variant.name || variant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        <Link
                          to={`/products/${product.id}`}
                          className="btn-primary text-sm"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div
                  className="flex justify-center items-center mt-12 space-x-2"
                  data-aos="fade-up"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      pagination.hasPrevPage
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Sebelumnya
                  </button>

                  <div className="flex space-x-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          page === pagination.currentPage
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      pagination.hasNextPage
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              <div
                className="text-center mt-4 text-gray-600"
                data-aos="fade-up"
              >
                Menampilkan{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                dari {pagination.totalItems} produk
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
