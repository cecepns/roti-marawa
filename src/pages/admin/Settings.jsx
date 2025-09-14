import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import apiService from '../../utils/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    instagram: '',
    about_us: '',
    operating_hours: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await apiService.put('/settings', settings);
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Website</h1>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Informasi Perusahaan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={settings.company_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Roti Marawa"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="info@rotimarawa.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+62 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={settings.instagram}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@rotimarawa"
                  />
                </div>

                <div>
                  <label htmlFor="operating_hours" className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    id="operating_hours"
                    name="operating_hours"
                    value={settings.operating_hours}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="7.30 - 22.00 WITA"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={settings.address}
                  onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Jl. Roti Manis No. 123, Jakarta Selatan 12345"
                />
              </div>
            </div>

            {/* About Us */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Tentang Kami
              </h2>
              <div>
                <label htmlFor="about_us" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Perusahaan
                </label>
                <textarea
                  id="about_us"
                  name="about_us"
                  rows={6}
                  value={settings.about_us}
                  onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Ceritakan tentang sejarah dan visi misi perusahaan..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan Pengaturan'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview Informasi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Nama Perusahaan</h3>
                <p className="text-gray-900">{settings.company_name || 'Belum diatur'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-900">{settings.email || 'Belum diatur'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Telepon</h3>
                <p className="text-gray-900">{settings.phone || 'Belum diatur'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Instagram</h3>
                <p className="text-gray-900">{settings.instagram || 'Belum diatur'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Jam Operasional</h3>
                <p className="text-gray-900">{settings.operating_hours || 'Belum diatur'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Alamat</h3>
                <p className="text-gray-900 whitespace-pre-line">
                  {settings.address || 'Belum diatur'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Tentang Kami</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-line">
                {settings.about_us || 'Deskripsi tentang perusahaan belum diatur'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;