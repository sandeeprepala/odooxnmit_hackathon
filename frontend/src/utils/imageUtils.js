// Utility function to get the correct image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get the API base URL from environment or default to localhost
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${apiBaseUrl}/${cleanPath}`;
}

// Utility function to get the first image URL from an array
export function getFirstImageUrl(images) {
  if (!images || images.length === 0) return null;
  return getImageUrl(images[0]);
}
