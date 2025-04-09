// Import all images once to ensure they get bundled
import dish1 from "../assets/img/dish1.jpg";
import dish2 from "../assets/img/dish2.jpg";
import dish3 from "../assets/img/dish3.jpg";
import dish4 from "../assets/img/dish4.jpg";
import dish5 from "../assets/img/dish5.jpg";
import dish6 from "../assets/img/dish6.jpg";
import dish7 from "../assets/img/dish7.jpg";
import dish8 from "../assets/img/dish8.jpg";
import dish9 from "../assets/img/dish9.jpg";
import dish10 from "../assets/img/dish10.jpg";
import dish11 from "../assets/img/dish11.jpg";
import dish12 from "../assets/img/dish12.jpeg";

// Import dessert images
import dessert1 from "../assets/img/dessert1.jpg";
import dessert2 from "../assets/img/dessert2.jpg";
import dessert3 from "../assets/img/dessert3.jpg";

// Import juice images
import juice1 from "../assets/img/juice1.jpg";
import juice2 from "../assets/img/juice2.jpg";
import juice3 from "../assets/img/juice3.jpg";
import juice4 from "../assets/img/juice4.jpg";
import juice5 from "../assets/img/juice5.jpg";
import juice6 from "../assets/img/juice6.jpg";
import juice7 from "../assets/img/juice7.jpg";
import juice8 from "../assets/img/juice8.jpg";

// Import shake images
import shake1 from "../assets/img/shake1.webp";
import shake2 from "../assets/img/shake2.jpg";
import shake3 from "../assets/img/shake3.jpg";
import shake4 from "../assets/img/shake4.jpg";
import shake5 from "../assets/img/shake5.jpg";
import shake6 from "../assets/img/shake6.jpg";
import shake7 from "../assets/img/shake7.jpg";
import shake8 from "../assets/img/shake8.webp";

// Import placeholder image for error cases
import placeholderImg from "../assets/img/placeholder.jpg";

// Create a map of image base names to their imported modules
const imageMap = {
  // Dishes
  'dish1': dish1,
  'dish2': dish2,
  'dish3': dish3,
  'dish4': dish4,
  'dish5': dish5,
  'dish6': dish6,
  'dish7': dish7,
  'dish8': dish8,
  'dish9': dish9,
  'dish10': dish10,
  'dish11': dish11,
  'dish12': dish12,
  
  // Desserts
  'dessert1': dessert1,
  'dessert2': dessert2,
  'dessert3': dessert3,
  
  // Juices
  'juice1': juice1,
  'juice2': juice2,
  'juice3': juice3,
  'juice4': juice4,
  'juice5': juice5,
  'juice6': juice6,
  'juice7': juice7,
  'juice8': juice8,
  
  // Shakes
  'shake1': shake1,
  'shake2': shake2,
  'shake3': shake3,
  'shake4': shake4,
  'shake5': shake5,
  'shake6': shake6,
  'shake7': shake7,
  'shake8': shake8,
};

/**
 * Resolves an image path to its correct URL in both development and production
 * @param {string} imagePath - The image path or filename
 * @returns {string} The resolved image URL
 */
export const getImageUrl = (imagePath) => {
  // If already a full URL (starts with http or data:)
  if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('data:'))) {
    return imagePath;
  }
  
  // If it's already a processed module (webpack import result), return it directly
  if (typeof imagePath !== 'string') {
    return imagePath;
  }
  
  try {
    // Clean the path to extract the base name
    let baseName;
    
    // Handle different formats of paths
    if (imagePath.includes('/')) {
      // It's a path like "/src/assets/img/dish1.jpg"
      const filename = imagePath.split('/').pop();
      baseName = filename.split('.')[0]; // Remove extension
    } else if (imagePath.includes('.')) {
      // It's just a filename with extension like "dish1.jpg"
      baseName = imagePath.split('.')[0];
    } else {
      // It's already a base name like "dish1"
      baseName = imagePath;
    }
    
    // Handle webpack hash in filenames (dish1-abc123.jpg)
    if (baseName.includes('-')) {
      baseName = baseName.split('-')[0];
    }
    
    // Look up in our image map using the base name
    if (imageMap[baseName]) {
      return imageMap[baseName];
    }
    
    console.warn(`Image not found in imageMap: ${imagePath} (baseName: ${baseName})`);
    return placeholderImg;
  } catch (error) {
    console.error("Error processing image path:", error, imagePath);
    return placeholderImg;
  }
};

/**
 * Prepares an image reference for storage in the database
 * @param {string|object} imgPath - The image path or imported module
 * @returns {string} A clean reference suitable for database storage
 */
export const getStorableImageName = (imgPath) => {
  // If it's not a string (likely a webpack module), extract info from props title
  if (typeof imgPath !== 'string') {
    return "placeholder";
  }
  
  try {
    let baseName;
    
    // Handle different path formats
    if (imgPath.includes('/')) {
      // It's a path like "/src/assets/img/dish1.jpg"
      const filename = imgPath.split('/').pop();
      baseName = filename.split('.')[0]; // Remove extension
    } else if (imgPath.includes('.')) {
      // It's just a filename with extension like "dish1.jpg"
      baseName = imgPath.split('.')[0];
    } else {
      // It's already a base name like "dish1"
      baseName = imgPath;
    }
    
    // Handle webpack hash in filenames (dish1-abc123.jpg)
    if (baseName.includes('-')) {
      baseName = baseName.split('-')[0];
    }
    
    return baseName;
  } catch (error) {
    console.error("Error processing image path for storage:", error, imgPath);
    return "placeholder";
  }
};