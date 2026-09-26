const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const base = process.env.AUDIT_URL || 'http://localhost:3158'
const out = __dirname

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const results = { browser: browser.version(), errors: [] }
  page.on('pageerror', error => results.errors.push(error.message))
  await page.goto(`${base}/probe`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.locator('#cookie').evaluate(e => e.hidden = true)
  results.initial = await page.evaluate(() => ({
    compactRequired: document.querySelector('#compact').required,
    compactValid: document.querySelector('#compact-form').checkValidity(),
    checkboxValid: document.querySelector('#checks').checkValidity(),
    selectInvalidOverride: document.querySelector('#select-m').getAttribute('aria-invalid'),
    radioInvalid: document.querySelector('#radio input').getAttribute('aria-invalid'),
    fields: [...document.querySelectorAll('#fields input,#fields button')].map(e => {
      const s = getComputedStyle(e)
      return { id: e.id, height: e.getBoundingClientRect().height, font: s.fontSize, tracking: s.letterSpacing }
    }),
  }))
  await page.locator('#disabled-action').focus()
  await page.keyboard.press('Enter')
  results.disabledActionCalls = await page.locator('#clicks').textContent()
  await page.getByRole('link', { name: 'Fix radio group' }).click()
  results.summaryFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }))
  await page.locator('#disabled-upload button').click()
  results.disabledFileRemoved = await page.locator('#disabled-upload li').count() === 0
  const pdf = { name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('audit fixture') }
  await page.locator('#reset-file').setInputFiles(pdf)
  await page.getByRole('button', { name: 'Reset upload', exact: true }).click()
  results.uploadAfterReset = await page.locator('#reset-upload').evaluate(form => ({
    displayedFiles: form.querySelectorAll('li').length,
    nativeFiles: form.querySelector('input').files.length,
    required: form.querySelector('input').required,
    valid: form.checkValidity(),
  }))
  await page.locator('#controlled-file').setInputFiles(pdf)
  results.rejectedControlledUpload = await page.locator('#controlled-upload').evaluate(form => ({
    displayedFiles: form.querySelectorAll('li').length,
    nativeFiles: [...form.querySelector('input').files].map(f => f.name),
    submittedFiles: [...new FormData(form)].map(([key, file]) => ({ key, name: file.name, size: file.size })),
  }))
  await page.locator('#compact').setInputFiles({ name: 'unexpected.exe', mimeType: 'application/octet-stream', buffer: Buffer.alloc(16 * 1024 * 1024) })
  results.uploadClaim = await page.locator('#compact-form').innerText()
  await page.locator('#reset-area').fill('longer edited text')
  await page.getByRole('button', { name: 'Reset text', exact: true }).click()
  results.textAfterReset = await page.locator('#reset-text').evaluate(form => ({ value: form.querySelector('textarea').value, text: form.innerText }))
  await page.getByRole('button', { name: 'Audit tooltip', exact: true }).focus()
  results.tooltipOnFocus = await page.getByRole('tooltip').count()
  await page.keyboard.press('Escape')
  results.tooltipAfterEscape = await page.getByRole('tooltip').count()
  await page.setViewportSize({ width: 390, height: 844 })
  results.mobileProfile = await page.locator('a[href="#profile"]').ariaSnapshot()
  results.mobileBreadcrumbVisible = await page.locator('#crumb ol').isVisible()
  results.mobileBreadcrumbReplacementCount = await page.locator('#crumb a:visible').count()
  await page.locator('#cookie').evaluate(e => e.hidden = false)
  await page.setViewportSize({ width: 320, height: 568 })
  results.cookie = await page.locator('#cookie section').evaluate(e => ({ top: e.getBoundingClientRect().top, height: e.getBoundingClientRect().height, viewport: innerHeight, overflow: getComputedStyle(e).overflowY }))
  await page.screenshot({ path: path.join(out, 'cookie-320.png') })
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  const n = await nojs.newPage()
  await n.goto(`${base}/probe`)
  results.noJavaScript = await n.evaluate(() => ({
    accordionContent: document.body.textContent.includes('Unique no JavaScript content'),
    checkboxButtons: document.querySelectorAll('#checks button[role=checkbox]').length,
    checkboxInputs: [...document.querySelectorAll('#checks input')].map(e => ({ type: e.type, width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })),
    selectButtons: document.querySelectorAll('#fields button[role=combobox]').length,
    selects: [...document.querySelectorAll('#fields select')].map(e => ({ width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })),
  }))
  results.demo = []
  await page.goto(base, { waitUntil: 'networkidle' })
  for (const width of [320, 390, 729, 730, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const record = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth }))
    if ([390, 1440].includes(width)) {
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
      record.axe = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ html: n.html, failure: n.failureSummary })) })))
      await page.locator('header').first().screenshot({ path: path.join(out, `header-${width}.png`) })
    }
    results.demo.push(record)
  }
  fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify(results, null, 2))
  await browser.close()
  console.log(JSON.stringify(results, null, 2))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
