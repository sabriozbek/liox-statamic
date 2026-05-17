import { Link } from 'react-router'

export default function ErpPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              ERP Nedir?
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              ERP (Kurumsal Kaynak Planlaması), işletmelerin tüm temel süreçlerini 
              tek bir sistemde birleştiren yazılım çözümüdür.
            </p>
            <Link to="/iletisim" className="btn bg-blue-600 text-white hover:bg-blue-700 px-8 py-4">
              Detaylı Bilgi Alın
            </Link>
          </div>
        </div>
      </section>

      {/* What is ERP */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ERP Sistemi Nasıl Çalışır?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Merkezi Veritabanı</h3>
                    <p className="text-gray-600">Tüm departmanlar aynı verilere erişir, böylece bilgi tekrarı ve hata riski azalır.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Süreç Otomasyonu</h3>
                    <p className="text-gray-600">Manuel işlemler otomatikleşir, zaman tasarrufu sağlar ve hata oranı düşer.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Gerçek Zamanlı Raporlama</h3>
                    <p className="text-gray-600">Anlık verilerle bilinçli kararlar alın, iş performansınızı izleyin.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <img src="/images/erp-diagram.svg" alt="ERP Sistemi" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            ERP Kullanmanın Faydaları
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'chart', title: '%35', subtitle: 'Verimlilik Artışı' },
              { icon: 'clock', title: '%40', subtitle: 'Zaman Tasarrufu' },
              { icon: 'money', title: '%25', subtitle: 'Maliyet Azaltma' },
              { icon: 'check', title: '%98', subtitle: 'Hata Azaltma' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.title}</div>
                <div className="text-gray-600">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}