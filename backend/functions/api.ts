import serverless from 'serverless-http';
import expressApp from '../src/index';

// Provide explicit AWS Lambda basePath so Netlify doesn't accidentally pass raw Lambda URIs into Express
export const handler = serverless(expressApp, {
  basePath: '/.netlify/functions/api'
});
