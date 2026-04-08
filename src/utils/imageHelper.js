/**
 * Helper function to handle image paths
 * Converts backend image filenames to full paths
 * Supports old URLs, base64 data, and new filenames
 * 
 * @param {string} image - Image filename, URL, or base64 data
 * @param {string} fallback - Fallback image path (default: "/images/no_image.jpg")
 * @returns {string} - Full image path or data URL
 * 
 * @example
 * getImagePath("img1.jpg") // Returns "/images/img1.jpg"
 * getImagePath("https://example.com/img.jpg") // Returns "https://example.com/img.jpg"
 * getImagePath("data:image/jpeg;base64,...") // Returns "data:image/jpeg;base64,..."
 * getImagePath("") // Returns "/images/no_image.jpg"
 */
export const getImagePath = (image, fallback = "/images/no_image.jpg") => {
    // Handle missing/null/empty image
    if (!image) {
        return fallback;
    }

    // If it's already a full URL (starts with http:// or https://), return as-is
    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    // If it's base64 data (from FileReader or database), return as-is
    if (image.startsWith("data:")) {
        return image;
    }

    // Otherwise it's a filename, prepend /images/
    return `/images/${image}`;
};

/**
 * Alternative shorter name for the same function
 */
export const imgPath = getImagePath;

export default getImagePath;
