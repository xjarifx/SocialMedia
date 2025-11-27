export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8 || password.length > 128) {
    return false;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
}
