const { exec } = require('child_process');
const path = require('path');

exec('astro build', (error, stdout, stderr) => {
  if (error) {
    console.error(`build error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
