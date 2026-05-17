import axios from 'axios'
import { getRecaptchaPayload } from '@/lib/recaptcha'

const STATAMIC_API_URL = import.meta.env.VITE_STATAMIC_API_URL || '/api'

/**
 * Submit form to Statamic Forms
 */
export async function submitStatamicForm(formHandle: string, data: Record<string, unknown>) {
  try {
    const recaptcha = await getRecaptchaPayload(`${formHandle}_submit`)

    const response = await axios.post(`${STATAMIC_API_URL}/forms/${formHandle}`, {
      form: formHandle,
      data: {
        ...data,
        ...recaptcha,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Form submission failed')
    }
    throw error
  }
}

/**
 * Submit lead form
 */
export async function submitLead(data: {
  name: string
  email: string
  tel?: string
  phone?: string
  company?: string
  sector?: string
  message?: string
}) {
  return submitStatamicForm('lead', data)
}

/**
 * Submit assessment form
 */
export async function submitAssessment(data: {
  name: string
  email: string
  phone?: string
  tel?: string
  company?: string
  sector?: string
  employee_count?: string
  current_system?: string
  goals?: string
  budget_range?: string
}) {
  return submitStatamicForm('assessment', data)
}

/**
 * Submit appointment form
 */
export async function submitAppointment(data: {
  name: string
  email: string
  phone?: string
  tel?: string
  company?: string
  preferred_date?: string
  preferred_time?: string
  notes?: string
}) {
  return submitStatamicForm('appointment', data)
}

/**
 * Get form submissions (admin only)
 */
export async function getFormSubmissions(formHandle: string, page = 1, perPage = 20) {
  const response = await axios.get(`${STATAMIC_API_URL}/forms/${formHandle}/submissions`, {
    params: { page, per_page: perPage },
  })
  return response.data
}

/**
 * Get single submission (admin only)
 */
export async function getSubmission(formHandle: string, submissionId: string) {
  const response = await axios.get(`${STATAMIC_API_URL}/forms/${formHandle}/submissions/${submissionId}`)
  return response.data
}

/**
 * Delete submission (admin only)
 */
export async function deleteSubmission(formHandle: string, submissionId: string) {
  const response = await axios.delete(`${STATAMIC_API_URL}/forms/${formHandle}/submissions/${submissionId}`)
  return response.data
}
