const LOCAL_PART_MAX_LENGTH = 64;
const EMAIL_MAX_LENGTH = 254;
const TLD_MIN_LENGTH = 2;
const TLD_MAX_LENGTH = 24;

const LOCAL_PART_CHARS = /^[A-Za-z0-9._+-]+$/;
const DOMAIN_LABEL_CHARS = /^[A-Za-z0-9-]+$/;
const TLD_CHARS = new RegExp(`^[A-Za-z]{${TLD_MIN_LENGTH},${TLD_MAX_LENGTH}}$`);
const HAS_NON_ASCII = /[^\x00-\x7F]/;
const HAS_WHITESPACE = /\s/;

function isValidLocalPart(local: string): boolean {
  if (local.length === 0 || local.length > LOCAL_PART_MAX_LENGTH) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false;
  return LOCAL_PART_CHARS.test(local);
}

function isValidDomainLabel(label: string): boolean {
  if (label.length === 0) return false;
  if (label.startsWith('-') || label.endsWith('-')) return false;
  return DOMAIN_LABEL_CHARS.test(label);
}

function isValidDomain(domain: string): boolean {
  if (domain.length === 0) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;

  const labels = domain.split('.');
  if (labels.length < 2) return false;

  const tld = labels[labels.length - 1];
  if (!TLD_CHARS.test(tld)) return false;

  return labels.every(isValidDomainLabel);
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  if (email.length > EMAIL_MAX_LENGTH) return false;
  if (HAS_WHITESPACE.test(email)) return false;
  if (HAS_NON_ASCII.test(email)) return false;

  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) return false;

  const [local, domain] = email.split('@');
  return isValidLocalPart(local) && isValidDomain(domain);
}

/** Strips characters that can never be valid in an email while typing (non-Latin/unicode, spaces, disallowed symbols). */
export function sanitizeEmailInput(value: string): string {
  return value.replace(/[^A-Za-z0-9._+@-]/g, '');
}
