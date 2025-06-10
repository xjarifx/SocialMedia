export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateLoginInput = (
  email: string,
  username: string,
  password: string
) => {
  const errors: string[] = [];

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!username || !validateUsername(username)) {
    errors.push(
      "Username must be 3-20 characters, alphanumeric and underscores only"
    );
  }

  if (!password || !validatePassword(password)) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
