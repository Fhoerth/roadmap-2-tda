import type { Page } from 'rebrowser-puppeteer-core';

async function searchByText(
  page: Page,
  parentSelector: string,
  text: string,
): Promise<boolean> {
  console.log('EVALUEEAETATTETTEE!!');
  try {
    const result = await page.evaluate(
      (searchText, parentSelector) => {
        const element = document.querySelector(parentSelector) as HTMLElement;
        const innerHTML = element.innerHTML;
        return innerHTML.includes(searchText);
      },
      text,
      parentSelector,
    );

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { searchByText };
