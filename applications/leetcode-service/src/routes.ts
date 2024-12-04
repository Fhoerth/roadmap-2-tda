import { Router } from 'express';

import { GraphQLClient, queries } from './leetcode/GraphQLClient';

const router = Router();
const graphQLClient = new GraphQLClient();

router.get('/user/:username/profile', async (req, res) => {
  const { username } = req.params;
  const response = await graphQLClient.request(queries.getUserProfile, {
    username,
  });

  res.json(response);
});

export { router };
