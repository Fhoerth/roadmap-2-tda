import { Router } from 'express';

import { GraphQLClient, queries } from '../leetcode/GraphQLClient';
import { leetCodeScrapper } from '../modules/LeetCodeScrapper';
import { leetCodeErrorHandler } from './handlers/leetCodeErrorHandler';

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

router.get('/submission/:submissionId', async (req, res, next) => {
  const { submissionId } = req.params;
  try {
    const result = await leetCodeScrapper.fetchSubmission(submissionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.use(leetCodeErrorHandler);

export { router };
