function extractProfileName(content: string): string {
  const regex = /username: '([^']*)'/;
  const match = content.match(regex);

  if (match) {
    const [, submissionCode] = match;

    return submissionCode;
  } else {
    throw new Error('No match found for username.');
  }
}

export { extractProfileName };
