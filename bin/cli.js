#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Use ES module imports
import { program } from 'commander';
import chalk from 'chalk';
import fs from 'fs';

// For local modules, still use require
const { analyze, getDominantColor, getColorPalette } = require('../src/index');

// Display banner
// console.log(
//   chalk.cyan(
//     '='.repeat(60) + '\n' +
//     '🎨  IMAGE COLOR ANALYZER  🎨\n' +
//     '='.repeat(60)
//   )
// );

program
  .name('color-analyzer')
  .description('CLI tool to analyze dominant colors in images')
  .version('1.0.0');

program
  .command('analyze <image-path>')
  .description('Analyze an image and get color information')
  .option('-t, --top <number>', 'Number of top colors to show', '5')
  .option('-o, --output <format>', 'Output format (json, table, simple)', 'table')
  .option('-s, --save <filename>', 'Save results to JSON file')
  .action(async (imagePath, options) => {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        // console.error(chalk.red(`Error: File not found - ${imagePath}`));
        process.exit(1);
      }

      // console.log(chalk.blue(`📷 Analyzing ${imagePath}...\n`));
      
      const result = await analyze(imagePath, {
        topColorsCount: parseInt(options.top)
      });

      if (options.output === 'json') {
        // console.log(JSON.stringify(result, null, 2));
      } else if (options.output === 'simple') {
        // console.log(chalk.bold('🎨 Dominant Color:'));
        // console.log(`  ${result.dominantColor.hex} - ${result.dominantColor.name}`);
        // console.log(`  Percentage: ${result.dominantColor.percentage}%\n`);
        
        // console.log(chalk.bold('🏆 Top Colors:'));
        result.topColors.forEach((color, index) => {
          // console.log(`  ${index + 1}. ${color.hex} - ${color.name} (${color.percentage}%)`);
        });
      } else {
        // Table format (default)
        console.log(chalk.bold('📊 Image Information:'));
        // console.log(`  Dimensions: ${result.imageInfo.width} × ${result.imageInfo.height}`);
        // console.log(`  Format: ${result.imageInfo.format}`);
        // console.log(`  Processing Time: ${result.processingTime}ms\n`);
        
        // console.log(chalk.bold('🎨 Dominant Color:'));
        // console.log(chalk.bgHex(result.dominantColor.hex)('     '), 
        //            ` ${result.dominantColor.hex} - ${result.dominantColor.name}`);
        // console.log(`  RGB: ${result.dominantColor.rgb}`);
        // console.log(`  Percentage: ${result.dominantColor.percentage}%\n`);
        
        // console.log(chalk.bold('🏆 Top Colors:'));
        // console.log(chalk.cyan('  Rank  Color        Name        Percentage'));
        // console.log(chalk.cyan('  ────────────────────────────────────────'));
        
        result.topColors.forEach((color, index) => {
          const rank = (index + 1).toString().padEnd(5);
          const colorBlock = chalk.bgHex(color.hex)('   ');
          const hex = color.hex.padEnd(10);
          const name = color.name.padEnd(12);
          const percentage = color.percentage.toFixed(2).padEnd(8);
          
          // console.log(`  ${rank} ${colorBlock} ${hex} ${name} ${percentage}%`);
        });
        
        // console.log(`\n📈 Total unique colors: ${result.colorStats.totalColors}`);
      }

      // Save to file if requested
      if (options.save) {
        fs.writeFileSync(options.save, JSON.stringify(result, null, 2));
        // console.log(chalk.green(`\n✅ Results saved to ${options.save}`));
      }

    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('dominant <image-path>')
  .description('Get only the dominant color of an image')
  .action(async (imagePath) => {
    try {
      const dominant = await getDominantColor(imagePath);
      // console.log(chalk.bgHex(dominant.hex)('     '), 
      //            chalk.bold(` ${dominant.hex} - ${dominant.name}`));
      // console.log(`RGB: ${dominant.rgb}`);
      // console.log(`Percentage: ${dominant.percentage}%`);
    } catch (error) {
      // console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('palette <image-path>')
  .description('Extract color palette from image')
  .option('-c, --colors <number>', 'Number of colors in palette', '5')
  .action(async (imagePath, options) => {
    try {
      const palette = await getColorPalette(imagePath, parseInt(options.colors));
      
      // console.log(chalk.bold(`🎨 Color Palette (${options.colors} colors):\n`));
      
      palette.forEach((color, index) => {
        const swatch = chalk.bgHex(color.hex)('     ');
        // console.log(`${swatch} ${color.hex.padEnd(10)} ${color.name.padEnd(12)} ${color.percentage.toFixed(2)}%`);
      });
      
      // Generate CSS
      // console.log(chalk.bold('\n💅 CSS Variables:'));
      palette.forEach((color, index) => {
        // console.log(`--color-${index + 1}: ${color.hex};`);
      });
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program.parse();