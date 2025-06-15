import { parentPort, workerData } from 'worker_threads';
import { readFile } from 'fs/promises';

// Define an async function to read the file
const readPicture = async (filePath) => {
    try {
        const data = await readFile(filePath);
        return data.toString('base64'); // Convert the buffer to a Base64 string
    } catch (error) {
        return `Error: ${error.message}`;
    }
};

// Execute the task when the worker starts
(async () => {
    const base64Data = await readPicture(workerData);
    parentPort.postMessage(base64Data); // Send the result back to the parent thread
})();
