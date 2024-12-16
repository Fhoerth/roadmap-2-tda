import type { ElementHandle, Page } from 'rebrowser-puppeteer-core';

async function searchByText(
  elementHandle: ElementHandle<HTMLElement>,
  searchText: string,
): Promise<boolean> {
  return await elementHandle.evaluate((element, searchText) => {
    return element.innerHTML.includes(searchText);
  }, searchText);
}

async function isAccepted(statisticsPage: Page): Promise<boolean> {
  const elements = await statisticsPage.$$('div.overflow-auto');

  for (const element of elements) {
    const found = await searchByText(element, 'Accepted').catch(() => false);

    if (found) {
      return true;
    }
  }

  return false;
}

export { isAccepted };
