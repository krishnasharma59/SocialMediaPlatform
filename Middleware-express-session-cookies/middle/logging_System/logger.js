import express from 'express';
import fs from 'fs';

const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const statusCode = res.statusCode;
        const responseTime = Date.now() - startTime;

        const log = `[${timestamp}] ${method} ${url} ${statusCode} - ${responseTime}ms\n`;

        fs.appendFile('requests.log', log, (err) => {
            if (err) console.error('Error writing log:', err);
        });
    });

    next();
};

export default requestLogger;