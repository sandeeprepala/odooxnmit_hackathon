// Utility function to get the correct image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get base URL from environment or use default, and ensure we're using the base URL without /api
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const apiBaseUrl = baseUrl.replace('/api', '');
  
  // Log the URL construction process
  console.log('Constructing image URL:', {
    original: imagePath,
    baseUrl,
    apiBaseUrl
  });
  
  // Clean up the path to ensure proper formatting
  let cleanPath;
  if (imagePath.startsWith('/uploads/')) {
    // Path is already in correct format
    cleanPath = imagePath.slice(1); // Remove leading slash
  } else if (imagePath.startsWith('uploads/')) {
    // Path is correct but without leading slash
    cleanPath = imagePath;
  } else {
    // Add uploads prefix if missing
    cleanPath = `uploads/${imagePath.replace(/^\//, '')}`;
  }
  
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
