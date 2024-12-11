import { Router } from 'express';

import { GraphQLClient, queries } from './leetcode/GraphQLClient';
import { scrapper } from './modules/Scrapper';
const router = Router();
const graphQLClient = new GraphQLClient();

router.get('/user/:username/profile', async (req, res) => {
  const { username } = req.params;
  const response = await graphQLClient.request(queries.getUserProfile, {
    username,
  });

  res.json(response);
});

router.get('/user/:username/submissions', async (req, res) => {
  const { username } = req.params;
  const response = await graphQLClient.request(queries.getACSubmissions, {
    username,
    limit: 20,
  });

  res.json(response);
});

router.get('/submission/:submissionId', async (req, res) => {
  const { submissionId } = req.params;
  const result = await scrapper.fetchSubmission(submissionId);
  res.json(result);
});

export { router };
