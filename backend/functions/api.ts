import serverless from 'serverless-http';
import expressApp from '../src/index';

// Native Serverless wrap
export const handler = serverless(expressApp);
