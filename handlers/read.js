const {Worker} = require('worker_threads');

function read(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workers/reader.worker.js', {workerData});
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

function readHandler(client,randomName,data) {
    const payload = {
        message: data.message + ' запрос на сервер обработан',
        nextMessage:data.message,
        path:data.path
    }
    client.emit('server-msg', payload);
    client.broadcast.emit("broadcast-request-server", {description: randomName + ' отправил сообщение серверу: ' + `${data.message}`});
    read(payload)
        .then(result => {
            client.emit('server-msg-reader', result)
        })
        .catch(err => console.error(err));
};

module.exports=readHandler;