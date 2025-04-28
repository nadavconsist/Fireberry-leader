import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const consistToken = process.env.CONSIST_TOKEN;

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const clientToken = req.headers['x-client-token'];
    if (!clientToken || clientToken !== consistToken) {
        logger.error(`Authentication failed: Token missing or invalid ${req.originalUrl}`);
        res.status(403).json({ message: 'A token is required for authentication' });
        return;
    }
    try {
        next();
    } catch (error) {
        logger.error('authenticateToken error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};