/**
 * API Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * CTA Variants
 */
export const CTA_VARIANTS = {
  1: {
    formTitle: 'Demo Talep Formu',
    formSubtitle: 'Formu doldurun, danışmanlarımız sizi arayalım.',
    submitLabel: 'DEMO TALEP EDİN',
  },
  2: {
    formTitle: 'Demo Talep Formu',
    formSubtitle: 'TÜM ALANLARI DOLDURUN',
    submitLabel: 'TALEBİMİ İLET',
  },
  3: {
    formTitle: 'Demo Talep Formu',
    formSubtitle: 'RAPORUNUZU İNDİRİN',
    submitLabel: 'RAPORU İNDİR',
  },
  4: {
    formTitle: 'Demo Talep Formu',
    formSubtitle: 'FİRMANIZA ÖZEL ÇÖZÜM İÇİN',
    submitLabel: 'BİLGİ İSTE',
  },
}

/**
 * Employee Count Options
 */
export const EMPLOYEE_COUNTS = [
  { value: '1-9', label: '1-9 çalışan' },
  { value: '10-49', label: '10-49 çalışan' },
  { value: '50-249', label: '50-249 çalışan' },
  { value: '250-999', label: '250-999 çalışan' },
  { value: '1000+', label: '1000+ çalışan' },
]

/**
 * Customer Logos - Local assets
 */
export const CUSTOMER_LOGOS = [
  {
    id: 'madensuyu',
    name: 'Madensuyu',
    logoSrc: '/assets/madensuyu.svg',
  },
  {
    id: 'onur',
    name: 'Onur',
    logoSrc: '/assets/onur.png',
  },
  {
    id: 'fabay',
    name: 'Fabay Group',
    logoSrc: '/assets/fabay.png',
  },
  {
    id: 'entes',
    name: 'Entes Elektronik',
    logoSrc: '/assets/entes.png',
  },
  {
    id: 'denizgyo',
    name: 'DenizGYO',
    logoSrc: '/assets/denizgyo.png',
  },
  {
    id: 'secant',
    name: 'Secant Savunma ve Havacılık',
    logoSrc: '/assets/secant.png',
  },
  {
    id: 'yigitaku',
    name: 'Yiğit Akü',
    logoSrc: '/assets/yigitaku.svg',
  },
  {
    id: 'sunny',
    name: 'Sunny',
    logoSrc: '/assets/sunny.png',
  },
  {
    id: 'onvo',
    name: 'Onvo',
    logoSrc: '/assets/onvo.png',
  },
  {
    id: 'adell',
    name: 'Adell',
    logoSrc: '/assets/adell.png',
  },
  {
    id: 'sanica',
    name: 'Sanica',
    logoSrc: '/assets/sanica.png',
  },
  {
    id: 'eroglu',
    name: 'Eroğlu',
    logoSrc: '/assets/eroglu.png',
  },
]

/**
 * Success Stories
 */
export const SUCCESS_STORIES = [
  {
    id: 'fabay',
    company: 'Fabay Group',
    sector: 'İnşaat ve Gayrimenkul',
    description:
      "Fabay Group, tüm iş kollarındaki operasyonlarını LIOX ERP ile entegre ederek yönetim süreçlerini tek platformdan gerçekleştiriyor. İnşaat projelerinde bütçeden nakit akışına kadar tüm detaylar anlık izleniyor.",
    youtubeId: 'HYpLnoV7ZmA',
    logoId: 'fabay',
  },
  {
    id: 'entes',
    company: 'ENTES Elektronik',
    sector: 'Elektrik ve Elektronik Üretimi',
    description:
      "ENTES Elektronik, üretimden finansa kadar tüm operasyonlarını LIOX ERP üzerinde yöneterek departmanlar arası entegrasyon ve yüksek verimlilik sağlıyor.",
    youtubeId: 'APM1Sr-pEI0',
    logoId: 'entes',
  },
  {
    id: 'akca',
    company: 'Akça Lojistik',
    sector: 'Lojistik ve Taşımacılık',
    description:
      "Akça Lojistik, LIOX ERP ile depo, nakliye ve finans süreçlerini tek platformda birleştirerek operasyonel maliyetlerini düşürüyor ve karar alma hızını artırıyor.",
    youtubeId: 'dvsA9mamY0s',
    logoId: 'akca',
  },
  {
    id: 'turan',
    company: 'Turan Plastik Ambalaj',
    sector: 'Plastik Üretimi',
    description:
      "Turan Plastik Ambalaj, stok ve üretim planlamasını LIOX ERP ile uçtan uca yöneterek ihracat operasyonlarında hız ve esneklik kazanıyor.",
    youtubeId: 'bKhhVoiW-rI',
    logoId: 'turan',
  },
  {
    id: 'secant',
    company: 'Secant Savunma ve Havacılık',
    sector: 'Savunma ve Havacılık',
    description:
      "Secant Savunma ve Havacılık, LIOX ERP ile üretim maliyetlerini kontrol altına alırken, tüm departmanlarında izlenebilir ve sürdürülebilir süreçler oluşturuyor.",
    youtubeId: 'PMBh_zvNNJg',
    logoId: 'secant',
  },
  {
    id: 'adell',
    company: 'Adell Armatür ve Vana Fabrikaları',
    sector: 'Vana ve Armatür Üretimi',
    description:
      "Adell, LIOX ERP ile üretim planlama, mali işler ve diğer departmanlar arasında güçlü entegrasyon sağlayarak verimliliği artırıyor.",
    youtubeId: '1QXzeL_-76s',
    logoId: 'adell',
  },
  {
    id: 'burkay',
    company: 'Burkay İnşaat',
    sector: 'Yapım İnşaat Yönetimi',
    description:
      "Burkay İnşaat, projelerini LIOX ERP ile uçtan uca yönetiyor. Nakit akışı ve raporlama süreçleri hızlanırken, esnek yapısı sayesinde süreç değişikliklerine hızlı uyum sağlanıyor.",
    youtubeId: 'Cvs--MZbUt8',
    logoId: 'burkay',
  },
  {
    id: 'kopuz',
    company: 'Vega Gıda (Kopuz Şirketler Grubu)',
    sector: 'Gıda, Otomotiv ve Yan Sanayi',
    description:
      "Vega Gıda, LIOX ERP ile 14 firma ve 53 iş yerindeki tüm iş süreçlerini entegre biçimde yönetiyor. Üretim ve finans süreçleri arasındaki entegrasyon sayesinde karar alma hızlanıyor.",
    youtubeId: 'VG1s_99boHg',
    logoId: 'kopuz',
  },
]

/**
 * Sectors
 */
export const SECTORS = [
  {
    id: 'makine-metal',
    label: 'Makine Metal',
    icon: 'fa-solid fa-industry',
    description: 'Makine ve metal üretiminde uçtan uca görünürlük ve maliyet kontrolü.',
    items: ['Kalıp takibi', 'MES entegrasyonu', 'Sipariş bazlı maliyet', 'Fason takibi'],
  },
  {
    id: 'plastik-ambalaj',
    label: 'Plastik ve Ambalaj',
    icon: 'fa-solid fa-box-open',
    description: 'Plastik ve ambalaj üretiminde reçete, fire ve termin süreçleri.',
    items: ['Reçete yönetimi', 'Fire takibi', 'Yan ürün', 'MES entegrasyonu'],
  },
  {
    id: 'gida',
    label: 'Gıda ve İçecek',
    icon: 'fa-solid fa-bottle-droplet',
    description: 'Gıda sektöründe parti lot takibi ve hijyen standartları.',
    items: ['Parti/lot takibi', 'Raf ömrü yönetimi', 'HACCP uyumu', 'Tedarik zinciri'],
  },
  {
    id: 'tekstil',
    label: 'Tekstil ve Konfeksiyon',
    icon: 'fa-solid fa-shirt',
    description: 'Tekstil üretiminde hammadde takibi ve sipariş yönetimi.',
    items: ['Hammadde takibi', 'Kalite kontrol', 'Sipariş yönetimi', ' Maliyet analizi'],
  },
  {
    id: 'lojistik',
    label: 'Lojistik ve Depo',
    icon: 'fa-solid fa-truck-fast',
    description: 'Lojistik süreçlerinde depo ve nakliye yönetimi.',
    items: ['Depo yönetimi', 'Nakliye takibi', 'Rota optimizasyonu', 'Fatura yönetimi'],
  },
  {
    id: 'insaat',
    label: 'İnşaat ve Gayrimenkul',
    icon: 'fa-solid fa-building',
    description: 'İnşaat projelerinde bütçe ve kaynak yönetimi.',
    items: ['Proje bütçesi', 'Nakit akışı', 'Kaynak planlama', 'Hakediş takibi'],
  },
  {
    id: 'otomotiv',
    label: 'Otomotiv ve Yan Sanayi',
    icon: 'fa-solid fa-car',
    description: 'Otomotiv sektöründe tedarik zinciri entegrasyonu.',
    items: ['Tedarikçi yönetimi', 'Kalite kontrol', 'Sevkiyat takibi', 'Maliyet analizi'],
  },
  {
    id: 'savunma',
    label: 'Savunma ve Havacılık',
    icon: 'fa-solid fa-jet-fighter-up',
    description: 'Savunma sektöründe güvenlikli ve izlenebilir süreçler.',
    items: ['İzlenebilirlik', 'Güvenlik', 'Kalite belgelendirme', 'Maliyet kontrolü'],
  },
]

/**
 * ERP Modules
 */
export const MODULES = [
  {
    id: 'finans',
    title: 'Finans Yönetimi',
    icon: 'fa-solid fa-coins',
    description: 'Muhasebe ve finans yönetiminde hatayı sıfıra indirin.',
    longDescription: 'Gelir, gider, nakit akışı, bütçe ve mali tabloları tek merkezden yönetin. Çok para birimli yapılar, farklı şirket ve şube kurguları için konsolide raporlar oluşturun. Onay süreçleri ve raporlama ile finans ekibinizin iş yükünü azaltın.',
    highlights: [
      'Tüm finansal hareketlerin gerçek zamanlı takibi',
      'Bütçe ve gerçekleşen kıyaslamaları',
      'Çok para birimli muhasebe ve raporlama',
    ],
    mediaUrl: 'https://images.pexels.com/photos/4968633/pexels-photo-4968633.jpeg',
  },
  {
    id: 'depo',
    title: 'Depo Yönetimi',
    icon: 'fa-solid fa-boxes',
    description: 'Mal kabul, stok ve sevkiyat süreçlerinizi dijitalleştirin.',
    longDescription: 'Ürün giriş-çıkışlarını, raf yerleşimlerini ve sayımları barkod veya el terminali ile yönetin. Stok seviyelerinizi izleyip kritik eşiklere göre uyarılar tanımlayın. Çoklu depo yapısında tüm lokasyonları tek ekrandan yönetin.',
    highlights: [
      'Gerçek zamanlı stok görünürlüğü',
      'Barkod ve el terminali entegrasyonu',
      'Çoklu depo ve lokasyon takibi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg',
  },
  {
    id: 'satinalma',
    title: 'Satın Alma Yönetimi',
    icon: 'fa-solid fa-shopping-cart',
    description: 'Müşteri beklentilerinin daha hızlı karşılanmasını sağlayın.',
    longDescription: 'Tedarikçi tekliflerini toplayın, karşılaştırın ve onay süreçleri ile en doğru satın alma kararını verin. Sipariş, teslimat ve fatura akışını uçtan uca takip ederek maliyetleri kontrol altında tutun.',
    highlights: [
      'Teklif toplama ve karşılaştırma ekranları',
      'Onay ve bütçe kontrol süreçleri',
      'Tedarikçi performans raporları',
    ],
    mediaUrl: 'https://images.pexels.com/photos/3965549/pexels-photo-3965549.jpeg',
  },
  {
    id: 'satis',
    title: 'Satış Yönetimi',
    icon: 'fa-solid fa-chart-line',
    description: 'Tüm satış yönetimi sürecinizi uçtan uca profesyonelleştirin.',
    longDescription: 'Tekliften siparişe, teslimattan tahsilata kadar tüm satış döngünüzü tek platformda yönetin. Satış temsilcilerinin pipeline’larını görün, fırsatları takip edin ve satış ekip performansını ölçün.',
    highlights: [
      'Teklif, sipariş ve tahsilat süreci takibi',
      'Satış pipeline ve fırsat yönetimi',
      'Satış ekibi performans raporları',
    ],
    mediaUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
  },
  {
    id: 'uretim',
    title: 'Üretim Yönetimi',
    icon: 'fa-solid fa-industry',
    description: 'Tüm kaynakları doğru şekilde kullanarak verimlilik elde edin.',
    longDescription: 'Üretim emirleri, iş istasyonları, rota ve operasyon planlarını tek ekrandan yönetin. Maliyetleri anlık takip edin, fire ve duruş kayıtlarını raporlayarak verimlilik analizi yapın.',
    highlights: [
      'Üretim emri ve rota yönetimi',
      'Maliyet ve verimlilik analizi',
      'Fire ve duruş kayıt takibi',
    ],
    mediaUrl: 'https://www.uyumsoft.com/assets/module-images/liox-erp/uretim-planlama-min.webp',
  },
  {
    id: 'crm',
    title: 'Müşteri İlişkileri Yönetimi',
    icon: 'fa-solid fa-users',
    description: 'Pazarlamadan satışa tüm müşteri süreçlerini kolaylaştırın.',
    longDescription: 'Potansiyel müşteriden sadık müşteriye kadar tüm temas noktalarını tek ekranda görün. Kampanyalarınızı, aktivitelerinizi ve görüşme notlarınızı kayıt altına alarak satış fırsatlarını kaçırmayın.',
    highlights: [
      'Potansiyel ve mevcut müşteri yönetimi',
      'Aktivite ve görev takibi',
      'Kampanya ve segment yönetimi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
  },
  {
    id: 'ik',
    title: 'İnsan Kaynakları Yönetimi',
    icon: 'fa-solid fa-user-tie',
    description: 'Tüm IK süreçlerinizi tek ekranda etkin bir şekilde yönetin.',
    longDescription: 'Özlük, bordro, performans ve eğitim süreçlerini tek platformda toplayın. Çalışanların tüm yaşam döngüsünü takip ederek insan kaynağınızı verimli yönetin.',
    highlights: [
      'Özlük ve bordro süreçlerinin takibi',
      'Performans ve hedef yönetimi',
      'Eğitim ve yetkinlik planlama',
    ],
    mediaUrl: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg',
  },
  {
    id: 'butce',
    title: 'Bütçe Yönetimi',
    icon: 'fa-solid fa-wallet',
    description: 'Nakit akışını kontrol altında tutun, verimliliği artırın.',
    longDescription: 'Gelir ve gider bütçelerinizi senaryolar bazında planlayın, gerçekleşen verilerle karşılaştırarak sapmaları anlık takip edin. Nakit akışınızı öngörerek yatırım ve finansman kararlarını daha sağlıklı alın.',
    highlights: [
      'Yıllık ve dönemsel bütçe senaryoları',
      'Bütçe-gerçekleşen karşılaştırma raporları',
      'Nakit akışı ve finansal projeksiyonlar',
    ],
    mediaUrl: 'https://images.pexels.com/photos/5466785/pexels-photo-5466785.jpeg',
  },
  {
    id: 'disticaret',
    title: 'Dış Ticaret Yönetimi',
    icon: 'fa-solid fa-globe',
    description: 'İthalat, ihracat ve gümrük işlemlerini kolayca takip edin.',
    longDescription: 'İthalat ve ihracat işlemlerini, evraklarını ve maliyetlerini tek ekranda yönetin. Gümrük beyannameleri, navlun ve diğer masrafları kaydederek ürün bazında gerçek maliyetlerinizi görün.',
    highlights: [
      'İthalat ve ihracat süreci takibi',
      'Gümrük ve navlun maliyetlerinin izlenmesi',
      'Sipariş, sevkiyat ve ödeme planlarının yönetimi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg',
  },
  {
    id: 'kalite',
    title: 'Kalite Yönetimi',
    icon: 'fa-solid fa-check-circle',
    description: 'Tüm kaynakları doğru şekilde kullanarak verimlilik elde edin.',
    longDescription: 'Giriş, proses ve final kalite kontrollerini standartlarınıza göre tanımlayın. Numune planları, kontrol listeleri ve sonuçlarını sistemden takip ederek hataları kaynağında görün.',
    highlights: [
      'Giriş, proses ve final kalite kontrol planları',
      'Numune ve test sonuçlarının izlenmesi',
      'Kalite kayıtları ve doküman yönetimi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/8293680/pexels-photo-8293680.jpeg',
  },
  {
    id: 'bakim',
    title: 'Bakım Yönetimi',
    icon: 'fa-solid fa-tools',
    description: 'Tüm ekipman ve sistemlerin maksimum performans ile çalışmasını sağlayın.',
    longDescription: 'Planlı ve plansız bakımları kayıt altına alın, ekipman bazında bakım geçmişini görün. Arıza sürelerini kısaltarak duruş maliyetlerini azaltın, bakım ekibinizin iş yükünü dengeli yönetin.',
    highlights: [
      'Periyodik bakım planlama ve takibi',
      'Arıza ve müdahale kayıtları',
      'Ekipman bazında bakım maliyeti raporları',
    ],
    mediaUrl: 'https://images.pexels.com/photos/18816918/pexels-photo-18816918.jpeg',
  },
  {
    id: 'satis-sonrasi',
    title: 'Satış Sonrası Hizmetler',
    icon: 'fa-solid fa-headset',
    description: 'Karmaşık ve yoğun kayıt işlerini basitleştirin, işletmenize hız katın.',
    longDescription: 'Kurulum, garanti ve servis süreçlerini uçtan uca yönetin. Müşteri taleplerini, servis fişlerini ve yedek parça kullanımını kaydederek memnuniyeti artırın.',
    highlights: [
      'Servis talebi ve iş emri yönetimi',
      'Garanti ve sözleşme takibi',
      'Yedek parça kullanımı ve stok kontrolü',
    ],
    mediaUrl: 'https://images.pexels.com/photos/8867435/pexels-photo-8867435.jpeg',
  },
  {
    id: 'eticaret',
    title: 'e-Ticaret Yönetimi',
    icon: 'fa-solid fa-shopping-bag',
    description: 'Dijital satış ağınızı güçlendirin.',
    longDescription: 'Marketplace ve e-ticaret kanallarınızı LIOX ERP ile entegre yönetin. Ürün, fiyat ve stok bilgilerinin senkron çalışmasını sağlayarak siparişleri tek merkezden işleyin.',
    highlights: [
      'Pazaryeri ve e-ticaret entegrasyonları',
      'Ürün, fiyat ve stok senkronizasyonu',
      'Siparişlerin ERP içinden yönetilmesi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/5632384/pexels-photo-5632384.jpeg',
  },
  {
    id: 'bulut',
    title: 'Bulut ERP',
    icon: 'fa-solid fa-cloud',
    description: 'İşletmenizi her yerden, güvenle ve kolayca yönetin.',
    longDescription: 'Bulut mimarisi ile LIOX ERP’ye internet olan her yerden güvenle erişin. Altyapı yatırımı yapmadan, ölçeklenebilir ve güncel bir ERP platformu kullanın.',
    highlights: [
      'Mekan bağımsız ERP erişimi',
      'Altyapı ve bakım maliyetlerinin azalması',
      'Ölçeklenebilir ve güncel platform',
    ],
    mediaUrl: 'https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg',
  },
  {
    id: 'kvkk',
    title: 'KVKK Modülü',
    icon: 'fa-solid fa-user-shield',
    description: 'Kişisel bilgi güvenliğini etkin bir şekilde yönetin.',
    longDescription: 'Müşteri ve çalışan verilerini KVKK mevzuatına uygun şekilde yönetin. Aydınlatma metinleri, açık rıza ve başvuru süreçlerini kayıt altına alarak denetime hazır olun.',
    highlights: [
      'KVKK’ya uygun veri envanteri takibi',
      'Açık rıza ve aydınlatma metni yönetimi',
      'Veri sahibi başvuru ve süreç takibi',
    ],
    mediaUrl: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
  },
] as const

/**
 * Hero Features
 */
export const HERO_FEATURES = [
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Türkiye\'de Barındırılan',
    description: 'Verileriniz Türkiye\'deki güvenli sunucularda',
  },
  {
    icon: 'fa-solid fa-bolt',
    title: 'Hızlı Kurulum',
    description: 'Haftalar yerine günler içinde aktif',
  },
  {
    icon: 'fa-solid fa-users',
    title: 'Sınırsız Kullanıcı',
    description: 'Ekip büyümesine paralel ölçeklenen yapı',
  },
  {
    icon: 'fa-solid fa-mobile-screen',
    title: 'Mobil Uyumlu',
    description: 'Tüm cihazlarda sorunsuz deneyim',
  },
]

/**
 * Default Video Settings
 */
export const DEFAULT_POPUP_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/HYpLnoV7ZmA?autoplay=1&rel=0&modestbranding=1&color=white'
export const DEFAULT_VIDEO_THUMBNAIL = '/assets/liox-mockup.png'

/**
 * Popup Rules
 */
export const POPUP_RULES = [
  {
    id: 'first-visit',
    name: 'İlk Ziyaret',
    description: 'Kullanıcı siteye ilk defa girdiğinde göster',
    trigger: 'first_visit',
    delay: 5000,
  },
  {
    id: 'exit-intent',
    name: 'Çıkış Niyeti',
    description: 'Kullanıcı siteyi kapatmaya çalıştığında göster',
    trigger: 'exit_intent',
    delay: 0,
  },
  {
    id: 'scroll-depth',
    name: 'Kaydırma Derinliği',
    description: 'Kullanıcı sayfanın %50\'sini kaydırdığında göster',
    trigger: 'scroll_depth',
    threshold: 50,
    delay: 0,
  },
  {
    id: 'time-on-site',
    name: 'Sitede Kalma Süresi',
    description: 'Kullanıcı 30 saniye geirdikten sonra göster',
    trigger: 'time_on_site',
    threshold: 30,
    delay: 0,
  },
]

/**
 * Hero Content - Reference Values
 */
/**
 * Sectors for role-based display
 */
export const SECTOR_TABS = [
  {
    id: 'makine-metal',
    label: 'Makine ve Metal',
    heading: 'Makine ve Metal Üretiminde Uçtan Uca Görünürlük',
    description: 'LIOX ERP, makine ve metal sektöründe üretimden satışa kadar tüm süreçleri entegre eder. Fire kontrolü, kalıp takibi ve maliyet analizi ile üretim verimliliğinizi artırın.',
    items: ['Kalıp ömrü ve takibi', 'MES entegrasyonu', 'Sipariş bazlı maliyet', 'Fason takibi'],
  },
  {
    id: 'plastik-ambalaj',
    label: 'Plastik ve Ambalaj',
    heading: 'Plastik Üretiminde Reçete ve Fire Yönetimi',
    description: 'Plastik sektöründe reçete yönetimi, fire takibi ve yan ürün muhasebesi ile üretim maliyetlerinizi kontrol altında tutun.',
    items: ['Reçete yönetimi', 'Fire ve yan ürün', 'Makine bazlı verimlilik', 'Hammadde takibi'],
  },
  {
    id: 'gida',
    label: 'Gıda ve İçecek',
    heading: 'Gıda Sektöründe Parti ve Hijyen Yönetimi',
    description: 'Gıda sektöründe parti/lot takibi, raf ömrü yönetimi ve HACCP uyumu ile gıda güvenliğini sağlayın.',
    items: ['Parti/lot takibi', 'Raf ömrü yönetimi', 'HACCP uyumu', 'Tedarik zinciri'],
  },
  {
    id: 'insaat',
    label: 'İnşaat ve Gayrimenkul',
    heading: 'İnşaat Projelerinde Bütçe ve Nakit Yönetimi',
    description: 'İnşaat sektöründe proje bazlı bütçe, nakit akışı ve hakediş takibi ile projelerinizi kontrol altında tutun.',
    items: ['Proje bazlı bütçe', 'Nakit akışı', 'Hakediş takibi', 'Kaynak planlama'],
  },
  {
    id: 'otomotiv',
    label: 'Otomotiv ve Yan Sanayi',
    heading: 'Otomotiv Tedarik Zincirinde Entegrasyon',
    description: 'Otomotiv sektöründe tedarikçi yönetimi, kalite kontrol ve sevkiyat takibi ile tedarik zincirinizi optimize edin.',
    items: ['Tedarikçi yönetimi', 'Kalite kontrol', 'Sevkiyat takibi', 'Maliyet analizi'],
  },
]

/**
 * Role Profiles for role-based ERP experience
 */
export const ROLE_PROFILES = [
  {
    id: 'genel-mudur',
    label: 'Genel Müdür',
    title: 'Genel Müdür',
    description: 'Tüm operasyonları tek merkezden izleyin, finansal tabloları ve KPI\'ları anlık takip edin.',
    benefits: [
      'Finansal performans ve nakit akışı görünürlüğü',
      'Departmanlar arası entegrasyon',
      'Stratejik karar alma için gerçek zamanlı veri',
    ],
    modules: ['finans', 'satis', 'butce', 'bulut'],
    mediaUrl: 'https://images.pexels.com/photos/4963447/pexels-photo-4963447.jpeg',
  },
  {
    id: 'finans-muduru',
    label: 'Finans Müdürü',
    title: 'Finans Müdürü',
    description: 'Maliyetleri kontrol altına alın, bütçe sapmalarını anında görün ve nakit yönetimini optimize edin.',
    benefits: [
      'Bütçe ve nakit akışı takibi',
      'Maliyet muhasebesi ve analizi',
      'Dış ticaret ve gümrük yönetimi',
    ],
    modules: ['finans', 'butce', 'disticaret', 'kvkk'],
    mediaUrl: 'https://images.pexels.com/photos/4963447/pexels-photo-4963447.jpeg',
  },
  {
    id: 'uretim-muduru',
    label: 'Üretim Müdürü',
    title: 'Üretim Müdürü',
    description: 'Üretim verimliliğini artırın, fire oranlarını düşürün ve kapasite planlamasını optimize edin.',
    benefits: [
      'Üretim maliyeti ve fire analizi',
      'Kapasite planlama ve iş emri takibi',
      'Kalite kontrol ve iyileştirme',
    ],
    modules: ['uretim', 'kalite', 'bakim', 'depo'],
    mediaUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
  },
  {
    id: 'satis-muduru',
    label: 'Satış Müdürü',
    title: 'Satış Müdürü',
    description: 'Satış pipeline\'ınızı yönetin, ekip performansını ölçün ve müşteri memnuniyetini artırın.',
    benefits: [
      'Satış pipeline ve ekip performansı',
      'Müşteri ilişkileri ve CRM',
      'Sipariş ve sevkiyat takibi',
    ],
    modules: ['satis', 'crm', 'eticaret'],
    mediaUrl: 'https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg',
  },
  {
    id: 'it-muduru',
    label: 'BT/IT Müdürü',
    title: 'BT/IT Müdürü',
    description: 'Sistem güvenliğini sağlayın, entegrasyonları yönetin ve IT altyapısını optimize edin.',
    benefits: [
      'Bulut altyapı ve güvenlik',
      'Sistem entegrasyonları',
      'Veri güvenliği ve KVKK uyumu',
    ],
    modules: ['bulut', 'kvkk', 'disticaret'],
    mediaUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
  },
]

export const HERO_CONTENT = {
  badge: {
    text: 'UYUMSOFT GÜVENCESİYLE',
    variant: 'outline',
  },
  headline: {
    main: 'Endüstride Lider',
    gradient: 'ERP Programı',
    sub: '',
  },
  description: 'LIOX ERP ile finans, üretim, satış ve insan kaynakları verilerinizi tek sistemde birleştirerek geciken raporları, dağınık tabloları ve kontrol kaybını geride bırakın.',
  cta: {
    primary: {
      label: 'DEMO TALEP EDİN',
      href: '#form',
    },
    secondary: {
      label: 'VİDEOYU İZLE',
      href: '#video',
    },
  },
  stats: [
    { value: '29+', label: 'Yıllık Deneyim' },
    { value: '1000+', label: 'Aktif Kullanıcı' },
    { value: '%40', label: 'Maliyet Tasarrufu' },
    { value: '7/24', label: 'Destek' },
  ],
}
