function extractSlug(content: string): string {
  const slugRegex = /\/problems\/([\w-]+)\//g;
  
  let slug: string = '';
  let match: RegExpExecArray | null;
  
  while ((match = slugRegex.exec(content)) !== null) {
    if (!slug) {
      slug = match[1].trim().toLowerCase();
    } else {
      if (match[1].trim().toLowerCase() !== slug) {
        throw new Error(`Slug ${[match[1]]} doesn't match with ${[slug]}`);
      }
    }
  }

  if (!slug) {
    throw new Error('Slug not found in content');
  }

  return slug;
}

export { extractSlug };