import validator from "validator";

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 255) return false;

  return validator.isEmail(email, {
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false,
  });
}
