// @ts-ignore
import server from '../dist/server.cjs';

const app = server.default || server.app || server;

export default app;
