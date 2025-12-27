# Image Color Analyzer 🎨

A Node.js package to analyze images and extract dominant colors, color palettes, and color statistics.

## Features

- 🎯 Extract dominant color from images
- 🏆 Get top N colors with percentages
- 📊 Color statistics and analysis
- 🎨 Generate color palettes
- 💅 CSS variable generation
- 🖥️ CLI interface
- 🌐 Express.js API server
- 🚀 Fast processing with Sharp

## Installation

```bash
# Install globally for CLI usage
npm install -g image-color-analyzer

# Install as dependency for your project
npm install image-color-analyzer

# Example
const multer = require("multer");
const { analyze } = require("image-color-analyst");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const result = await analyze(req.file.path, {
      topColorsCount: 5,
    });

    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});