/**
 * Utility functions for formatting and validation
 * Handles phone numbers, emails, and common data transformations
 */

/**
 * Parse and format phone number with country code
 * Removes '--' prefixes and normalizes to standard format
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "غير محدد";

  // Remove '--' prefixes and whitespace
  let cleaned = phone.replace(/^--+/, "").trim();

  // Remove spaces
  cleaned = cleaned.replace(/\s/g, "");

  // If empty after cleaning, return fallback
  if (!cleaned) return "غير محدد";

  // Iraqi number format: +964 XX XXX XXXX
  if (cleaned.startsWith("+964")) {
    return cleaned.replace(/(\+964)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  }

  // If starts with 0, replace with +964
  if (cleaned.startsWith("0")) {
    cleaned = "964" + cleaned.substring(1);
  }

  // Format with country code
  if (cleaned.startsWith("964") && cleaned.length === 12) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "+$1 $2 $3 $4");
  }

  return phone;
}

/**
 * Truncate email with ellipsis
 * Break long emails gracefully
 */
export function truncateEmail(email: string | null | undefined, maxLength: number = 20): string {
  if (!email) return "غير محدد";

  if (email.length <= maxLength) return email;

  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email.substring(0, maxLength) + "...";

  const namePart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex);

  const availableForName = maxLength - domainPart.length - 3; // 3 for "..."

  if (availableForName <= 0) {
    return email.substring(0, maxLength) + "...";
  }

  return namePart.substring(0, availableForName) + "..." + domainPart;
}

/**
 * Validate and normalize location data
 * Check if location is properly set
 */
export function isLocationComplete(city: string | null, governorate: string | null): boolean {
  const isEmpty = (val: string | null) => !val || val.trim() === "" || val === "غير محدد";
  return !isEmpty(city) && !isEmpty(governorate);
}

/**
 * Get location badge with fallback
 */
export function getLocationBadge(
  city: string | null,
  governorate: string | null
): { label: string; isIncomplete: boolean } {
  const isEmpty = (val: string | null) => !val || val.trim() === "" || val === "غير محدد";

  if (isEmpty(city) && isEmpty(governorate)) {
    return { label: "الموقع غير محدد", isIncomplete: true };
  }

  if (isEmpty(city)) {
    return { label: `${governorate} (بدون مدينة)`, isIncomplete: true };
  }

  if (isEmpty(governorate)) {
    return { label: `${city} (بدون محافظة)`, isIncomplete: true };
  }

  return { label: `${city}, ${governorate}`, isIncomplete: false };
}

/**
 * Format request status with Arabic labels
 */
export function formatRequestStatus(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  const statuses: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    pending: {
      label: "قيد الانتظار",
      color: "bg-yellow-100 text-yellow-800",
      icon: "⏳",
    },
    approved: {
      label: "موافق عليه",
      color: "bg-green-100 text-green-800",
      icon: "✅",
    },
    rejected: {
      label: "مرفوض",
      color: "bg-red-100 text-red-800",
      icon: "❌",
    },
    completed: {
      label: "مكتمل",
      color: "bg-blue-100 text-blue-800",
      icon: "🎉",
    },
  };

  return statuses[status] || { label: "غير معروف", color: "bg-gray-100 text-gray-800", icon: "❓" };
}

/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} متر`;
  }
  return `${distanceKm.toFixed(1)} كم`;
}
