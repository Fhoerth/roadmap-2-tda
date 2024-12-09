import express from 'express';

import { env } from './env';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use('/api', router);

const server = app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});

export { server };
