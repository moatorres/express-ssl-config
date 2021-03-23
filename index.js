const app = require('express')()
const https = require('https')
const fs = require('fs')

app.get('/', (req, res) => {
  res.send('Hello World')
})

const httpsConfig = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  passphrase: 'test123',
}

https
  .createServer(httpsConfig, app)
  .listen(3000, () => console.log('Self-signed HTTPS Connection Running 🎉'))
