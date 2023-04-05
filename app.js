const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const inputPath = '1.mp3';
const outputPath = 'opening-10sec-silence-2.mp3';

const addSilence = (input, output, silenceDuration) => {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(input)
        .outputOptions([
          `-af`,
          `adelay=delays=${silenceDuration * 1000}|${silenceDuration * 1000}:all=1`
        ])
        .on('start', () => {
          console.log('开始处理音频文件...');
        })
        .on('progress', (progress) => {
            if (progress && progress.percent) {
              console.log(`处理进度: ${progress.percent.toFixed(2)}%`);
            }
          })
        .on('end', () => {
          console.log('处理完成');
          resolve();
        })
        .on('error', (err) => {
          console.error('处理错误: ', err);
          reject(err);
        })
        .save(output);
    });
  };
  
  addSilence(inputPath, outputPath, 10)
    .then(() => {
      console.log('添加静音成功');
    })
    .catch((err) => {
      console.error('添加静音失败: ', err);
    });