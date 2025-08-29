// Firebase Authentication Error Messages Utility
// This file provides human-readable error messages for Firebase authentication errors

export const FIREBASE_ERROR_MESSAGES = {
  // Authentication errors
  "auth/user-not-found":
    "No account found with this email address. Please check your email or sign up.",
  "auth/wrong-password":
    "Incorrect password. Please try again or reset your password.",
  "auth/invalid-email": 
    "Please enter a valid email address.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/too-many-requests": 
    "Too many failed attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your connection and try again.",
  "auth/invalid-credential":
    "Invalid email or password. Please check your credentials and try again.",
  "auth/user-mismatch":
    "The email address doesn't match the current user. Please try again.",
  
  // Sign up specific errors
  "auth/email-already-in-use":
    "This email is already registered. Please use a different email or try signing in.",
  "auth/weak-password":
    "Password is too weak. Please choose a stronger password with at least 6 characters.",
  "auth/operation-not-allowed":
    "Email/password accounts are not enabled. Please contact support.",
  
  // Email verification errors
  "auth/invalid-action-code":
    "The verification code is invalid. This may happen if the code is malformed or has expired.",
  "auth/expired-action-code":
    "The verification code has expired. Please request a new one.",
  
  // General errors
  "auth/missing-email":
    "Please enter your email address.",
  "auth/missing-password":
    "Please enter your password.",
  "auth/internal-error":
    "An internal error occurred. Please try again later.",
  
  // OAuth/Social login errors
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email but different sign-in credentials. Please try signing in with a different method.",
  "auth/credential-already-in-use":
    "This credential is already associated with a different user account.",
  "auth/popup-blocked":
    "The popup was blocked by the browser. Please enable popups and try again.",
  "auth/popup-closed-by-user":
    "The popup was closed before completing the sign-in. Please try again.",
  "auth/unauthorized-domain":
    "This domain is not authorized for OAuth operations. Please contact support.",
  
  // Password reset errors
  "auth/user-not-found":
    "No account found with this email address. Please check your email or sign up.",
  "auth/invalid-email":
    "Please enter a valid email address.",
  
  // Default fallback
  default: "An unexpected error occurred. Please try again.",
};

/**
 * Converts Firebase authentication errors into user-friendly messages
 * @param {Object} error - The Firebase error object
 * @returns {string} - Human-readable error message
 */
export const getFirebaseErrorMessage = (error) => {
  if (!error) return FIREBASE_ERROR_MESSAGES.default;

  // Handle different Firebase error message formats
  if (error.message) {
    // Handle "Firebase: Error (auth/error-code)" format
    if (error.message.includes("Firebase: Error (auth/")) {
      const match = error.message.match(/auth\/([^)]+)/);
      if (match) {
        const errorCode = `auth/${match[1]}`;
        return FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES.default;
      }
    }
    
    // Handle direct error code in message
    if (error.message.startsWith("auth/")) {
      return FIREBASE_ERROR_MESSAGES[error.message] || FIREBASE_ERROR_MESSAGES.default;
    }
    
    // Handle specific error keywords in message with case-insensitive matching
    const messageKeywords = [
      'invalid-credential',
      'invalid-credentials',
      'invalid credential',
      'invalid credentials',
      'user-not-found', 
      'wrong-password',
      'email-already-in-use',
      'weak-password',
      'too-many-requests',
      'network',
      'invalid-email'
    ];
    
    const lowerMessage = error.message.toLowerCase();
    for (const keyword of messageKeywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        // Normalize keyword to auth code format
        const normalizedKeyword = keyword.replace(/\s+/g, '-');
        const errorCode = `auth/${normalizedKeyword}`;
        
        // Special handling for invalid credential variations
        if (keyword.includes('invalid-credential') || keyword.includes('invalid credential')) {
          return FIREBASE_ERROR_MESSAGES['auth/invalid-credential'];
        }
        
        return FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES.default;
      }
    }
  }
  
  // Fallback to error code if available
  if (error.code) {
    return FIREBASE_ERROR_MESSAGES[error.code] || FIREBASE_ERROR_MESSAGES.default;
  }
  
  // Final fallback
  return FIREBASE_ERROR_MESSAGES.default;
};

/**
 * Specific error message handlers for different authentication operations
 */
export const getSignInErrorMessage = (error) => {
  const message = getFirebaseErrorMessage(error);
  
  // Customize messages specific to sign in
  if (error?.code === 'auth/user-not-found') {
    return "No account found with this email address. Please check your email or sign up.";
  }
  
  return message;
};

export const getSignUpErrorMessage = (error) => {
  const message = getFirebaseErrorMessage(error);
  
  // Customize messages specific to sign up
  if (error?.code === 'auth/email-already-in-use') {
    return "This email is already registered. Please use a different email or try signing in.";
  }
  
  return message;
};

export const getPasswordResetErrorMessage = (error) => {
  const message = getFirebaseErrorMessage(error);
  
  // Customize messages specific to password reset
  if (error?.code === 'auth/user-not-found') {
    return "No account found with this email address. Please check your email or sign up.";
  }
  
  return message;
};
