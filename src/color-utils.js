/**
 * Convert RGB to HEX
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} HEX color code
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Convert HEX to RGB
 * @param {string} hex - HEX color code
 * @returns {Object} RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get color name from RGB values
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Color name
 */
function getColorName(r, g, b) {
  const hue = getHue(r, g, b);
  const saturation = getSaturation(r, g, b);
  const lightness = getLightness(r, g, b);
  
  if (lightness < 20) return "Black";
  if (lightness > 85) return "White";
  if (saturation < 15) return "Gray";
  
  if (hue >= 0 && hue < 15) return "Red";
  if (hue >= 15 && hue < 45) return "Orange";
  if (hue >= 45 && hue < 75) return "Yellow";
  if (hue >= 75 && hue < 165) return "Green";
  if (hue >= 165 && hue < 195) return "Cyan";
  if (hue >= 195 && hue < 255) return "Blue";
  if (hue >= 255 && hue < 285) return "Purple";
  if (hue >= 285 && hue < 330) return "Pink";
  return "Red";
}

/**
 * Calculate hue from RGB
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {number} Hue value (0-360)
 */
function getHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  
  if (max === min) {
    hue = 0;
  } else {
    const delta = max - min;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  
  return hue;
}

/**
 * Calculate saturation from RGB
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {number} Saturation percentage
 */
function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2 / 255;
  const delta = (max - min) / 255;
  
  if (lightness === 0 || lightness === 1) return 0;
  return parseFloat((delta / (1 - Math.abs(2 * lightness - 1)) * 100).toFixed(2));
}

/**
 * Calculate lightness from RGB
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {number} Lightness percentage
 */
function getLightness(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return parseFloat((((max + min) / 2 / 255) * 100).toFixed(2));
}

module.exports = {
  rgbToHex,
  hexToRgb,
  getColorName,
  getHue,
  getSaturation,
  getLightness
};