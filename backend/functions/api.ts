import serverless from 'serverless-http';
import expressApp from '../src/index';

// Wrap the Express app in a serverless Lambda handler suitable for Netlify Functions
export const handler = serverless(expressApp);
