import { useState } from 'react'
import { CTA_VARIANTS, EMPLOYEE_COUNTS } from '@/lib/constants'
import { getCtaVariantsFromSettings } from '@/lib/siteSettings'
import { submitLead, trackEvent } from '@/services/api'

interface LeadFormProps {
  variantId?: number
  showTitle?: boolean
  className?: string
  compact?: boolean
  redirectOnSuccess?: boolean
  onSuccess?: () => void
}

export default function LeadForm({ variantId = 1, showTitle = true, className = '', compact = false, redirectOnSuccess = true, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    mail: '',
    tel: '',
    employeeCount: '',
    kvkkInfo: true,
    kvkkMarketing: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  const settingsVariants = getCtaVariantsFromSettings()
  const mergedVariants = settingsVariants ? { ...CTA_VARIANTS, ...settingsVariants } : CTA_VARIANTS
  const variant = (mergedVariants as Record<string, any>)[String(variantId)] || (mergedVariants as Record<string, any>)['1'] || CTA_VARIANTS[1]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhoneBlur = () => {
    let phone = formData.tel.replace(/\D/g, '')
    if (phone.startsWith('0')) {
      phone = phone.substring(1)
    }
    if (phone.length === 10) {
      phone = `0${phone}`
    }
    setFormData((prev) => ({ ...prev, tel: phone }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad zorunludur'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Şirket Adı zorunludur'
    }
    if (!formData.mail.trim()) {
      newErrors.mail = 'E-posta zorunludur'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      newErrors.mail = 'Geçerli bir e-posta adresi giriniz'
    }
    if (!formData.tel.trim()) {
      newErrors.tel = 'Telefon zorunludur'
    } else {
      const phone = formData.tel.replace(/\D/g, '')
      if (phone.length < 10) {
        newErrors.tel = 'Geçerli bir telefon numarası giriniz'
      }
    }
    
    if (!formData.kvkkInfo) {
      newErrors.kvkkInfo = 'KVKK onayı zorunludur'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setStatus({ type: null, message: '' })
    
    try {
      const response = await submitLead({
        name: formData.name,
        email: formData.mail,
        tel: formData.tel,
        company: formData.company,
        employee_count: formData.employeeCount,
        variant_id: String(variantId),
      })
      
      if (response.data.ok !== false && response.data.success !== false) {
        await trackEvent('liox_lead_submit', {
          form_location: window.location.pathname,
          variant_id: String(variantId),
          name: formData.name,
          email: formData.mail,
          phone: formData.tel,
          company: formData.company,
          employee_count: formData.employeeCount,
        })

        setFormData({
          name: '',
          company: '',
          mail: '',
          tel: '',
          employeeCount: '',
          kvkkInfo: true,
          kvkkMarketing: true,
        })

        if (onSuccess) {
          onSuccess()
        }

        if (redirectOnSuccess) {
          window.location.href = '/tesekkurler'
        } else {
          setStatus({
            type: 'success',
            message: 'Talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.',
          })
        }
      } else {
        throw new Error(response.data?.message || 'Bir hata oluştu')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Form gönderilirken bir hata oluştu'
      setStatus({
        type: 'error',
        message: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-white/95 backdrop-blur-xl ${compact ? 'p-4 md:p-5 rounded-[1.75rem]' : 'p-10 md:p-11 lg:p-12 rounded-[2.5rem]'} shadow-2xl border border-white/60 border-t-8 border-t-[#dd222c] ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-black uppercase`} style={{ color: '#0a1628' }}>
              {variant.formTitle}
            </h3>
            <p className={`${compact ? 'text-[11px]' : 'text-[12px] md:text-[13px]'} mt-1.5 font-semibold uppercase tracking-[0.18em]`} style={{ color: '#dd222c' }}>
              {variant.formSubtitle}
            </p>
          </div>
        </div>
      )}

      <form className={compact ? 'space-y-3' : 'space-y-4'} onSubmit={handleSubmit}>
        {/* Name & Company */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ad Soyad"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-4 bg-white text-gray-900 caret-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-uyumRed focus:border-uyumRed outline-none text-[15px] placeholder-gray-400 transition-colors hover:border-gray-300 ${
                errors.name ? 'border-red-300 focus:ring-red-400' : ''
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              placeholder="Şirket Adı"
              required
              value={formData.company}
              onChange={handleChange}
              className={`w-full p-4 bg-white text-gray-900 caret-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-uyumRed focus:border-uyumRed outline-none text-[15px] placeholder-gray-400 transition-colors hover:border-gray-300 ${
                errors.company ? 'border-red-300 focus:ring-red-400' : ''
              }`}
            />
            {errors.company && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.company}</p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
          <div className="space-y-2">
            <input
              type="email"
              name="mail"
              placeholder="E-posta (ad.soyad@firma.com)"
              required
              value={formData.mail}
              onChange={handleChange}
              className={`w-full ${compact ? 'p-3.5 text-[14px]' : 'p-4 text-[15px]'} bg-white text-gray-900 caret-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-uyumRed focus:border-uyumRed outline-none placeholder-gray-400 transition-colors hover:border-gray-300 ${
                errors.mail ? 'border-red-300 focus:ring-red-400' : ''
              }`}
            />
            {errors.mail && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.mail}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none">
                <img
                  src="https://flagcdn.com/w40/tr.png"
                  alt="TR"
                  className="w-5 h-auto rounded-sm shadow-sm"
                  loading="lazy"
                />
                <span className="text-gray-500 font-bold text-sm border-r border-gray-200 pr-2 mr-1">+90</span>
              </div>
              <input
                type="tel"
                name="tel"
                placeholder="5xx xxx xx xx"
                required
                value={formData.tel}
                onChange={handleChange}
                onBlur={handlePhoneBlur}
                inputMode="numeric"
                maxLength={13}
                className={`w-full ${compact ? 'p-3.5 pl-24 text-[14px]' : 'p-4 pl-24 text-[15px]'} bg-white text-gray-900 caret-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-uyumRed focus:border-uyumRed outline-none placeholder-gray-400 tracking-wide transition-colors hover:border-gray-300 ${
                  errors.tel ? 'border-red-300 focus:ring-red-400' : ''
                }`}
              />
            </div>
            {errors.tel && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.tel}</p>
            )}
          </div>
        </div>

        {/* Employee Count */}
        <div className="space-y-2">
          <select
            name="employeeCount"
            value={formData.employeeCount}
            onChange={handleChange}
            className={`w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-uyumRed focus:border-uyumRed outline-none text-[13px] text-gray-400 caret-gray-900 transition-colors hover:border-gray-300 ${
              formData.employeeCount ? 'text-gray-900' : ''
            }`}
          >
            <option value="">Toplam Çalışan Sayısı (tahmini)</option>
            {EMPLOYEE_COUNTS.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* KVKK */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 space-y-2">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="kvkkInfo"
              name="kvkkInfo"
              required
              checked={formData.kvkkInfo}
              onChange={handleChange}
              className="mt-1 accent-uyumRed"
            />
            <label htmlFor="kvkkInfo">
              <a
                href="https://www.uyumsoft.com/kisisel-verilerin-korunmasi"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-uyumRed hover:text-uyumRed underline decoration-dotted"
              >
                Kişisel Veriler Bilgilendirme Metni
              </a>
              &apos;ni kabul ediyorum.
            </label>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="kvkkMarketing"
              name="kvkkMarketing"
              required
              checked={formData.kvkkMarketing}
              onChange={handleChange}
              className="mt-1 accent-uyumRed"
            />
            <label htmlFor="kvkkMarketing">
              Uyumsoft tarafından reklam, pazarlama, promosyon, tanıtım, bilgilendirme ve ticari amaçlı
              SMS, e-posta ve telefon yoluyla elektronik ileti gönderilmesine onay verdiğimi beyan ediyorum.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-black uppercase text-[11px] md:text-sm transition-colors duration-200 shadow-xl tracking-[0.3em] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          style={{ backgroundColor: '#0a1628', color: 'white' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dd222c'; e.currentTarget.style.transform = 'scale(1.01)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a1628'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isSubmitting ? 'TALEBİNİZ İLETİLİYOR...' : variant.submitLabel}
        </button>

        {/* Status Message */}
        {status.message && (
          <p className={`text-center text-[11px] font-bold uppercase mt-4 p-3 rounded-lg ${
            status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : status.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-gray-50 border border-gray-200 text-gray-700'
          }`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
}
