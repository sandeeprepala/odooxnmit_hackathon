// Utility function to get the correct image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If the path already starts with http, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Use the base URL without /api since the uploads folder is at the root
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace('/api', '');
  
  // Handle the path to ensure it works with the /uploads directory
  let cleanPath;
  if (imagePath.includes('/uploads/')) {
    // If it already has /uploads/, just remove the leading slash
    cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  } else {
    // If it doesn't have /uploads/, add it
    cleanPath = imagePath.startsWith('/') ? `uploads${imagePath}` : `uploads/${imagePath}`;
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
