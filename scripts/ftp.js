let SftpClient = require('ssh2-sftp-client');
const { Client } = require('ssh2');
const path = require('path');
let sftp = new SftpClient();
const localFilePath = path.join(__dirname, '../', 'shetepro-blog.zip'); // 替换为你的本地文件路径
const remoteFilePath = '/srv/shetepro-blog.zip';        // 替换为远程服务器的路径
const config = {
  host: '',
  username: 'root',
  password: ""
}
sftp.connect(config).then(() => {
  console.log('Connected to the server', localFilePath);
  return sftp.put(localFilePath, remoteFilePath);
})
  .then(async () => {
    console.log('File uploaded successfully');
    await unzipFile()
    return
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    sftp.end();
  });

async function unzipFile () {
  return new Promise((resolve, reject) => {
    try {
      const conn = new Client();
      conn.on('ready', () => {
        console.log('Client :: ready');
        // 在这里执行远程命令
        conn.exec('rm -rf shetepro-blog', (err, stream) => {
          console.log(err)
          if (err) throw err;
          stream.on('close', (code, signal) => {
            console.log('remove old directory successfully !')
            conn.exec('unzip /srv/shetepro-blog.zip -d /srv/shetepro-blog', (err, stream) => {
              if (err) throw err;
              stream.on('close', () => {
                console.log('unzip successfully!')
                conn.end();
                resolve()
              }).on('data', (data) => {
                console.log('STDOUT: ' + data);
              }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
              })
            })
          }).on('data', (data) => {
            console.log('STDOUT: ' + data);
          }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
          })
        });
      }).connect(config);
    }catch (e) {
      reject(e)
    }
  })
  
}
