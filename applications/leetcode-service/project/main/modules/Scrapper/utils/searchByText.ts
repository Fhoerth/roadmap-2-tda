import type { Page } from 'rebrowser-puppeteer-core';

async function searchByText(page: Page, text: string): Promise<boolean> {
  const jsHandle = await page.evaluateHandle((searchText) => {
    let targetElement: HTMLElement | null = null;

    const elements = Array.from(document.querySelectorAll('*'));

    for (const element of elements) {
      if (element.textContent && element.textContent.includes(searchText)) {
        targetElement = element as HTMLElement;
        break;
      }
    }

    if (!targetElement) {
      return false;
    }

    const getFurthestParent = (node: HTMLElement): HTMLElement => {
      if (!node.parentElement) {
        return node;
      }
      return getFurthestParent(node.parentElement);
    };

    return getFurthestParent(targetElement);
  }, text);

  // Convertir el JSHandle genérico en un ElementHandle
  const elementHandle = jsHandle.asElement();

  if (!elementHandle) {
    throw new Error('El JSHandle no pudo convertirse en ElementHandle.');
  }

  return true;
}

export { searchByText };
