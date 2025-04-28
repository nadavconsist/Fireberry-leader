// src/config/envConfig.ts

import dotenv from 'dotenv';
import logger from '../logger';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getEnvVar(name: string, isOptional = false, defaultValue?: string): string {
    const value = process.env[name] || defaultValue;
    if (!value && !isOptional) {
        logger.error(`Missing ${name} environment variable`);
        throw new Error(`Missing ${name} environment variable`);
    }
    return value || '';
}

const envConfig = {
    port: parseInt(getEnvVar('PORT', true, '3000')),
    nodeEnv: getEnvVar('NODE_ENV', true, 'development'),
    consistToken: getEnvVar('CONSIST_TOKEN', true),
    MONGO_DB_CONNECTION_STRING: getEnvVar('MONGO_DB_CONNECTION_STRING'),
    
};

export default envConfig;
