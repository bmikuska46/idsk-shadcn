# IDSK 3.1.0 integration contracts

This library is an unofficial React implementation. The two audits dated 2026-09-26 and their pinned Figma measurements are the baseline for the remediation. Automated tests cover the reproduced failures; they do not establish certification of every IDSK variant or screen-reader combination.

## Forms

- `FileUpload` starts new files in `selected`, not `success`. Set `uploading`, `success`, or `error` through the controlled `files` prop as your upload request progresses. `success` means your backend accepted the upload.
- `files` is authoritative for both the rows and native `FormData`. Rejecting a proposed selection leaves it out of both. Delayed acceptance adds it only when the parent supplies it. Controlled removal follows the same rule.
- `accept` and `maxSizeBytes` validate picker and dropped files. The default is JPG, JPEG, PNG, DOC, DOCX and PDF, up to 15 MiB. `maxSizeLabel` and `supportedFormats` customize display text only; keep them consistent with those validation props. `validateFile` adds a synchronous validation rule; `onFilesRejected` receives rejected files and reasons.
- Client validation checks names, declared MIME types and size. Validate content, authorization and size again on the server. Selecting a file does not upload it.
- Uncontrolled form reset restores `defaultFiles`; controlled reset restores the current `files`. A persisted item with `status: 'success'` can satisfy required validation without a local `File`. Submit the corresponding server-side attachment identifier separately. An item without a `File` cannot appear as a binary attachment in `FormData`.
- `disabled` blocks selection and removal. Compact and drop-zone modes both enforce `required`.
- Checkbox inputs remain native. `required` on the group means at least one enabled, non-mixed item must be selected after enhancement. Without JavaScript, the first enabled option carries the native required constraint; validate the group on the server as well. Individual `item.required` means that specific item is mandatory.
- Select renders a native select before hydration and enhances it with Radix. The existing button ref and event API apply after enhancement. Accordion content is expanded in server HTML and adopts the configured open state after hydration.
- Native textarea resets update the character counter after the browser completes its reset action. Prevented resets leave it unchanged.
- Use the public radio-group ID in `ErrorSummary` links. It resolves to the first enabled control. `focusOnMount` uses focus instead of an alert role. Avoid adding another live announcement around it.

## Buttons and feedback

`Button asChild disabled` and `aria-disabled="true"` prevent activation before child or wrapper activation callbacks run. Disabled links remain reachable by Tab, carry `aria-disabled`, and do not navigate. Native buttons retain native disabled behavior.

`FeedbackBar` accepts synchronous or promise-returning `onYes`, `onNoSubmit`, and `onReportSubmit`. While a returned promise is pending, submission controls are disabled. Resolve only after your backend accepts the response; reject to retain the form and display `failureMessage`. The persistent polite status region announces completion, while focus moves to a separately named group. `onNo` and `onReport` are synchronous opening notifications. With no submission callback, the component runs as a local demonstration and stores nothing.

Cookie consent persistence is owned by the consumer. Supply the accept/reject/settings callbacks and store the choice according to your application's policy. The demo only opens and dismisses its notice.

## Identity, search and icons

`IdskHeader.logo` supplies the identity graphic and service name inside the existing home link. Give approved images suitable alternative text, and avoid nesting another link. The default `GovernmentLogo` remains a text-only unofficial identity. Footer has the equivalent `logo` slot.

Header and SearchInput support query submission. Autocomplete suggestions, remote loading and result-list navigation are not implemented. Do not present the search as an autocomplete combobox.

The filled status and header icons use Google's Material Icons, with these mappings:

| Use | Material glyph |
| --- | --- |
| Header mail | `mail` |
| Header notifications | `notifications` |
| Information banners | `info` |
| Success banners and feedback | `check_circle` |
| Warning banners | `warning` |
| Error banners | `error` |

The source paths are in `material-icon.tsx`. The registry includes the upstream Apache-2.0 license. Navigation, upload and action glyphs use the corresponding Material `expand_more`, `expand_less`, `chevron_left`, `chevron_right`, `menu`, `search`, `close`, `cloud_upload`, `insert_drive_file`, `add`, `file_upload`, `check`, `remove`, `home` and `arrow_forward` paths. InformationBar and AnnouncementBar accept custom `icon` content; Button accepts leading and trailing icons.

## Styles and composition

Install Styles explicitly and import it once, with Source Sans Pro weights 400, 700 and 900. The stylesheet changes global root tokens and element styles and sets Tailwind's `sm` breakpoint to 730px. Review its impact when adding it to an existing shadcn application; it is not a scoped theme.

Select and Input sizes are L 48px and M 40px. Medium field supporting text is 16/24, with a 19px required marker. Body and control tracking is 0.5px; caption tracking is 0.4px. Use darker foreground text on tinted surfaces rather than the muted token intended for white.

Footer columns distribute across one to four tracks according to the supplied count. Unlinked cards show their full text; linked cards retain the reference truncation and need a destination containing the full content.

## Verification

Run `pnpm lint`, `pnpm build`, `pnpm typecheck`, `pnpm audit --prod`, `pnpm test`, and `pnpm test:registry`. Install Playwright browsers first with `pnpm exec playwright install chromium firefox webkit`.

Browser fixtures are copied into a disposable project by `tests/serve.mjs`; they are never added to production routes. Browser tests cover Chromium, Firefox and WebKit, including no-JavaScript operation, native form data, reset, keyboard activation, short viewports, geometry, and axe checks at 390, 730 and 1440px. WebKit automation is not equivalent to testing shipped Safari with VoiceOver.

The consumer check installs all local registry items through the shadcn CLI using custom `~/ui` and `~/lib/utils` aliases and then runs TypeScript. This verifies the working tree, not the currently published GitHub revision. Upstream font/icon licenses do not establish a license for this repository; the owner still needs to select repository reuse terms.
