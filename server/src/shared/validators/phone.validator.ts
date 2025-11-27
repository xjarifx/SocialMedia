export function isValidPhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  // example: +1234567890, (123) 456-7890, 123-456-7890, 123 456 7890
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{4}$/;
  return phoneRegex.test(phone);
}
