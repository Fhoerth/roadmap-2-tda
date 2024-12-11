import express from 'express';

import { env } from './env';
import { router } from './router';

const PORT = parseInt(env.PORT) || 3000;

const app = express();

app.use(express.json());
app.use('/api', router);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export { server };
