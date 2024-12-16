import { Router } from 'express';

import { GraphQLClient, queries } from '../graphQL/GraphQLClient';
import { leetCodeScrapper } from '../modules/LeetCodeScrapper';
import { processService } from '../modules/LeetCodeScrapper/ProcessService';
import { ProfileNotFoundError } from '../modules/LeetCodeScrapper/errors/ProfileNotFoundError';
import { leetCodeErrorHandler } from './handlers/leetCodeErrorHandler';

const router = Router();
const graphQLClient = new GraphQLClient();

router.get('/user/:username/profile', async (req, res, next) => {
  const { username } = req.params;
  const response = await graphQLClient.request(queries.getUserProfile, {
    username,
  });

  if ('errors' in response) {
    return next(new ProfileNotFoundError(username));
  }

  res.json(response);
});

router.get(
  '/user/:username/recent-accepted-submissions',
  async (req, res, next) => {
    const { username } = req.params;

    const profileResponse = await graphQLClient.request(
      queries.getUserProfile,
      {
        username,
      },
    );

    if ('errors' in profileResponse) {
      return next(new ProfileNotFoundError(username));
    }

    const response = await graphQLClient.request(queries.getACSubmissions, {
      username,
      limit: 20,
    });

    res.json(response);
  },
);

router.get('/submission/:submissionId', async (req, res, next) => {
  const removeNode = processService.addPendingResponse(res);

  const { submissionId } = req.params;

  try {
    res.json(await leetCodeScrapper.fetchSubmission(submissionId));
    removeNode();
  } catch (error) {
    next(error);
  }
});

router.use(leetCodeErrorHandler);

export { router };
