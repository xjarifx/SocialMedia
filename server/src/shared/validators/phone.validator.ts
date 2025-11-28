import { parsePhoneNumberFromString } from "libphonenumber-js";

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || phone.length < 10 || phone.length > 20) {
    return false;
  }

  try {
    // Parse and validate phone number
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber) {
      return false;
    }

    // Validate that it's a valid mobile or fixed line number
    return phoneNumber.isValid();
  } catch (error) {
    return false;
  }
}

export function normalizePhoneNumber(phone: string): string | null {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return null;
    }

    // Return in E.164 format: +1234567890
    return phoneNumber.format("E.164");
  } catch (error) {
    return null;
  }
}
