/**
 * Pure business logic for ABDEX portfolio: filtering, retrieval, and form validation.
 * Decoupled from DOM for reliable automated unit testing.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  summary: string;
  description: string;
  image: string;
  tags: string[];
  client: string;
  year: string;
  demoUrl?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    fullName?: string;
    email?: string;
    message?: string;
  };
}

/**
 * Filters projects by category identifier.
 * 'all' returns the complete list.
 */
export function filterProjects(projects: Project[], category: string): Project[] {
  if (!category || category === 'all') {
    return [...projects];
  }
  const normalizedCategory = category.toLowerCase().trim();
  return projects.filter(
    (p) => p.category.toLowerCase() === normalizedCategory
  );
}

/**
 * Retrieves a single project by ID.
 */
export function getProjectById(projects: Project[], id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/**
 * Validates the contact form inputs according to requirements:
 * - Full Name: required, at least 2 characters
 * - Email: required, standard RFC-compliant pattern
 * - Message: required, at least 10 characters
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  const trimmedName = (data.fullName || '').trim();
  if (!trimmedName) {
    errors.fullName = 'Full Name is required.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  const trimmedEmail = (data.email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  const trimmedMessage = (data.message || '').trim();
  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
