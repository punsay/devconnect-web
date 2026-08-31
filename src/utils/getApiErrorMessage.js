export const getApiErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  const data = err?.response?.data;

  if (!data) return fallback;

  if (typeof data === "object" && data.message) {
    return data.message;
  }

  if (typeof data === "string") {
    if (
      data.includes("PayloadTooLargeError") ||
      data.includes("request entity too large")
    ) {
      return "Profile data is too large. Please shorten your About section.";
    }

    if (data.startsWith("<!DOCTYPE") || data.startsWith("<html")) {
      return fallback;
    }

    return data;
  }

  return fallback;
};
