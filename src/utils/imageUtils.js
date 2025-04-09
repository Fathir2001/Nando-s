// Import all menu images
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

// Create a map of image names to their imported module
const imageMap = {
  // Dishes
  'dish1.jpg': dish1,
  'dish2.jpg': dish2,
  'dish3.jpg': dish3,
  'dish4.jpg': dish4,
  'dish5.jpg': dish5,
  'dish6.jpg': dish6,
  'dish7.jpg': dish7,
  'dish8.jpg': dish8,
  'dish9.jpg': dish9,
  'dish10.jpg': dish10,
  'dish11.jpg': dish11,
  'dish12.jpeg': dish12,
  
  // Desserts
  'dessert1.jpg': dessert1,
  'dessert2.jpg': dessert2,
  'dessert3.jpg': dessert3,
  
  // Juices
  'juice1.jpg': juice1,
  'juice2.jpg': juice2,
  'juice3.jpg': juice3,
  'juice4.jpg': juice4,
  'juice5.jpg': juice5,
  'juice6.jpg': juice6,
  'juice7.jpg': juice7,
  'juice8.jpg': juice8,
  
  // Shakes
  'shake1.webp': shake1,
  'shake2.jpg': shake2,
  'shake3.jpg': shake3,
  'shake4.jpg': shake4,
  'shake5.jpg': shake5,
  'shake6.jpg': shake6,
  'shake7.jpg': shake7,
  'shake8.webp': shake8,
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

  // Extract the filename from the path
  let filename;
  if (typeof imagePath === 'string') {
    // Handle paths like "/src/assets/img/dish1.jpg" or "dish1.jpg"
    filename = imagePath.split('/').pop();
  } else {
    console.error("Invalid image path:", imagePath);
    return "https://i.ibb.co/vH8XTCm/placeholder-food.png"; // Fallback image
  }

  // Look up in our image map
  if (imageMap[filename]) {
    return imageMap[filename];
  }

  console.warn(`Image not found in imageMap: ${filename}`);
  return "https://i.ibb.co/vH8XTCm/placeholder-food.png"; // Fallback image
};