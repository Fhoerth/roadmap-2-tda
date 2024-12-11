function extractSourceCode(content: string): string {
  const regex = /submissionCode: '([^']*)'/;
  const match = content.match(regex);

  if (match) {
    const submissionCode = match[1]; // El contenido capturado
    console.log('Extracted Code:', submissionCode);

    return submissionCode;
  } else {
    throw new Error('No match found');
  }
}

export { extractSourceCode };
