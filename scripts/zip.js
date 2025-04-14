const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const fse = require('fs-extra');

async function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } }); // 设置压缩级别
  const stream = fs.createWriteStream(outPath);
  
  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);
    
    stream.on('close', () => resolve());
    archive.finalize();
  });
}

// 使用示例
const sourceDir = path.join(__dirname,'../', 'dist'); // 替换为你要压缩的文件夹路径
const outPath = path.join(__dirname, '../', 'shetepro-blog.zip'); // 替换为输出的zip文件路径

zipDirectory(sourceDir, outPath)
  .then(() => console.log('Directory successfully zipped!'))
  .catch(err => console.error('Error while zipping directory:', err));
