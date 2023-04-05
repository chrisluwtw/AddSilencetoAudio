const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const inputFileName = 'renderer.js';
const outputFileName = 'renderer-obfuscated.js';

fs.readFile(inputFileName, 'UTF-8', (err, data) => {
  if (err) {
    console.error(`Error reading file ${inputFileName}:`, err);
    return;
  }

  const obfuscationResult = JavaScriptObfuscator.obfuscate(data, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArrayThreshold: 0.75,
  });

  fs.writeFile(outputFileName, obfuscationResult.getObfuscatedCode(), (err) => {
    if (err) {
      console.error(`Error writing file ${outputFileName}:`, err);
      return;
    }

    console.log(`Successfully obfuscated ${inputFileName} to ${outputFileName}`);
  });
});
