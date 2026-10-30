import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  getProjectById,
  validateContactForm,
  type Project,
} from './portfolio-logic';

const healthcareProjects: Project[] = [
  {
    id: 'hospital-management-system',
    title: 'Hospital Management System',
    category: 'development',
    categoryLabel: 'Hospital System',
    summary: 'Comprehensive clinical operations, ward allocation, and physician workflow dashboard.',
    description: 'An enterprise healthcare management platform streamlining inpatient admissions, staff shift scheduling, real-time bed capacity analytics, and clinical record transfers.',
    image: '/assets/images/hospital-management-system.jpg',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Database', 'Healthcare'],
    client: 'General Hospital Network',
    year: '2026',
  },
  {
    id: 'patient-registration-system',
    title: 'Patient Registration System',
    category: 'web-design',
    categoryLabel: 'Patient Registration',
    summary: 'Streamlined digital patient intake, appointment triage, and biometric records verification.',
    description: 'A responsive, accessible web portal for rapid patient registration, insurance pre-authorization, emergency intake triage, and digitized medical history documentation.',
    image: '/assets/images/patient-registration-system.jpg',
    tags: ['Frontend', 'Accessible Forms', 'Responsive', 'Validation'],
    client: 'Metropolitan Health Care',
    year: '2026',
  },
  {
    id: 'pharmacy-management-system',
    title: 'Pharmacy Management System',
    category: 'development',
    categoryLabel: 'Pharmacy Management',
    summary: 'Prescription fulfillment, pharmaceutical inventory control, and drug interaction tracking.',
    description: 'A centralized pharmacy operations system tracking prescription verification, expiry dates, batch tracking, automated supplier re-orders, and point-of-sale dispensing.',
    image: '/assets/images/pharmacy-management-system.jpg',
    tags: ['JavaScript', 'Inventory Logic', 'POS', 'Reporting'],
    client: 'Apex Care Pharmacy',
    year: '2026',
  },
];

test('filterProjects returns all 3 healthcare systems when category is "all"', () => {
  const result = filterProjects(healthcareProjects, 'all');
  assert.equal(result.length, 3);
  assert.equal(result[0].title, 'Hospital Management System');
  assert.equal(result[1].title, 'Patient Registration System');
  assert.equal(result[2].title, 'Pharmacy Management System');
});

test('filterProjects filters by specific category', () => {
  const devProjects = filterProjects(healthcareProjects, 'development');
  assert.equal(devProjects.length, 2);

  const webProjects = filterProjects(healthcareProjects, 'web-design');
  assert.equal(webProjects.length, 1);
  assert.equal(webProjects[0].id, 'patient-registration-system');
});

test('getProjectById retrieves correct project', () => {
  const project = getProjectById(healthcareProjects, 'hospital-management-system');
  assert.ok(project);
  assert.equal(project?.title, 'Hospital Management System');

  const missing = getProjectById(healthcareProjects, 'unknown');
  assert.equal(missing, undefined);
});

test('validateContactForm rejects empty submissions', () => {
  const res = validateContactForm({ fullName: '', email: '', message: '' });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.fullName);
  assert.ok(res.errors.email);
  assert.ok(res.errors.message);
});

test('validateContactForm accepts valid submissions', () => {
  const res = validateContactForm({
    fullName: 'Dr. Sarah Connor',
    email: 'sarah@clinic.org',
    message: 'Inquiring about deploying the Hospital Management System.',
  });
  assert.equal(res.isValid, true);
});
