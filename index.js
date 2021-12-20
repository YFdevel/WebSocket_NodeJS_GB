const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {uniqueNamesGenerator, adjectives, colors} = require('unique-names-generator');
const readHandler = require('./handlers/read.js');
const searchHandler = require('./handlers/search.js');


const clients = {};

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);
    readStream.pipe(res);
});

const io = socket(server);
let clientsNumber = 0;
io.on('connection', function (client) {
    const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors],
        length: 2
    });
    clients[client.id] = randomName;
    console.log('New client:', randomName);
    let previousFilePath = "";

    client.broadcast.emit('new-client-connected', {description: randomName + ' connected!'});
    client.broadcast.emit('new-client-greet', {description: randomName + `: Hey, welcome!`});
    clientsNumber++;
    io.sockets.emit('broadcast', {description: clientsNumber + ' clients connected!'});

    client.on('client-msg-to-read', function (data) {
        const payload={
            message:data,
            path:previousFilePath
        }
        readHandler(client, randomName, payload);
    });
    client.on('change-filepath', (filepath) => {
        previousFilePath = filepath;
    });
    client.on('client-msg-to-search', function (data) {
        searchHandler(client, randomName, data);
    });

    client.on('disconnect', function () {
        clientsNumber--;
        io.sockets.emit('broadcast', {description: clients[client.id] + ' disconnected!'});
        io.sockets.emit('broadcast', {description: clientsNumber + ' clients connected!'});
    });
});
server.listen(5555);





