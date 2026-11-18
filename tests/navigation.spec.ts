import { expect, test } from '@playwright/test';

test('a direct About visit counts towards the explorer achievement', async ({ page }) => {
  await page.goto('about');
  await expect(page.getByRole('link', { name: 'Career', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() =>
    JSON.parse(localStorage.getItem('ach_vis') ?? '[]') as string[],
  )).toContain('/about');
  await page.getByRole('link', { name: 'Career', exact: true }).click();
  // The URL changes before the lazy route has finished loading.
  await expect(page.getByText('Company Logs', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.locator('#name')).toBeVisible();
  await expect.poll(() => page.evaluate(() => ({
    visited: JSON.parse(localStorage.getItem('ach_vis') ?? '[]') as string[],
    achievements: JSON.parse(localStorage.getItem('ach') ?? '[]') as string[],
  }))).toEqual({
    visited: expect.arrayContaining(['/about', '/career', '/contact']),
    achievements: expect.arrayContaining(['explorer']),
  });
});

for (const event of ['blur', 'visibilitychange'] as const) {
  test(`movement stops on ${event} even without keyup`, async ({ page }) => {
    await page.goto('./');
    const character = page.locator('.home-character_character');
    await expect(character).toBeVisible();
    const x = () => character.evaluate(el =>
      Number.parseFloat((el as HTMLElement).style.getPropertyValue('--character-x')),
    );
    const initialX = await x();
    await page.keyboard.down('ArrowRight');
    await expect.poll(x).toBeGreaterThan(initialX + 20);
    await page.evaluate(eventName => {
      if (eventName === 'blur') window.dispatchEvent(new Event('blur'));
      else {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      }
    }, event);
    const stoppedX = await x();
    await page.waitForTimeout(250);
    expect(Math.abs(await x() - stoppedX)).toBeLessThan(2);
    await page.keyboard.up('ArrowRight');
  });
}

test('an achievement notification leaves the mobile navigation visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const toast = page.locator('.ach-toast');
  await expect(toast).toBeVisible();
  const headerBox = await page.locator('.header').boundingBox();
  const toastBox = await toast.boundingBox();
  expect(headerBox).not.toBeNull();
  expect(toastBox!.y).toBeGreaterThan(headerBox!.y + headerBox!.height);
});
