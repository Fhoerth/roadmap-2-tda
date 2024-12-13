import { readFile } from 'fs/promises';

const convertImageToBase64 = async (imagePath: string): Promise<string> => {
  try {
    const imageBuffer = await readFile(imagePath);
    const base64String = imageBuffer.toString('base64');
    const mimeType = 'image/png';

    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    throw new Error(`Error converting image \`${imagePath}\` to Base64`);
  }
};

export { convertImageToBase64 };
