const {Worker} = require('worker_threads');

function search(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workers/search.worker.js', {workerData});
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

function searchHandler(client,randomName,data) {
    console.log(data.message + " from client " + randomName);
    const payload = {
        message: data.message + ' запрос на сервер обработан'
    }
    client.emit('server-msg', payload);
    client.broadcast.emit("broadcast-request-server", {description: randomName + ' отправил сообщение серверу: ' + `${data.message}`});
    search(data)
        .then(result => {
            client.emit('server-msg-search', result)
        })
        .catch(err => console.error(err));
};

module.exports=searchHandler;







