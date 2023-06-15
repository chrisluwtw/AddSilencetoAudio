// renderer.js
const fs = require("fs");
// const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const path = require('path');




//Get the paths to the packaged versions of the binaries we want to use
const ffmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
);


//tell the ffmpeg package where it can find the needed binaries.
//ffmpeg.setFfmpegPath(ffmpegPath);


const {ipcRenderer} = require('electron');


function logToConsole(message) {
      // Convert message to a UTF-8 encoded string
      const utf8Message = Buffer.from(message).toString('utf8');

      // Send message to the main process
     ipcRenderer.send('console-log', utf8Message);



    // Display message in the HTML element
    const consoleOutput = document.getElementById('console-output');
    const logLine = document.createElement('p');
    logLine.textContent = message;
    consoleOutput.appendChild(logLine);
}

// Use logToConsole instead of console.log
logToConsole('填好需要处理的音频文件信息!');


const addSilence = (input, output, silenceDuration) => {

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(input)
      .outputOptions([
        `-af`,
        `adelay=delays=${silenceDuration * 1000}|${
          silenceDuration * 1000
        }:all=1`,
      ])
      .on("start", () => {
        console.log("开始处理音频文件...");
        logToConsole("开始处理音频文件...");

  
      })
      .on("progress", (progress) => {
        if (progress && progress.percent) {
          console.log(`处理进度: ${progress.percent.toFixed(2)}%`);
          logToConsole(`处理进度: ${progress.percent.toFixed(2)}%`);

        }
      })
      .on("end", () => {
        console.log("处理完成");
        logToConsole("处理完成...");

        
        resolve();
      })
      .on("error", (err) => {
        console.error("处理错误: ", err);
        logToConsole("处理错误 "+err);
        reject(err);
      })
      .save(output);
  });
};

const extractAudio =(inputPath, outputPath) => {

  //alert(inputPath)
  //alert(outputPath)


  // var command = ffmpeg(inputPath);
  // command.outputOptions([
  //   '-vn',
  //   '-acodec copy',
  // ]).save(outputPath);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
       .outputOptions(['-map 0:a:0','-b:a 256k'])
    //   .outputOptions([
    //     '-vn',
    //     '-acodec', 'copy'
    // ])
      .output(outputPath)
      .on("progress", (progress) => {
        if (progress && progress.percent) {
          console.log(`处理进度: ${progress.percent.toFixed(2)}%`);
          logToConsole(`处理进度: ${progress.percent.toFixed(2)}%`);

        }
      })
      .on('end', function() {
        console.log('Audio extraction completed');
        logToConsole("提取音轨完成 ");
        resolve();
      })
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        logToConsole("提取音轨处理错误 "+err);
        reject(err);
      })
      .run();
  });
}

document.getElementById('processButton').addEventListener("click", () => {
  const inputPath = document.getElementById("inputPath").value;
  const outputPath = document.getElementById("outputPath").value;
  const silenceDuration = document.getElementById("silenceDuration").value;
  console.log("Input Path:", inputPath);
  console.log("Output Path:", outputPath);
  console.log("Silence Duration:", silenceDuration);

  addSilence(inputPath, outputPath, silenceDuration)
    .then(() => {
      alert("添加静音成功");
    })
    .catch((err) => {
      alert("添加静音失败: " + err.message);
    });
});


document.getElementById('extractButton').addEventListener('click', () => {

  const inputPath = document.getElementById("inputPath").value;
  const outputPath = document.getElementById("outputPath").value;
  console.log("Input Path:", inputPath);
  console.log("Output Path:", outputPath);
  alert(1)

  extractAudio(inputPath,outputPath)
  .then(() => {
    alert("提取成功");
  })
  .catch((err) => {
    alert("提取失败: " + err.message);
  })
});
