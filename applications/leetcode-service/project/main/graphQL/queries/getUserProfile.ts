const getUserProfile = `#graphql
  query getUserProfile($username: String!) {
      matchedUser(username: $username) {
          username
          profile {
              realName
          }
      }
      recentSubmissionList(username: $username, limit: 20) {
          id
          title
          titleSlug
          timestamp
          statusDisplay
          lang
      }
}`;

export { getUserProfile };
