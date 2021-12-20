const worker_threads = require('worker_threads');

let textChanged = "";
if (worker_threads.workerData.message === "" || worker_threads.workerData.text === "") {
    textChanged = "Отсутствуют необходимые данные для поиска";
} else {
    textChanged = worker_threads.workerData.text;
    const regex = new RegExp(`${worker_threads.workerData.message}`, "gui");
    textChanged = textChanged.replace(regex, `<span style="background: burlywood;">${worker_threads.workerData.message}</span>`);
}

worker_threads.parentPort.postMessage(textChanged);



