import { getUserProfile } from './queries/getUserProfile';

class GraphQLClient {
  #BASE_URL = 'https://leetcode.com/graphql';
  #REFERER = 'https://leetcode.com';

  public async request<T extends Record<string, unknown>>(
    query: string,
    variables: Record<string, string | number>,
  ): Promise<T> {
    const response = await fetch(this.#BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: this.#REFERER,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await response.json();

    return json as T;
  }
}

const queries = { getUserProfile };

export { queries };
export { GraphQLClient };
