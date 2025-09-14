import { useState, useEffect } from "react";
import apiService from "../utils/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [settings, setSettings] = useState({
    company_name: "Roti Marawa",
    email: "info@rotimarawa.com",
    phone: "+62 123 456 789",
    address: "Jl. Roti Manis No. 123, Jakarta",
    instagram: "@rotimarawa",
    about_us: "",
    operating_hours: "7.30 - 22.00 WITA",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.get("/settings");
      setSettings((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create WhatsApp message
    const whatsappMessage =
      `Halo, saya ${formData.name}%0A%0A` +
      `Subjek: ${formData.subject}%0A` +
      `Email: ${formData.email}%0A` +
      `Telepon: ${formData.phone || "Tidak diisi"}%0A%0A` +
      `Pesan:%0A${formData.message}`;

    // Clean phone number for WhatsApp (remove spaces, +, etc.)
    const cleanPhone = settings.phone.replace(/[\s+\-()]/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-cream-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ada pertanyaan atau ingin memesan? Jangan ragu untuk menghubungi
              kami. Tim customer service kami siap membantu Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Kirim Pesan
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-xl">💬</span>
                  <p className="text-green-800 text-sm">
                    Pesan Anda akan dikirim melalui WhatsApp untuk respon yang
                    lebih cepat
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Masukkan alamat email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subjek *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Pilih subjek</option>
                    <option value="Pemesanan">Pemesanan</option>
                    <option value="Pertanyaan Produk">Pertanyaan Produk</option>
                    <option value="Keluhan">Keluhan</option>
                    <option value="Kerjasama">Kerjasama</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>Kirim via WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Informasi Kontak
              </h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">
                      Alamat
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {settings.address || "Jl. Roti Manis No. 123, Jakarta"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">
                      Telepon
                    </h3>
                    <p className="text-gray-600">
                      {settings.phone || "+62 123 456 789"}
                    </p>
                  </div>
                </div>

                {!!settings.email && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 mb-2">
                        Email
                      </h3>
                      <p className="text-gray-600">{settings.email}</p>
                    </div>
                  </div>
                )}

                {!!settings.instagram && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">📷</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 mb-2">
                        Instagram
                      </h3>
                      <p className="text-gray-600">{settings.instagram}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">
                      Jam Operasional
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>{settings.operating_hours || "7.30 - 22.00 WITA"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Contact */}
              <div className="mt-8">
                <h3 className="font-semibold text-primary-800 mb-4">
                  Hubungi Langsung
                </h3>
                <button
                  onClick={() => {
                    const cleanPhone = settings.phone.replace(/[\s+\-()]/g, "");
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=Halo, saya ingin bertanya tentang produk Roti Marawa`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💬</span>
                  <span>Chat via WhatsApp</span>
                </button>
              </div>

              {/* Social Media */}
              {/* <div className="mt-8">
                <h3 className="font-semibold text-primary-800 mb-4">Ikuti Kami</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span>📘</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span>📷</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span>🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <span>💬</span>
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-800 text-center mb-8" data-aos="fade-up">
            Lokasi Toko Kami
          </h2>
          <div className="bg-gray-300 h-96 rounded-2xl flex items-center justify-center" data-aos="fade-up">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-4">🗺️</div>
              <p>Peta akan ditampilkan di sini</p>
              <p className="text-sm">Integrasi dengan Google Maps</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;
