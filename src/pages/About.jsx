import { useState, useEffect } from 'react';
import Logo from '../assets/logo.jpg';
import apiService from '../utils/api';

const About = () => {
  const [settings, setSettings] = useState({
    about_us: '',
    company_name: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.get('/settings');
      setSettings(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default content as fallback
  const defaultAboutContent = `Roti Marawa dimulai dari sebuah toko kecil di sudut kota dengan misi sederhana: 
membuat roti terbaik untuk keluarga Indonesia. Pak Marawa, pendiri kami, 
memulai perjalanan ini dengan resep warisan keluarga yang telah diwariskan 
dari generasi ke generasi.

Dengan komitmen menggunakan bahan-bahan berkualitas tinggi dan proses pembuatan 
yang teliti, kami terus berkembang dan kini melayani ribuan keluarga di seluruh 
Indonesia. Setiap roti yang kami buat adalah hasil dari dedikasi dan passion 
untuk menghadirkan yang terbaik.

Hingga hari ini, kami tetap mempertahankan nilai-nilai tradisional dalam setiap 
produk yang kami hasilkan, sambil terus berinovasi untuk memenuhi selera modern 
tanpa melupakan cita rasa autentik yang menjadi ciri khas Roti Marawa.`;

  const aboutContent = settings.about_us || defaultAboutContent;
  const companyName = settings.company_name || 'Roti Marawa';

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
              Tentang {companyName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sejak 2022, Roti Marawa telah menjadi bagian dari keluarga Indonesia dengan 
              menghadirkan roti berkualitas tinggi.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <img
                src={Logo}
                alt="Pembuat roti tradisional"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Cerita Kami
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {aboutContent.split('\n\n').map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip yang menjadi fondasi dalam setiap langkah perjalanan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">💝</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-4">Kualitas Terjamin</h3>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk selalu menggunakan bahan-bahan terbaik dan menerapkan 
                standar kualitas tertinggi dalam setiap proses produksi.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-4">Kepercayaan</h3>
              <p className="text-gray-600 leading-relaxed">
                Membangun hubungan jangka panjang dengan pelanggan berdasarkan kepercayaan, 
                kejujuran, dan pelayanan yang konsisten.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-4">Inovasi Berkelanjutan</h3>
              <p className="text-gray-600 leading-relaxed">
                Terus berinovasi dan berkembang untuk menghadirkan produk-produk baru yang 
                sesuai dengan kebutuhan dan selera zaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Tim Ahli Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dibalik setiap roti lezat, ada tim berpengalaman yang bekerja dengan penuh dedikasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="w-32 h-32 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-2">Master Baker</h3>
              <p className="text-primary-600 mb-3">Head of Production</p>
              <p className="text-gray-600 text-sm">
                Ahli pembuat roti dengan pengalaman lebih dari 20 tahun, 
                memastikan setiap produk memenuhi standar kualitas tertinggi.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-32 h-32 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">👩‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-2">Quality Manager</h3>
              <p className="text-primary-600 mb-3">Quality Control</p>
              <p className="text-gray-600 text-sm">
                Bertanggung jawab memastikan setiap produk yang keluar dari dapur 
                memenuhi standar kualitas dan keamanan pangan.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="w-32 h-32 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-2">Innovation Chef</h3>
              <p className="text-primary-600 mb-3">R&D Department</p>
              <p className="text-gray-600 text-sm">
                Mengembangkan resep dan produk baru untuk memenuhi kebutuhan 
                dan tren kuliner terkini.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div data-aos="fade-up" data-aos-delay="0">
              <div className="text-4xl font-bold text-white mb-2">4+</div>
              <div className="text-cream-100">Tahun Pengalaman</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl font-bold text-white mb-2">1K+</div>
              <div className="text-cream-100">Pelanggan Puas</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-cream-100">Varian Produk</div>
            </div>
            {/* <div data-aos="fade-up" data-aos-delay="600">
              <div className="text-4xl font-bold text-white mb-2">25</div>
              <div className="text-cream-100">Cabang Toko</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-primary-800 mb-8">
              Misi Kami
            </h2>
            <div className="max-w-4xl mx-auto bg-cream-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                &ldquo;Menghadirkan roti berkualitas tinggi yang tidak hanya memenuhi kebutuhan nutrisi, 
                tetapi juga memberikan kebahagiaan dalam setiap gigitan untuk keluarga Indonesia.&rdquo;
              </p>
              <p className="text-gray-600">
                Kami percaya bahwa makanan yang baik adalah fondasi kehidupan yang baik. 
                Oleh karena itu, kami berkomitmen untuk terus memberikan yang terbaik bagi 
                setiap keluarga yang mempercayakan kebutuhan roti mereka kepada kami.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;