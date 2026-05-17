import { useState } from 'react'
import { submitStatamicForm } from '@/services/statamicForms'

interface EventRegistrationFormProps {
  eventSlug: string
  eventTitle: string
}

const ATTENDEE_OPTIONS = [
  '1 Kişi',
  '2-5 Kişi',
  '6-10 Kişi',
  '10+ Kişi',
]

export default function EventRegistrationForm({ eventSlug, eventTitle }: EventRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    company: '',
    title: '',
    attendee_count: '',
    notes: '',
    kvkkInfo: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}

    if (!formData.name.trim()) nextErrors.name = 'Ad Soyad zorunludur'
    if (!formData.email.trim()) {
      nextErrors.email = 'E-posta zorunludur'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }
    if (!formData.company.trim()) nextErrors.company = 'Şirket zorunludur'
    if (!formData.kvkkInfo) nextErrors.kvkkInfo = 'KVKK onayı zorunludur'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setStatus({ type: null, message: '' })

    try {
      await submitStatamicForm('event_registration', {
        event_slug: eventSlug,
        event_title: eventTitle,
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
        company: formData.company,
        title: formData.title,
        attendee_count: formData.attendee_count,
        notes: formData.notes,
        path: window.location.pathname,
      })

      setStatus({
        type: 'success',
        message: 'Kaydınız alındı. Etkinlik detaylarını sizinle paylaşacağız.',
      })

      setFormData({
        name: '',
        email: '',
        tel: '',
        company: '',
        title: '',
        attendee_count: '',
        notes: '',
        kvkkInfo: true,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Kayıt sırasında bir hata oluştu'
      setStatus({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#dd222c] mb-2">Etkinlik Kayıt Formu</div>
        <h3 className="text-3xl font-black font-logo text-[#0a1628] leading-[1.15] tracking-[0.01em]">Yerini Ayır</h3>
        <p className="text-gray-600 mt-3 leading-relaxed">Etkinliğe katılım için formu doldurun. Başvurunuz CRM’e değil, etkinlik kayıt havuzuna kaydedilir.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Ad Soyad" className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />
            {errors.name ? <p className="text-xs text-red-600 mt-1">{errors.name}</p> : null}
          </div>
          <div>
            <input name="email" value={formData.email} onChange={handleChange} placeholder="E-posta" className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />
            {errors.email ? <p className="text-xs text-red-600 mt-1">{errors.email}</p> : null}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input name="company" value={formData.company} onChange={handleChange} placeholder="Şirket Adı" className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Ünvan" className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input name="tel" value={formData.tel} onChange={handleChange} placeholder="Telefon" className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />
          <select name="attendee_count" value={formData.attendee_count} onChange={handleChange} className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628] bg-white text-gray-700">
            <option value="">Katılımcı Sayısı</option>
            {ATTENDEE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Sorularınız veya notlarınız" rows={4} className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#0a1628]" />

        <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <input type="checkbox" name="kvkkInfo" checked={formData.kvkkInfo} onChange={handleChange} className="mt-1 w-4 h-4 accent-[#dd222c]" />
          <span>Kişisel verilerimin etkinlik katılım süreci kapsamında işlenmesini kabul ediyorum.</span>
        </label>
        {errors.kvkkInfo ? <p className="text-xs text-red-600 -mt-2">{errors.kvkkInfo}</p> : null}

        {status.type ? (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.message}
          </div>
        ) : null}

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#0a1628] text-white text-sm font-black hover:bg-[#dd222c] transition disabled:opacity-50">
          {isSubmitting ? 'Gönderiliyor...' : 'Kayıt Talebini Gönder'}
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </form>
    </div>
  )
}
