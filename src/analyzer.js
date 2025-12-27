const sharp = require('sharp');
const { rgbToHex, getColorName } = require('./color-utils');

/**
 * Analyze an image to find dominant colors
 * @param {string} imagePath - Path to the image file
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeImageColors(imagePath, options = {}) {
  const {
    maxDimension = 200,
    topColorsCount = 10,
    colorQuantization = 10,
    includeNames = true,
    includeStats = true
  } = options;
  
  const startTime = Date.now();
  
  try {
    // Read image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Resize image for processing
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }
    
    // Get pixel data
    const { data, info } = await sharp(imagePath)
      .resize(width, height)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const pixelData = new Uint8Array(data);
    const colorMap = new Map();
    const totalPixels = info.width * info.height;
    
    // Process each pixel
    for (let i = 0; i < pixelData.length; i += info.channels) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      
      // Quantize colors
      const quantizedR = Math.floor(r / colorQuantization) * colorQuantization;
      const quantizedG = Math.floor(g / colorQuantization) * colorQuantization;
      const quantizedB = Math.floor(b / colorQuantization) * colorQuantization;
      
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
      
      if (colorMap.has(colorKey)) {
        colorMap.set(colorKey, colorMap.get(colorKey) + 1);
      } else {
        colorMap.set(colorKey, 1);
      }
    }
    
    // Convert to array and sort
    const colorArray = Array.from(colorMap, ([colorKey, count]) => {
      const [r, g, b] = colorKey.split(',').map(Number);
      const hex = rgbToHex(r, g, b);
      const percentage = (count / totalPixels) * 100;
      
      const colorObj = {
        rgb: `rgb(${r}, ${g}, ${b})`,
        hex,
        r, g, b,
        count,
        percentage: parseFloat(percentage.toFixed(2))
      };
      
      // Add color name if requested
      // if (includeNames) {
      //   colorObj.name = getColorName(r, g, b);
      // }
      
      return colorObj;
    });
    
    // Sort by frequency
    colorArray.sort((a, b) => b.count - a.count);
    
    // Get top colors
    const topColors = colorArray.slice(0, topColorsCount);
    const dominantColor = topColors[0] || null;
    
    // Prepare results
    const result = {
      success: true,
      dominantColor,
      topColors,
      imageInfo: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        size: metadata.size || 0
      },
      processingTime: Date.now() - startTime
    };
    
    // Add stats if requested
    if (includeStats) {
      result.colorStats = {
        totalColors: colorArray.length,
        totalPixels: totalPixels,
        processedPixels: totalPixels
      };
    }
    
    return result;
    
  } catch (error) {
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

/**
 * Get color statistics from analysis results
 * @param {Array} colors - Array of color objects
 * @returns {Object} Color statistics
 */
function getColorStats(colors) {
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return null;
  }
  
  const stats = {
    totalColors: colors.length,
    colorDistribution: {},
    averageSaturation: 0,
    averageLightness: 0
  };
  
  let totalSaturation = 0;
  let totalLightness = 0;
  
  colors.forEach(color => {
    // Calculate HSL values
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const lightness = ((max + min) / 2 / 255) * 100;
    const delta = (max - min) / 255;
    const saturation = lightness === 0 || lightness === 1 ? 0 : 
                      delta / (1 - Math.abs(2 * lightness - 1)) * 100;
    
    totalSaturation += saturation;
    totalLightness += lightness;
    
    // Track color distribution by name
    const name = color.name || getColorName(color.r, color.g, color.b);
    stats.colorDistribution[name] = (stats.colorDistribution[name] || 0) + color.percentage;
  });
  
  stats.averageSaturation = parseFloat((totalSaturation / colors.length).toFixed(2));
  stats.averageLightness = parseFloat((totalLightness / colors.length).toFixed(2));
  
  return stats;
}

module.exports = {
  analyzeImageColors,
  getColorStats
};