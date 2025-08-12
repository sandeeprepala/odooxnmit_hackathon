// Utility function to get the correct image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For development, always use localhost:5000
  // In production, this would use the environment variable
  const apiBaseUrl = 'http://localhost:5000';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  const fullUrl = `${apiBaseUrl}/${cleanPath}`;
  
  // Debug logging
  console.log('Image URL construction:', {
    imagePath,
    apiBaseUrl,
    cleanPath,
    fullUrl
  });
  
  return fullUrl;
}

// Utility function to get the first image URL from an array
export function getFirstImageUrl(images) {
  if (!images || images.length === 0) {
    console.log('getFirstImageUrl: No images provided');
    return null;
  }
  
  console.log('getFirstImageUrl called with:', images);
  const firstImage = images[0];
  console.log('First image path:', firstImage);
  
  return getImageUrl(firstImage);
}
