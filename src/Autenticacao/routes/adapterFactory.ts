

import dotenv from 'dotenv';
import { IFrameworkAdapter } from '../../interfaces/appInterface';
import ExpressAdapter from './adapters/expressAdapter';

function createFrameworkAdapter(): IFrameworkAdapter {
    if (process.env.FRAMEWORK === 'express') {
        return new ExpressAdapter();
    }

    
    throw new Error('Framework not found');
}

export default createFrameworkAdapter;