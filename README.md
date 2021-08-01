# ⚡️ Express SSL Setup

Como configurar o ambiente de desenvolvimento local com TLS/SSL em NodeJs com Express.

## Início

Você precisará instalar os pacotes `Node.js`, `npm` ou `yarn` e `openssl` na sua máquina.

### 🔖 Observações

É preciso instalar o pacote `openssl` para gerar uma chave RSA a partir do Terminal:

`brew openssl` → usuários `macOS`
<!-- `cask openssl` → usuários `win64x` -->

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
C=US                                    # Country name (2 letter code)
ST=NY                                   # State or Province name
L=NewYork                               # Locality name
O=CompanyName                           # Organization name
OU=Headquarters                         # Organizational unit name
CN = localhost                          # Common name (qualified host name)
emailAddress=devops@example.com         # Email address
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

**6. Gere uma chave para o certificado**

`openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )`

**7. Gere o certificado `(server.crt)` usando a chave criada no passo anterior `(server.key)`**

`openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext`

**8. Configure a API para rodar via módulo HTTPS nativo do NodeJs**

```js
const app = require('express')()
const https = require('https')
const fs = require('fs')

app.get('/', (req, res) => {
    res.send('Hello World')
});

https.createServer({
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    passphrase: 'super-secure-password' // --> process.env.CRT_PASSPHRASE
}, app)
.listen(3000)
```

**9. Inicialize o servidor**

Nodejs → `node index.js`
Npm → `npm run start`
Yarn → `yarn start`

**10. Teste sua conexão**

`curl -Ik https://localhost:3000/`
```sh
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-Ck1VqNd45QIvq3AZd8XYQLvEhtA"
Date: Tue, 23 Mar 2021 14:54:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5`
```


## Créditos

- [freeCodeCamp.org](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) How to get HTTPS Working on your local development Environment in 5 minutes
- [hackernoon.com](https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb) Set up SSL in NodeJs and Express using OpenSSL
- [sitepoint.com](https://www.sitepoint.com/how-to-use-ssltls-with-node-js/) How to use SSL/TLS with NodeJS

<sub>Escrito por [Moa Torres](https://github.com/moatorres) — Powered by ☕️</sub>
