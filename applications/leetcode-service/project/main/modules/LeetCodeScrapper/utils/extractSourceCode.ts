function extractSourceCode(content: string): string {
  const regex = /submissionCode: '([^']*)'/;
  const match = content.match(regex);

  if (!match) {
    throw new Error('No match found for source code.');
  }

  const [, submissionCode] = match;

  return submissionCode;
}

export { extractSourceCode };
