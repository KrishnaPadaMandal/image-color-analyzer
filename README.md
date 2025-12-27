

# Image Color Analyst 🎨

A fast and lightweight Node.js package to analyze images and extract **dominant colors, color palettes, and color statistics**.
Built on top of **Sharp** for high-performance image processing.

Perfect for:

* 🎨 Design systems & theming
* 🖼️ Image analysis tools
* 📊 Color analytics
* 🌐 APIs & backend services

---

## ✨ Features

* 🎯 Extract dominant color from images
* 🏆 Get top **N** colors with percentages
* 📊 Detailed color statistics
* 🎨 Generate color palettes
* 💅 Ready-to-use CSS color values
* 🖥️ Command Line Interface (CLI)
* 🌐 Easy integration with Express.js
* 🚀 High-performance processing using Sharp

---

## 📦 Installation

### Install as a project dependency

```bash
npm install image-color-analyst
```

### Install globally for CLI usage

```bash
npm install -g image-color-analyst
```

---

## 🚀 Usage

---

### 1️⃣ Basic Usage (Node.js)

```js
const { analyze } = require("image-color-analyst");

(async () => {
  const result = await analyze("./sample.jpg", {
    topColorsCount: 5,
  });

  console.log(result);
})();
```

---

### 2️⃣ Express.js API Example (Image Upload)

```js
const express = require("express");
const multer = require("multer");
const { analyze } = require("image-color-analyst");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const result = await analyze(req.file.path, {
      topColorsCount: 5,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
```

---

### 3️⃣ API Response Example

```json
{
  "dominantColor": {
    "hex": "#3A4F7A",
    "name": "Steel Blue",
    "percentage": 42.5
  },
  "topColors": [
    { "hex": "#3A4F7A", "percentage": 42.5 },
    { "hex": "#9AAED6", "percentage": 23.1 },
    { "hex": "#E6ECF5", "percentage": 18.4 }
  ],
  "colorStats": {
    "totalColors": 128,
    "uniqueColors": 12
  }
}
```

---

## 🧪 Configuration Options

```js
await analyze(imagePath, {
  maxDimension: 200,       // Resize for faster processing
  topColorsCount: 5,       // Number of top colors
  colorQuantization: 10,   // Color clustering level
  includeNames: true,      // Include color names
  includeStats: true       // Include color statistics
});
```

---

## 🖥️ CLI Usage

Analyze images directly from the terminal.

```bash
# Analyze image and get top colors
npx color-analyzer analyze image.jpg --top 5

# Get dominant color only
npx color-analyzer dominant image.jpg

# Generate color palette
npx color-analyzer palette image.jpg --colors 6
```

---

## 🖼️ Supported Image Formats

* `.jpg`
* `.jpeg`
* `.png`
* `.webp`

---

## ⚡ Performance

* Powered by **Sharp**
* Optimized for server environments
* Handles large images efficiently

---

## 🧠 Use Cases

* UI / UX theming
* Branding tools
* Image analytics
* Design automation
* CMS & media platforms

---

## 🛠 Requirements

* Node.js **>= 14**
* Works on Windows, macOS, and Linux

---

## 📄 License

MIT © **Krishna Pada Mandal**

---





