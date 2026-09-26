import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pdf = { name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('regression fixture') }

test.beforeEach(async ({ page }) => {
  await page.goto('/probe')
  await expect(page.locator('#select-m')).toHaveAttribute('type', 'button')
  await page.locator('#cookie').evaluate((element) => { element.setAttribute('hidden', '') })
})

test('disabled slotted actions block child and wrapper callbacks but allow Tab', async ({ page }) => {
  for (const id of ['disabled-action', 'native-disabled-action']) {
    const action = page.locator(`#${id}`)
    await action.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    await action.evaluate((element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })))
    await page.keyboard.press('Tab')
    await expect(action).not.toBeFocused()
  }
  await expect(page.locator('#clicks')).toHaveText('0')
})

test('required uploads and checkbox groups validate enabled controls', async ({ page }) => {
  expect(await page.locator('#compact-form').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBe(false)
  await expect(page.locator('#compact-form button')).toBeFocused()
  expect(await page.locator('#checks').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBe(false)
  await page.getByLabel('Available', { exact: true }).check()
  expect(await page.locator('#checks').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBe(true)
  await page.locator('#compact').setInputFiles(pdf)
  expect(await page.locator('#compact-form').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBe(true)
})

test('controlled files own both displayed and submitted selections', async ({ page }) => {
  await page.locator('#controlled-file').setInputFiles(pdf)
  expect(await page.locator('#controlled-file').evaluate((input) => (input as HTMLInputElement).files?.length)).toBe(0)
  await expect(page.locator('#controlled-upload li')).toHaveCount(0)
  for (const id of ['accepted', 'async']) {
    await page.locator(`#${id}-file`).setInputFiles(pdf)
    await expect(page.locator(`#${id} li`)).toHaveCount(1)
    expect(await page.locator(`#${id} form`).evaluate((form) => (new FormData(form as HTMLFormElement).get('attachment') as File).name)).toBe('test.pdf')
    await page.locator(`#${id} button`).click()
    await expect(page.locator(`#${id} li`)).toHaveCount(0)
    expect(await page.locator(`#${id}-file`).evaluate((input) => (input as HTMLInputElement).files?.length)).toBe(0)
  }
})

test('reset restores upload validity and textarea counts', async ({ page }) => {
  await page.locator('#reset-file').setInputFiles(pdf)
  await page.getByRole('button', { name: 'Reset upload', exact: true }).click()
  await expect(page.locator('#reset-upload li')).toHaveCount(0)
  expect(await page.locator('#reset-upload').evaluate((form) => (form as HTMLFormElement).checkValidity())).toBe(false)
  await page.locator('#reset-area').fill('longer edited text')
  await page.getByRole('button', { name: 'Reset text', exact: true }).click()
  await expect(page.locator('#reset-area')).toHaveValue('seed')
  await expect(page.locator('#reset-text')).toContainText('4/30')
  await page.locator('#prevented-area').fill('edited')
  await page.getByRole('button', { name: 'Prevent reset', exact: true }).click()
  await expect(page.locator('#prevented-area')).toHaveValue('edited')
  await expect(page.locator('#prevented-reset')).toContainText('6/30')
})

test('file validation and statuses accurately describe selection', async ({ page }) => {
  await expect(page.locator('#disabled-upload button')).toBeDisabled()
  await page.locator('#disabled-upload button').evaluate((element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })))
  await expect(page.locator('#disabled-upload li')).toHaveCount(1)
  await page.locator('#compact').setInputFiles({ ...pdf, name: 'unexpected.exe' })
  await expect(page.locator('#compact-form [role=alert]')).toContainText('Nepodporovaný formát')
  await page.locator('#compact').setInputFiles({ ...pdf, buffer: Buffer.alloc(16 * 1024 * 1024) })
  await expect(page.locator('#compact-form [role=alert]')).toContainText('maximálnu veľkosť')
  await page.locator('#compact').setInputFiles(pdf)
  await expect(page.locator('#compact-form li')).toContainText('bol vybraný')
  await expect(page.locator('#compact-form li')).not.toContainText('úspešne nahraný')
})


test('invalid or empty replacement preserves a previously selected single file', async ({ page }) => {
  await page.locator('#single-file').setInputFiles(pdf)
  await page.locator('#single-file').setInputFiles({ ...pdf, name: 'bad.exe' })
  await expect(page.locator('#single-upload li')).toContainText('test.pdf')
  await page.locator('#single-file').setInputFiles([])
  expect(await page.locator('#single-upload').evaluate((form) => (new FormData(form as HTMLFormElement).get('attachment') as File).name)).toBe('test.pdf')
})

test('drop validation uses the same rules and payload as the picker', async ({ page }) => {
  await page.locator('#reset-upload label').evaluate((label) => {
    const transfer = new DataTransfer()
    transfer.items.add(new File(['bad'], 'bad.exe', { type: 'application/octet-stream' }))
    transfer.items.add(new File(['pdf'], 'dropped.pdf', { type: 'application/pdf' }))
    label.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }))
  })
  await expect(page.locator('#reset-upload li')).toHaveCount(1)
  await expect(page.locator('#reset-upload [role=alert]')).toContainText('bad.exe')
  expect(await page.locator('#reset-upload').evaluate((form) => (new FormData(form as HTMLFormElement).get('attachment') as File).name)).toBe('dropped.pdf')
})

test('error state, focus and field geometry match the reference', async ({ page }) => {
  await expect(page.locator('#select-m')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#radio')).toHaveAttribute('aria-invalid', 'true')
  await page.getByRole('link', { name: 'Fix radio group' }).click()
  await expect(page.locator('#radio input')).toBeFocused()
  for (const [id, height] of [['select-m', 40], ['select-l', 48], ['input-m', 40]] as const) {
    expect((await page.locator(`#${id}`).boundingBox())?.height).toBeCloseTo(height, 2)
    await expect(page.locator(`#${id}`)).toHaveCSS('letter-spacing', '0.5px')
  }
  await expect(page.locator('#input-m-hint')).toHaveCSS('font-size', '16px')
  await expect(page.locator('#focused-summary')).not.toHaveAttribute('role', 'alert')
  await page.locator('#fields').screenshot({ path: `test-results/fields-${test.info().project.name}.png` })
  await page.locator('header').screenshot({ path: `test-results/header-${test.info().project.name}.png` })
})

test('mobile profile, breadcrumbs and short cookie notice remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await expect(page.getByRole('link', { name: 'Profil: Jana Novakova' })).toBeVisible()
  await expect(page.locator('#crumb ol')).toBeVisible()
  await page.locator('#cookie').evaluate((element) => { element.removeAttribute('hidden') })
  const region = page.locator('#cookie section')
  const box = await region.boundingBox()
  expect(box?.y).toBeGreaterThanOrEqual(0)
  expect(box!.y + box!.height).toBeLessThanOrEqual(568)
  await region.getByRole('button').last().focus()
  await expect(region.getByRole('button').last()).toBeInViewport()
  await page.screenshot({ path: `test-results/cookie-${test.info().project.name}.png` })
})

test('feedback waits for success, announces status and permits retry', async ({ page }) => {
  const feedback = page.getByRole('region', { name: 'Lišta spätnej väzby' })
  await expect(feedback.getByRole('status')).toHaveText('')
  await feedback.getByRole('button', { name: 'Áno, tieto informácie boli pre mňa užitočné' }).click()
  await expect(feedback.getByRole('alert')).toBeVisible()
  await expect(feedback.getByRole('status')).toHaveText('')
  await feedback.getByRole('button', { name: 'Áno, tieto informácie boli pre mňa užitočné' }).click()
  await expect(feedback.getByRole('status')).toContainText('Ďakujeme')
})

test('native controls and accordion content work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/probe')
  await page.locator('#cookie').evaluate((element) => element.setAttribute('hidden', ''))
  await expect(page.getByText('Unique no JavaScript content')).toBeVisible()
  await page.locator('#select-m').selectOption('one')
  await expect(page.locator('#select-m')).toHaveValue('one')
  await page.getByLabel('Available', { exact: true }).check()
  await expect(page.getByLabel('Available', { exact: true })).toBeChecked()
  await context.close()
})

for (const width of [390, 730, 1440]) {
  test(`demo accessibility and overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/demo-${width}-${test.info().project.name}.png`, fullPage: true })
  })
}
