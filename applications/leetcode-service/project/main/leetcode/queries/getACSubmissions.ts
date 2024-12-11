const getACSubmissions = `#graphql
  query getACSubmissions ($username: String!, $limit: Int) {
      recentAcSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
      }
  }`;

export { getACSubmissions };
