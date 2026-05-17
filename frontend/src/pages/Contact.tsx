import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useEffect } from 'react'
import { submitLead, getPageContent, type HomePageContent } from '@/services/api'

const contactSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  tel: z.string().optional(),
  company: z.string().optional(),
  employee_count: z.string().optional(),
  message: z.string().optional(),
})

type ContactForm = z.infer<typeof contactSchema>

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageContent, setPageContent] = useState<HomePageContent | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    getPageContent('iletisim')
      .then((data) => setPageContent(data))
      .catch(() => setPageContent(null))
  }, [])

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await submitLead({
        name: data.name,
        email: data.email,
        tel: data.tel,
        company: data.company,
        employee_count: data.employee_count,
      })
      window.location.href = '/tesekkurler'
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero - Dark Navy with Shapes */}
      <section className="bg-[#0a1628] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] uppercase tracking-[0.2em] font-semibold mb-6">
            LIOX ERP İletişim
          </div>
          <h1 className="text-4xl lg:text-6xl font-black font-logo uppercase mb-4">{pageContent?.generic_hero_baslik || 'İletişim'}</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            {pageContent?.generic_hero_aciklama || 'Sorularınız için bize ulaşın, size en uygun çözümü birlikte bulalım.'}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black font-logo text-gray-900 mb-6">Bize Ulaşın</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="label">Ad Soyad *</label>
                  <input
                    {...register('name')}
                    className="input"
                    placeholder="Adınız Soyadınız"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">E-posta *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input"
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Telefon</label>
                  <input
                    {...register('tel')}
                    type="tel"
                    className="input"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="label">Firma Adı</label>
                  <input
                    {...register('company')}
                    className="input"
                    placeholder="Firma adınız"
                  />
                </div>

                <div>
                  <label className="label">Çalışan Sayısı</label>
                  <select {...register('employee_count')} className="input">
                    <option value="">Seçiniz</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                <div>
                  <label className="label">Mesajınız</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="input"
                    placeholder="Nasıl yardımcı olabiliriz?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#0a1628] text-white font-bold hover:bg-[#dd222c] transition shadow-lg"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black font-logo text-gray-900 mb-3">İletişim Bilgileri</h2>
                <p className="text-gray-600">Satış, demo ve iş birliği talepleriniz için ekibimizle doğrudan iletişime geçebilirsiniz.</p>
              </div>
              
              <div className="space-y-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0a1628]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <a href="tel:+902163151414" className="text-[#0a1628] hover:text-[#dd222c] transition">+90 216 315 14 14</a>
                    <p className="text-gray-500 text-sm">Hafta içi 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0a1628]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">E-posta</h3>
                    <a href="mailto:info@liox.uyumsoft.com" className="text-[#0a1628] hover:text-[#dd222c] transition">info@liox.uyumsoft.com</a>
                    <p className="text-gray-500 text-sm">24 saat içinde yanıt</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#0a1628]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#0a1628]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adres</h3>
                    <p className="text-gray-600">İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-[2rem] h-64 flex items-center justify-center text-center p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full" />
                  <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#dd222c]/20 rounded-full" />
                </div>
                <div className="relative z-10">
                  <div className="text-xl font-black font-logo mb-2">LIOX ERP Uzman Ekibi</div>
                  <div className="text-white/85 text-sm max-w-sm">Projeniz için en uygun modül, sektör ve dönüşüm planını birlikte şekillendirelim.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
