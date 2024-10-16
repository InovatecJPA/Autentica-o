

import dotenv from 'dotenv';
import { IFrameworkAdapter } from '../../interfaces/appInterface';
import ExpressAdapter from './adapters/expressAdapter';
dotenv.config()

function createFrameworkAdapter(): IFrameworkAdapter {
    if (process.env.SERVER_FRAMEWORK === 'express') {
        return new ExpressAdapter();
    }

    
    throw new Error('Framework not found');
}

export default createFrameworkAdapter;