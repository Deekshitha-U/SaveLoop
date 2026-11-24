
export function authErrorMessage(error, action = "login") {
  const code = error?.code || "";
  const message = String(error?.message || "");

  if (
    code === "auth/email-already-in-use" ||
    message.includes("auth/email-already-in-use")
  ) {
    return action === "signup"
      ? "An account with this email already exists. Please log in instead."
      : "This email is already registered. Please log in with your password.";
  }

  if (code === "auth/user-not-found") {
    return "We could not find an account with this email. Please sign up first.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/invalid-login-credentials" ||
    code === "auth/wrong-password" ||
    message.includes("auth/invalid-credential") ||
    message.includes("auth/invalid-login-credentials") ||
    message.includes("auth/wrong-password")
  ) {
    return "Email or password is incorrect. If you are new to SaveLoop, please sign up.";
  }

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  if (code === "auth/weak-password") {
    return "Choose a stronger password with at least 6 characters.";
  }

  if (code === "auth/user-disabled") {
    return "This account is disabled. Please contact support.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again later or reset your password.";
  }

  if (code === "auth/network-request-failed") {
    return "Firebase could not be reached. Check your internet connection and try again.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Email/password sign-in is not enabled in Firebase Console.";
  }

  if (code === "auth/invalid-api-key") {
    return "Firebase configuration is invalid. Check the API key in client/.env.";
  }

  if (
    message === "Network Error" ||
    /network error|failed to fetch|econnrefused/i.test(message)
  ) {
    return "SaveLoop could not reach its backend. Make sure the server is running on port 5000.";
  }

  if (
    message &&
    !message.startsWith("Firebase:") &&
    !message.includes("auth/")
  ) {
    return message;
  }

  return action === "signup"
    ? "We could not create your account. Please try again."
    : "Unable to log in. Please try again.";
}
