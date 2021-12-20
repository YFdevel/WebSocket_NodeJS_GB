const worker_threads = require('worker_threads');
const path = require("path");
const fs = require("fs");


let data = "";
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

const filePath= (!worker_threads.workerData.nextMessage) ? process.cwd() : (/^[a-zA-Zа-яА-Я]+\.*[a-zA-Zа-яА-Я]+/.test(worker_threads.workerData.nextMessage)) ? path.resolve(worker_threads.workerData.path, worker_threads.workerData.nextMessage) : worker_threads.workerData.nextMessage;

fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            data = "File doesn't exist";
            const payload={
                data:`<h2>${data}</h2>`,
                filePath
            }
            worker_threads.parentPort.postMessage(payload);
            throw err;
        } else {
            if (isFile(filePath)) {
                const readStream = fs.createReadStream(filePath, 'utf-8');
                readStream.on('data', chunk => data += chunk);
                readStream.on('end', () => {
                    const payload={
                        data,
                        filePath
                    }
                    worker_threads.parentPort.postMessage(payload);
                });
            } else {
                try {
                    const readDir = fs.readdirSync(filePath);
                    readDir.forEach((file) => {
                        data += `<button class='forward' value=${file} onclick="forward(this.value)">${file}</button><br>`;
                    })
                    const payload={
                        data,
                        filePath
                    }
                    worker_threads.parentPort.postMessage(payload);

                } catch (err) {
                    if (err)
                        throw err;
                }
            }
        }
    }
)


