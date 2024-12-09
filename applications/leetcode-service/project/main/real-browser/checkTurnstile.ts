import type { ElementHandle, Page } from 'rebrowser-puppeteer-core';

interface CheckTurnstileOptions {
  page: Page;
}

interface Coordinate {
  x: number;
  y: number;
  w: number;
  h: number;
}

async function checkTurnstile({
  page,
}: CheckTurnstileOptions): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const waitInterval = setTimeout(() => {
      clearInterval(waitInterval);
      resolve(false);
    }, 5000);

    try {
      const elements = await page.$$('[name="cf-turnstile-response"]');
      if (elements.length <= 0) {
        const coordinates = await page.evaluate(() => {
          let coordinates: Coordinate[] = [];
          document.querySelectorAll('div').forEach((item) => {
            try {
              let itemCoordinates = item.getBoundingClientRect();
              let itemCss = window.getComputedStyle(item);
              if (
                itemCss.margin == '0px' &&
                itemCss.padding == '0px' &&
                itemCoordinates.width > 290 &&
                itemCoordinates.width <= 310 &&
                !item.querySelector('*')
              ) {
                coordinates.push({
                  x: itemCoordinates.x,
                  y: item.getBoundingClientRect().y,
                  w: item.getBoundingClientRect().width,
                  h: item.getBoundingClientRect().height,
                });
              }
            } catch (err) {}
          });

          if (coordinates.length <= 0) {
            document.querySelectorAll('div').forEach((item) => {
              try {
                let itemCoordinates = item.getBoundingClientRect();
                if (
                  itemCoordinates.width > 290 &&
                  itemCoordinates.width <= 310 &&
                  !item.querySelector('*')
                ) {
                  coordinates.push({
                    x: itemCoordinates.x,
                    y: item.getBoundingClientRect().y,
                    w: item.getBoundingClientRect().width,
                    h: item.getBoundingClientRect().height,
                  });
                }
              } catch (err) {}
            });
          }

          return coordinates;
        });

        for (const item of coordinates) {
          try {
            let x = item.x + 30;
            let y = item.y + item.h / 2;
            await page.mouse.click(x, y);
          } catch (err) {}
        }
        return resolve(true);
      }

      for (const element of elements) {
        try {
          // Evaluar y obtener el padre del elemento
          const parentHandle = await element.evaluateHandle(
            (el) => el.parentElement,
          );

          // Verificar si se obtuvo un padre
          if (!parentHandle) {
            console.warn('El elemento no tiene un elemento padre.');
            continue; // Saltar este elemento
          }

          // Verificar si el padre es un ElementHandle y obtener boundingBox
          if (parentHandle.asElement()) {
            const parentElementHandle =
              parentHandle as ElementHandle<HTMLElement>;
            const box = await parentElementHandle.boundingBox();

            if (!box) {
              console.warn(
                'El elemento no es visible o está fuera del viewport.',
              );
              continue;
            }

            const x = box.x + 30;
            const y = box.y + box.height / 2;

            await page.mouse.click(x, y);
          } else {
            console.warn('El objeto no es un ElementHandle válido.');
          }

          await parentHandle.dispose();
        } catch (err) {
          console.error('Error al procesar el elemento:', err);
        }
      }

      clearInterval(waitInterval);
      resolve(true);
    } catch (err) {
      clearInterval(waitInterval);
      resolve(false);
    }
  });
}

export { checkTurnstile };
