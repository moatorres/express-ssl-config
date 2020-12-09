# ⚡️ Express SSL Setup

Como configurar o ambiente de desenvolvimento local com TLS/SSL em NodeJs com Express.

## Início

Leia as instruções abaixo para fazer a implementação na sua máquina.

### 🔖 Observações

Você precisará instalar o pacote `openssl` para gerar uma chave RSA a partir do Terminal:

`brew openssl`

### 🗂 Instruções

**1. Gerar chave RSA-2048 "Certificate Authority" (rootCA.key)**

`openssl genrsa -des3 -out rootCA.key 2048`

**2. Utilize a chave criada para criar um novo Certificado SSL Raiz (rootCA.pem)**

`openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem`

**3. Importe o certificado criado no seu computador (Keychain Access, OSX)**

`File > Import`

Dê um duplo clique no certificado importado e selecione "Always Trust" na opção "When using this certificate"

**4. Crie um novo arquivo de configuração do OpenSSL chamado `server.csr.cnf` para importar as configurações do Certificado programaticamente**

```csr
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=BR
ST=Pernambuco
L=Recife
O=MokaTecnologia
OU=Matriz
emailAddress=support@hellomoka.com
CN = localhost
```

**5. Crie um arquivo `v3.ext` para criar um certificado `X509 v3`**

```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
```

**6. Gere uma nova chave de certificado (server.key)**

`openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )`

**7. Gere um novo certificado a partir da chave criada no passo anterior (server.crt)**

`openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext`

**8. Configure a API para rodar via módulo HTTPS nativo do NodeJs**

```js
const app = require('express')()
const https = require('https')
const fs = require('fs')

app.get('/', (req, res) => {
    res.send('Hello Moka')
});

https.createServer({
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: 'senha123'
}, app)
.listen(3000)
```

## Créditos

[freeCodeCamp.org](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/)
[hackernoon.com](https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb)
[sitepoint.com](https://www.sitepoint.com/how-to-use-ssltls-with-node-js/)

<sub>Feito com ❤️ por [Moa](https://github.com/moatorres)</sub>

