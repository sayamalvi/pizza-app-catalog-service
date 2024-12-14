import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';

export const canAccess = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const roleFromToken = (req as AuthRequest).auth.role;
        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(403, "You don't have the permission");
            next(error);
            return;
        }
        next();
    };
};
