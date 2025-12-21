const { analyzeImageColors, getColorStats } = require('./analyzer');
const { rgbToHex, getColorName, hexToRgb } = require('./color-utils');

module.exports = {
  // Core functions
  analyzeImageColors,
  getColorStats,
  
  // Color utilities
  rgbToHex,
  getColorName,
  hexToRgb,
  
  // Main analyzer function with options
  analyze: async (imagePath, options = {}) => {
    const defaultOptions = {
      maxDimension: 200,
      topColorsCount: 10,
      colorQuantization: 10,
      includeNames: true,
      includeStats: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const result = await analyzeImageColors(imagePath, mergedOptions);
      return result;
    } catch (error) {
      throw new Error(`Color analysis failed: ${error.message}`);
    }
  },
  
  // Quick analyze for dominant color only
  getDominantColor: async (imagePath, options = {}) => {
    const result = await analyzeImageColors(imagePath, {
      ...options,
      topColorsCount: 1
    });
    return result.dominantColor;
  },
  
  // Get color palette
  getColorPalette: async (imagePath, count = 5) => {
    const result = await analyzeImageColors(imagePath, {
      topColorsCount: count
    });
    return result.topColors;
  }
};