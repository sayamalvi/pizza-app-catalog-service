import { HttpError } from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import logger from '../../config/logger';

const parseStackTrace = (stack: string | undefined) => {
    if (!stack) return null;

    const stackLines = stack.split('\n');
    const relevantLine = stackLines[1]; // Typically, the second line has the information.
    if (!relevantLine) return null;

    const match =
        relevantLine.match(/at (\S+) \((.*):(\d+):(\d+)\)$/) ||
        relevantLine.match(/at (.*):(\d+):(\d+)/); // Handle cases with or without function names

    if (match) {
        const [_, functionName, filePath, line, column] = match;
        return {
            functionName: functionName || 'anonymous',
            filePath: filePath || match[2],
            line: line || match[3],
            column: column || match[4],
        };
    }

    return null;
};

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const errorId = uuidv4();

    const statusCode = err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction
        ? `An unexpected error occurred.`
        : err.message;

    const stackDetails = parseStackTrace(err.stack);

    logger.error(err.message, {
        id: errorId,
        error: err.stack,
        path: req.path,
        method: req.method,
        ...stackDetails,
    });

    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: err.name,
                msg: message,
                path: req.path,
                location: 'server',
                stack: isProduction ? null : err.stack,
                details: stackDetails,
            },
        ],
    });
};
