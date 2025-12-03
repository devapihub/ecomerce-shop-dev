import mongoose from 'mongoose';
import os from 'os';
const _SECONDS = 5_000;
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of mongoose connections: ${numConnection}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numOfCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numOfCores * 5;

        if (process.env.ENABLE_HEALTH_CHECK_LOGS === 'true') {
            console.log(`Active connections: ${numConnection}`);
            console.log(`Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

            if (numConnection > maxConnections) {
                console.error(`Overload detected: ${numConnection} connections (max: ${maxConnections})`);
            }
        }
    }, _SECONDS);
}

export {
    countConnect,
    checkOverload
};