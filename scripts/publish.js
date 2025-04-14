const { exec } = require('child_process');
const path = require("path");

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptPath}:`, error);
        reject(error);
      } else {
        console.log(`Output of ${scriptPath}:`);
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function runScriptsInSequence() {
  try {
    await runScript(path.join(__dirname, 'build.js')); // 替换为第一个脚本的路径
    await runScript(path.join(__dirname, 'zip.js')); // 替换为第一个脚本的路径
    await runScript(path.join(__dirname, 'ftp.js')); // 替换为第一个脚本的路径
  } catch (err) {
    console.error('Error running scripts:', err);
  }
}

runScriptsInSequence();
