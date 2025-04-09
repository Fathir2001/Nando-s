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

// Create a map of image names to their imported module
const imageMap = {
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