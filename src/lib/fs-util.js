import fs from 'fs';

function waitForFile(path, timeout, interval) {
    interval = interval || 100;
    return new Promise((resolve, reject) => {
        const globalTimeoutId = setTimeout(() => reject(new Error('Segment not Found')), timeout);
        let recurentCheckTimeoutId;

        const checkforFile = () => {
            fs.access(path, err => {
                if (err) {
                    recurentCheckTimeoutId = setTimeout(checkforFile, interval);
                    return;
                }
                clearTimeout(globalTimeoutId);
                clearTimeout(recurentCheckTimeoutId);
                resolve(path);
            });
        };

        checkforFile();
    });
}

function fileExists(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, err => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    });
}

export default {
    waitForFile: waitForFile,
    fileExists: fileExists
};
