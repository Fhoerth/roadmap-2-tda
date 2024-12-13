function extractSourceCode(content: string): string {
  const regex = /submissionCode: '([^']*)'/;
  const match = content.match(regex);

  if (match) {
    const [, submissionCode] = match;

    return submissionCode;
  } else {
    throw new Error('No match found for source code.');
  }
}

export { extractSourceCode };
