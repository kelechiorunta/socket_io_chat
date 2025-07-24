// import net from 'net';
// import https from 'https';
// import fs from 'fs';
// import { WebSocketServer } from 'ws';
// import { readFile } from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// dotenv.config();

// // Derive __dirname in ES Module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const PORT = process.env.PORT || 7334;
// const BUILD_FOLDER = path.join(__dirname, '../build');

// // Ensure environment variables for SSL
// if (!process.env.KEY_PEM || !process.env.CERT_PEM) {
//     console.error('KEY_PEM or CERT_PEM is not set in environment variables');
//     process.exit(1);
// }

// console.log('Key and Cert loaded successfully');

// // Global server instance
// let server = global.server;

// if (!server) {
//     // Create HTTPS server
//     server = https.createServer({
//         key: process.env.KEY_PEM.replace(/\\n/g, '\n'),
//         cert: process.env.CERT_PEM.replace(/\\n/g, '\n'),
//     });

//     // WebSocket server
//     const wss = new WebSocketServer({ server });

//     let counter = 0;
//     const activeSockets = {};

//     // Serve WebSocket connections
//     wss.on('connection', (socket) => {
//         socket.id = counter++;
//         activeSockets[socket.id] = socket;

//         console.log(`Client connected with ID: ${socket.id}`);

//         socket.on('message', (data) => {
//             console.log(`Received message from client ${socket.id}: ${data}`);
//             Object.entries(activeSockets).forEach(([id, clientSocket]) => {
//                 if (clientSocket !== socket && clientSocket.readyState === clientSocket.OPEN) {
//                     clientSocket.send(`Socket ${socket.id} says: ${data}`);
//                 }
//             });
//             socket.send(`Server received: ${data}`);
//         });

//         socket.on('close', () => {
//             delete activeSockets[socket.id];
//             console.log(`Client ${socket.id} disconnected`);
//         });
//     });

//     // Serve static files and handle React Router fallback
//     server.on('request', async (req, res) => {
//         try {
//             let filePath = path.join(
//                 BUILD_FOLDER,
//                 req.url === '/' || req.url === '*' ? 'index.html' : req.url
//             );

//             const fileContent = await readFile(filePath, 'utf-8');
//             const ext = path.extname(filePath);

//             const contentType = {
//                 '.html': 'text/html',
//                 '.js': 'application/javascript',
//                 '.css': 'text/css',
//                 '.png': 'image/png',
//                 '.jpg': 'image/jpeg',
//                 '.ico': 'image/x-icon',
//             }[ext] || 'text/plain';

//             res.writeHead(200, { 'Content-Type': contentType });
//             res.end(fileContent);
//         } catch (err) {
//             if (err.code === 'ENOENT') {
//                 try {
//                     const fallbackContent = await readFile(path.join(BUILD_FOLDER, 'index.html'), 'utf-8');
//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.end(fallbackContent);
//                 } catch (fallbackErr) {
//                     res.writeHead(500);
//                     res.end('Internal Server Error');
//                     console.error('Error serving fallback:', fallbackErr);
//                 }
//             } else {
//                 res.writeHead(500);
//                 res.end('Internal Server Error');
//                 console.error('Server error:', err);
//             }
//         }
//     });

//     // Cache server instance globally to avoid reinitialization
//     global.server = server;

//     if (!process.env.VERCEL) {
//         server.listen(PORT, () => {
//             console.log(`HTTPS server is listening on port ${PORT}`);
//         });
//     }
// }

// // Export Vercel-compatible handler
// export default (req, res) => {
//     if (!server) {
//         console.error('Server is not initialized');
//         res.writeHead(500);
//         res.end('Server initialization error');
//         return;
//     }

//     server.emit('request', req, res);
// };

//Start here

// ///////////////LAST USEFUL CODE

// // import net from 'net';
// import https from 'https';
// import http from 'http';
// import fs from 'fs';
// import { WebSocketServer } from 'ws';
// import { readFile } from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// // import { Worker, workerData } from 'worker_threads';
// import { createReadStream } from 'fs';
// import { Readable } from 'stream';

// dotenv.config();

// // Derive __dirname in ES Module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const PORT = process.env.PORT || 7334;
// const BUILD_FOLDER = path.join(__dirname, '../build');
// // console.log(process.env.KEY_PEM)
// // Ensure environment variables for SSL
// if (!process.env.KEY_PEM || !process.env.CERT_PEM) {
//     console.error('KEY_PEM or CERT_PEM is not set in environment variables');
//     process.exit(1);
// }

// console.log('Key and Cert loaded successfully');

// console.log('KEY_PEM:', process.env.KEY_PEM);
// console.log('CERT_PEM:', process.env.CERT_PEM);
// console.log(process.env.NODE_ENV);
// // console.log(process)
// // Global server instance
// let server = global.server;

// if (!server) {
//     // Create HTTPS server
//     // server = https.createServer({
//     //     key: process.env.KEY_PEM.replace(/\\n/g, '\n'),
//     //     cert: process.env.CERT_PEM.replace(/\\n/g, '\n'),
//     // });

//     // if (process.env.NODE_ENV==='DEVELOPMENT'){
//          server = http.createServer();
//     // }else{
//         // server = https.createServer({
//         //     key: process.env.KEY_PEM.replace(/\\n/g, '\n'),
//         //     cert: process.env.CERT_PEM.replace(/\\n/g, '\n'),
//         // });
//     // }

//     // WebSocket server
//     const wss = new WebSocketServer({server});

//     let counter = 0;
//     const activeSockets = {};

//     // Listener for websocket connection
//     wss.on('connection', (socket) => {
//         // Reject if already two connections
//         // if (Object.keys(activeSockets).length >= 2) {
//         //     // socket.send('Connection limit reached. Only two users allowed.');
//         //     socket.close();
//         //     return;
//         // }

//         socket.id = counter++;
//         activeSockets[socket.id] = socket;

//         console.log(`Client connected with ID: ${socket.id}`);

//         socket.on('message', (data) => {
//             console.log(`Received message from client ${socket.id}: ${data}`);
//             // Broadcast to the other socket
//             Object.entries(activeSockets).forEach(([id, clientSocket]) => {
//                 if (clientSocket === socket) {
//                     clientSocket.send(`${clientSocket.id} says ${data}`);
//                 } else {
//                     clientSocket.send(`Socket ${clientSocket.id} hears you`)
//                 }
//             });
//         });

//         socket.on('close', () => {
//             delete activeSockets[socket.id];
//             console.log(`Client ${socket.id} disconnected`);
//         });
//     });

//     // // Handle HTTP requests and WebSocket upgrades
//     // server.on('upgrade', (request, socket, head) => {
//     //     console.log('Handling WebSocket upgrade');

//     //     wss.handleUpgrade(request, socket, head, (ws) => {
//     //         wss.emit('connection', ws, request);
//     //     });
//     // });

//     // Serve static files and handle fallback for React Router
//     server.on('request', async (req, res) => {
//         // // Exclude WebSocket upgrade requests
//         // if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
//         //     return;
//         // }

//         try {
//             let filePath = path.join(
//                 BUILD_FOLDER,
//                 req.url === '/'? 'index.html' : req.url
//             );

//             const fileContent = await readFile(filePath, 'utf-8');
//             const ext = path.extname(filePath);

//             const contentType = {
//                 '.html': 'text/html',
//                 '.js': 'application/javascript',
//                 '.css': 'text/css',
//                 '.png': 'image/png',
//                 '.jpg': 'image/jpeg',
//                 '.ico': 'image/x-icon',
//             }[ext] || 'text/plain';

//             res.writeHead(200, { 'Content-Type': contentType });
//             res.end(fileContent);
//         } catch (err) {
//             if (err.code === 'ENOENT') {
//                 try {
//                     const fallbackContent = await readFile(path.join(BUILD_FOLDER, 'index.html'), 'utf-8');
//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.end(fallbackContent);
//                 } catch (fallbackErr) {
//                     res.writeHead(500);
//                     res.end('Internal Server Error');
//                     console.error('Error serving fallback:', fallbackErr);
//                 }
//             }
//             else {
//                 res.writeHead(500);
//                 res.end('Internal Server Error');
//                 console.error('Server error:', err);
//             }
//         }
//     });

//     // Cache server instance globally to avoid reinitialization
//     global.server = server;

//     // Start listening if not in Vercel environment
//     if (!process.env.VERCEL) {
//         server.listen(PORT, () => {
//             console.log(`HTTPS server is listening on port ${PORT}`);
//         });
//     }
// }

// // Export Vercel-compatible handler
// export default (req, res) => {
//     if (!server) {
//         console.error('Server is not initialized');
//         res.writeHead(500);
//         res.end('Server initialization error');
//         return;
//     }

//     server.emit('request', req, res);
// };

/////////////ENDS HERE
// /////////////////////////////////////////////
// const workerServer = http.createServer();

// let num = 0;

// workerServer.on('request', (req, res) => {
//     if (req.url='/hello' && req.method==='GET'){
//         const worker = new Worker('./worker.js', { workerData: './product9.jpg' });
//         num ++
//         worker.on('message', (data) => {
//             if (num > 5) {
//                 console.log(data.toString());
//                 // Respond with JSON containing the Base64 image
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ bufferedImage: data }));
//             }else{

//                 console.log("Hello")
//                 const readPicStream = createReadStream('./product9.jpg')

//                 // const readableStream = (buffer) => {
//                 //     const readable = new Readable();
//                 //     readable.push(buffer);
//                 //     readable.push(null);
//                 //     return readable;
//                 // }

//                 // const readingStream = readableStream(readPicStream);

//                 readPicStream.on('error', (err) => {
//                     console.log("Error in streaming", err.message)
//                 })
//                 readPicStream.pipe(res);
//                 // readingStream.pipe(res);

//             }
//         })
//     }
// })

// workerServer.listen(4500, ()=> {
//     console.log("Worker is luistening on 4500")
// })

////

// import net from 'net';
// import https from 'https';
// import fs from 'fs';
// import { WebSocketServer } from 'ws';
// import { readFile } from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// dotenv.config();

// // Derive __dirname in ES Module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // const WebSocket = require('ws');

// const PORT = process.env.WS_PORT || 7334;

// // Standalone WebSocket server
// const wss = new WebSocketServer({ port: PORT });

// let counter = 0;
// const activeSockets = {};

// wss.on('connection', (socket) => {
//     socket.id = counter++;
//     activeSockets[socket.id] = socket;

//     console.log(`Client connected with ID: ${socket.id}`);

//     socket.on('message', (data) => {
//         console.log(`Received message from client ${socket.id}: ${data}`);
//         // Broadcast to other clients
//         Object.entries(activeSockets).forEach(([id, clientSocket]) => {
//             if (clientSocket !== socket && clientSocket.readyState === WebSocket.OPEN) {
//                 clientSocket.send(`Socket ${socket.id} says: ${data}`);
//             }
//         });
//         // Echo back to sender
//         socket.send(`Server received: ${data}`);
//     });

//     socket.on('close', () => {
//         delete activeSockets[socket.id];
//         console.log(`Client ${socket.id} disconnected`);
//     });
// });

// console.log(`WebSocket server listening on ws://localhost:${PORT}`);
// server.js

let clients = [];

// wss.on('connection', (ws) => {
//   if (clients.length >= 4) {
//     ws.send('Connection limit reached. Only two clients allowed.');
//     ws.close();
//     return;
//   }

//   clients.push(ws);
//   console.log(`Client connected. Total: ${clients.length}`);

//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);

//     // Relay message to the other client
//     clients.forEach((client) => {
//       if (client !== ws && client.readyState === client.OPEN) {
//         client.send(`Peer says: ${message}`);
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//     clients = clients.filter(client => client !== ws);
//   });
// });
