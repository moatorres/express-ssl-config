const app = require('express')()
const https = require('https')
const fs = require('fs')

app.get('/', (req, res) => {
  res.send('Hello Moka')
})

https
  .createServer(
    {
      key: fs.readFileSync('./private.key'),
      cert: fs.readFileSync('./certificate.crt'),
      passphrase: 'test123',
    },
    app
  )
  .listen(3000, () => console.log('HTTPS Server Running 🎉'))
