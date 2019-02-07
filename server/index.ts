import * as next from 'next';
import * as express from 'express';
import * as path from 'path';
import clientRoutes from './routes';
import { HTTPHandler } from 'next-routes';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '8081', 10);
const app = next({ dev, dir: path.resolve(__dirname, '../src') });
const routeHandler: HTTPHandler = clientRoutes.getRequestHandler(app);

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());
    server.use(routeHandler);

    server.listen(port, (error: Error) => {
      if (error) {
        throw error;
      }
      console.log(`> Ready on ${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
