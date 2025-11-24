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

export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8 || password.length > 128) {
    return false;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
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
