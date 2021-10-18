const Config = require('./Config.json');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const httpPort = Config.HTTP_PORT;
const httpsPort = Config.HTTPS_PORT;
const databaseURL = Config.DATABASE_URL;
const privateKeyFilePath = Config.PRIVATE_KEY_FILEPATH;
const certificateFilePath = Config.CERTIFICATE_FILEPATH;
const caCertificateFilePath = Config.CA_CERT_FILEPATH;
const pemPassphrase = Config.PEM_PASSPHRASE;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let privateKey;
try {
    privateKey = fs.readFileSync(privateKeyFilePath, 'utf8');

}catch(error) {
    console.log("ERROR: Could not find private key!");
}

let certificate;
try {
    certificate = fs.readFileSync(certificateFilePath, 'utf8');

}catch(error) {
    console.log("ERROR: Could not find certificate!");
}

let caCert;
try {
    caCert = fs.readFileSync(caCertificateFilePath, 'utf8');

}catch(error) {
    console.log("ERROR: Could not find chain certificate!")
}

const certs = {key: privateKey, passphrase: pemPassphrase, cert: certificate, ca: caCert};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certs, app);

httpsServer.listen(httpsPort, (error) => {
    if(error) console.log(error);
    console.log("HTTPS Server started on port " + httpsPort); 
});

httpServer.listen(httpPort, (error) => {
    if(error) console.log(error);
    console.log("HTTP Server started on port " + httpPort);
});

mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database!"));

const routeExampleRouter = require('./routes/RouteExample');
app.use('/api/route', routeExampleRouter);