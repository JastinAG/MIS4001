export interface RegistrationFormData {
  fullName: string
  kcseIndexNumber: string
  kcseMeanGrade: number
  county: string
}

export interface ValidationError {
  [key: string]: string
}

export function validateRegistration(data: RegistrationFormData): ValidationError {
  const errors: ValidationError = {}

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  if (!data.kcseIndexNumber || !data.kcseIndexNumber.match(/^\d{3}-\d{4}\/\d{4}$/)) {
    errors.kcseIndexNumber = 'Invalid KCSE index number format (e.g., 123-4567/2023)'
  }

  if (!data.kcseMeanGrade || data.kcseMeanGrade < 1 || data.kcseMeanGrade > 12) {
    errors.kcseMeanGrade = 'KCSE mean grade must be between 1 and 12'
  }

  if (!data.county) {
    errors.county = 'County is required'
  }

  return errors
}
