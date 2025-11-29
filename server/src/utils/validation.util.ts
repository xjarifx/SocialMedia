import validator from "validator";

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 255) return false;

  // Use battle-tested email validator
  return validator.isEmail(email, {
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false,
  });
}


export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  // example: +1234567890, (123) 456-7890, 123-456-7890, 123 456 7890
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{4}$/;
  return phoneRegex.test(phone);
}
