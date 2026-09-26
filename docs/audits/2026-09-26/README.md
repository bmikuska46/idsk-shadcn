# IDSK shadcn project audit

Audited 26 September 2026. Scope: the current working tree, including modified and untracked components, based on commit `c8b2b0837faa457559258c6f036eaae5abfa5950`. No implementation fixes were made. Source fingerprints are in [source-sha256.json](evidence/source-sha256.json).

The project covers all 22 numbered Figma component families and all 16 families on the IDSK website. It is a usable starting point, but it should not yet be described as fully conformant or production ready. The main problems are form behavior, accessibility in secondary states, incomplete design details, and outdated dependencies. The registry is functional.

There are 20 findings below: 5 P1, 14 P2, and 1 P3. P1 means address before a production release. P2 means a reproducible defect or documented requirement gap. P3 means lower-impact visual drift. Dependency advisory severity is reported separately from project priority and does not prove exploitability.

## References and method

- [IDSK component catalogue](https://idsk.gov.sk/komponenty), including all 16 linked component pages, accessed on the audit date.
- [IDSK 3.1.0 Figma file](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=2910-6754). The supplied PAT successfully retrieved the file through Figma REST. File version `2403288842141627689`, last modified `2026-09-25T21:31:51Z`.
- All 22 numbered Figma pages and their component sets were inventoried. Active component variants, visible text styles, selected dimensions, palette values, and five exported component images were inspected. The archive page was excluded from the required component count.
- All 25 UI source files, global styles, demo, app routes, registry, package configuration, Docker configuration, and deployment workflow were reviewed.
- Chromium rendered the app at widths 320, 390, 729, 730, 768, 1024, and 1440. Automated axe checks ran at 390 and 1440. Separate fixtures tested states the demo does not exercise.
- Keyboard checks covered Select, Accordion, disabled link activation, and error-summary navigation. Native form validity, reset, file selection, and disabled removal were checked through real browser DOM behavior.
- A clean temporary consumer installed all 27 generated registry items and type-checked them. This used an aggregate local item containing the generated files and dependencies. A separate normal Header + Styles dependency-resolution preview and a published GitHub Button lookup succeeded.

This is a source and browser audit, not an exhaustive pixel comparison of every Figma permutation or a WCAG certification. Safari, Firefox, VoiceOver, NVDA, real touch hardware, deployment infrastructure, and a full Docker image build were not tested. Screen-reader claims below concern markup and accessible names, not observed speech output. Figma Variables API was not needed; values came from resolved node properties and styles. The PAT was not saved in the repository or report.

## Verification results

| Check | Result |
| --- | --- |
| `pnpm lint` | Pass, 0 errors and 3 `no-img-element` warnings |
| `pnpm exec tsc --noEmit --incremental false` | Pass |
| `pnpm build` | Pass on Next.js 16.3.0; home, robots, sitemap, and OG route generated |
| `shadcn registry validate registry.json` | Pass, 27 items |
| `shadcn build registry.json` | Pass, 27 items |
| Registry import/dependency graph | All local file imports and external dependencies accounted for |
| Clean consumer install and TypeScript | Pass, all 27 files installed |
| Published GitHub Button lookup | Pass |
| Page-level horizontal overflow | None at the seven tested widths; code blocks scroll internally |
| Demo browser exceptions | None during the responsive sweep |
| axe, desktop | 1 rule failure, 9 affected nodes: text contrast |
| axe, mobile | 2 rule failures, 11 affected nodes: text contrast and scrollable code regions |
| Mobile profile fixture | Additional `link-name` failure |
| Native required validation | Fail for compact upload and a required checkbox group with a disabled first option |
| JavaScript disabled | Accordion content unavailable |
| Production dependency audit | 7 advisories: 2 critical, 3 high, 1 moderate, 1 low |

Raw results: [browser checks](evidence/browser-results.json), [behavior fixtures](evidence/behaviors.json), [follow-up checks](evidence/followup.json), [dependency audit](evidence/dependency-audit.json), [build log](evidence/build.log), [consumer install](evidence/consumer-install.log).

An initial concern about importing Input directly from a Next.js Server Component was tested and rejected: the route returned HTTP 200 and rendered the input. Missing `use client` on Input or DataPanel is not reported as a defect.

The `<img>` lint warnings are not inherently component-library defects. Framework-neutral components can intentionally use native images. Metadata, Slovak document language, robots, sitemap, escaped JSON-LD, and standalone Docker asset copying are present. No application authentication, database, or upload backend exists to audit.

## Component coverage

“Present” means a component exists and was reviewed. It does not mean every variant has passed conformance testing. Global typography drift in F13 affects several otherwise complete families.

| Figma family | Local implementation | Assessment |
| --- | --- | --- |
| 01 Header | `header.tsx`, `government-logo.tsx`, `search-input.tsx` | Website/service, signed-in user, language, menus, notification/mail actions present. Mobile profile name fails, F05. Identity graphic and search suggestions incomplete, F14. |
| 02 Footer | `footer.tsx` | Columns, supporting links, operator, custom logo and external-link announcement present. Default logo caption fails contrast on footer surface, F17. Column count is fixed at four on large screens. |
| 03 Button | `button.tsx` | Primary, secondary, tertiary, inline tertiary, color schemes and 49/41/35px sizes present. Slotted disabled behavior fails, F02. |
| 04 Cookies bar | `cookie-bar.tsx` | Desktop/mobile compositions and three action hooks present. Short-screen clipping, F06. Consent persistence is the consumer's responsibility. |
| 05 Text input | `input.tsx`, `field.tsx` | 48/40px inputs, required/optional markers, hints, errors and tooltip slot present. Medium support text sizing and tracking differ, F13. |
| 06 Text area | `textarea.tsx` | Native textarea, limit, error, disabled and counter present. Reset desynchronizes counter, F11. |
| 07 Select | `select.tsx` | Radix keyboard selection, placeholder, disabled, error and form name present. Actual heights 52/44px, F12. |
| 08 Checkbox | `checkbox-group.tsx` | 40/24px, mixed state, errors and controlled/uncontrolled APIs present. Group required logic fails, F04. |
| 09 Radio | `radio-group.tsx` | Native named radio group, 40/24px, hints and required present. Error state lacks `aria-invalid`, F08. |
| 10 Error summary | `error-summary.tsx` | Summary links and optional focus present. Group focus and alert/focus semantics need correction, F07. |
| 11 File upload | `file-upload.tsx` | Drop zone, compact mode, file list, progress/error/success rows present. F03, F09 and F10 affect behavior. |
| 12 Accordion | `accordion.tsx` | Multiple panels, descriptions, toggle-all and heading levels present. Keyboard opening passed. No-JS requirement fails, F15. |
| 13 Breadcrumbs | `breadcrumbs.tsx` | Named ordered navigation, current page, home icon and optional parent collapse present. One-item mobile edge case fails, F20. |
| 14 Notification banner | `information-bar.tsx` | All four statuses and desktop/mobile composition present; static/dynamic semantics supported. No separate functional defect found in sampled states. |
| 15 Feedback bar | `feedback-bar.tsx` | Yes/no, follow-up, report form and confirmation present. Missing prescribed live region, F16. Tablet layout is cramped. |
| 16 Announcement bar | `announcement-bar.tsx` | Four statuses, link, dismissal and mobile/desktop layouts present. No separate functional defect found in sampled states. |
| 17 Card | `card.tsx` | Horizontal/vertical, image, metadata and actions present. Types prevent linked tags/actions inside linked cards. Icon/typography caveats apply where used. |
| 18 Signpost | `signpost.tsx` | Horizontal reference represented. Text and vertical variants are local extensions, not separate families in the supplied Figma page. |
| 19 Data panel | `data-panel.tsx` | Label/value semantics, responsive rows and action relocation present. No separate functional defect found in sampled states. |
| 20 Tooltip | `tooltip.tsx` | Four sides, Radix focus/hover support and explicit tap/click handling present. Material icon differs, F14. Manual assistive-technology verification remains. |
| 21 Divider | `divider.tsx` | 2px rule, rounded ends and decorative option present. No separate defect found. |
| 22 Mandatory field indication | `mandatory-field-legend.tsx`, `field.tsx` | Page legend plus asterisk/text/optional markers represented across two files. Size-specific marker typography is incomplete, F13. |

[Figma inventory with node IDs](evidence/figma-inventory.json) and [visible variant measurements](evidence/figma-visible.json) provide the comparison baseline. The 27 registry items comprise 25 UI files, the utility module, and styles. Extra registry entries are not evidence of extra required Figma families.

## Prioritized findings

### F01. P1: refresh the locked dependency tree before release

Evidence: [pnpm-lock.yaml](../../../pnpm-lock.yaml), lines 2189 and 2422; [package.json](../../../package.json); [audit output](evidence/dependency-audit.json).

The lockfile fixes Next.js at 16.3.0 and sharp at 0.35.3. The advisory service reports seven production-dependency advisories. The two critical Next.js advisories are patched in 16.3.3:

- [Windows filesystem RCE](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36). The checked-in Dockerfile uses Linux Alpine, so that deployment does not meet the Windows condition.
- [AVIF image optimization RCE](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4). The app currently renders ordinary image tags and has no configured remote image origins or upload endpoint. An exploitable AVIF input path was not demonstrated.

[sharp's advisory](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c) identifies untrusted image processing and additional runtime conditions, with 0.35.4 as the patched release. The other entries affect Browserslist, baseline-browser-mapping and Babel. These are dependency findings, not evidence of seven remotely exploitable application vulnerabilities.

Update Next.js to a patched compatible release, refresh transitive packages and the lockfile, then rerun the build and production audit. A caret range in package.json does not update a frozen-lockfile Docker build.

### F02. P1: an aria-disabled slotted button still executes the child's action

Evidence: [button.tsx](../../../src/components/ui/button.tsx), lines 134-156; `disabledLinkClicks` in [behavior results](evidence/behaviors.json).

Reproduction: render `<Button asChild aria-disabled="true"><a href="#activated" onClick={increment}>Disabled link</a></Button>`, focus it and press Enter. The callback runs once. Radix Slot composes the child's handler before the wrapper guard. The wrapper prevents navigation too late to stop that side effect. Pointer-event CSS does not block keyboard activation.

Intercept activation before invoking either handler for the disabled state. Verify both child and wrapper callbacks remain untouched under Enter and pointer activation. Also define the `disabled` contract for `asChild` explicitly.

### F03. P1: compact required file uploads allow an empty submission

Evidence: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), line 389.

`required={dragAndDrop && required && displayedFiles.length === 0}` unconditionally disables required validation when `dragAndDrop={false}`. A form containing `<FileUpload required dragAndDrop={false} />` reports `checkValidity() === true` with no file selected, even though the field visibly claims to be mandatory.

Preserve the required constraint in compact mode and route invalid focus to its visible selection control. Verify empty submission is rejected and a valid selection clears the error.

### F04. P2: a disabled first checkbox defeats group-required validation

Evidence: [checkbox-group.tsx](../../../src/components/ui/checkbox-group.tsx), lines 108-111.

Required validation is attached only to item index zero while the group is empty. If that item is disabled, the browser excludes it from constraint validation. The enabled second item is optional, and the empty form is valid. This was reproduced with a disabled first option and an enabled second option.

Apply group validation to an enabled control, or implement a group constraint independently of array order. Check that only enabled, submittable selections satisfy the requirement.

### F05. P1: the mobile profile link has no accessible name

Evidence: [header.tsx](../../../src/components/ui/header.tsx), lines 153-180; [mobile accessibility result](evidence/behaviors.json).

Below 730px, the name/caption container is `display:none`. The initials are `aria-hidden`, and the image alternative is empty. When `user.href` is supplied, the remaining link has no accessible name. Chromium's accessibility snapshot contains an unnamed link, and axe reports `link-name`.

Give the link a persistent name such as `Profil: Jana Novakova`, or retain the name as visually hidden text on mobile. Verify image-avatar and initials-avatar variants.

### F06. P1: the fixed cookie bar clips content above short viewports

Evidence: [cookie-bar.tsx](../../../src/components/ui/cookie-bar.tsx), lines 60-72; [320px screenshot](evidence/cookie-320.png); [measurements](evidence/followup.json).

At 320x568, the default bar is 633px tall and starts at y=-65. At 844x390, it is 435px tall and also starts at y=-65. The fixed container has no maximum viewport height or internal scrolling. Its initial content cannot be brought into view by scrolling the document.

Cap the fixed region against the dynamic viewport, provide internal vertical scrolling, and verify keyboard focus remains visible with zoom and long translated text. The expected acceptance condition is that every heading, link and action can be reached and read on a short viewport.

### F07. P2: error-summary group links do not focus a usable control

Evidence: [error-summary.tsx](../../../src/components/ui/error-summary.tsx), lines 26-46 and 69-96.

A summary link to the public `id` of `IdskRadioGroup` scrolls but calls `focus()` on a non-focusable fieldset. Focus remains on the summary link. The radio group's option IDs are generated internally, so passing the group ID is a natural integration path.

Resolve a group target to its first enabled form control and make explicit IDs available where needed. Separately, `focusOnMount` leaves `role="alert"` active on the same summary. [IDSK error-summary guidance](https://idsk.gov.sk/komponenty/prehlad-s-chybovymi-hlaseniami) explicitly chooses either focus or alert to avoid duplicate announcements. Use one announcement strategy and test actual focus after activation.

### F08. P2: radio errors are visual but not marked invalid

Evidence: [radio-group.tsx](../../../src/components/ui/radio-group.tsx), lines 72-79 and 125-135.

Supplying `error` changes the border and renders a message, but neither the fieldset nor its inputs receives `aria-invalid`. The browser fixture confirms both attributes are absent. The group description does connect the error text, which is good, but the invalid state itself is missing.

Apply invalid semantics when an error exists, retaining the description association. This is an explicit requirement of the [IDSK radio guidance](https://idsk.gov.sk/komponenty/prepinacie-pole).

### F09. P2: file selection is reported as a successful upload without validation

Evidence: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 172-181 and 249-256; [file result](evidence/followup.json).

Every selected file immediately gets `status: 'success'`. The rendered assistive text says it was successfully uploaded although no upload has occurred. A 16MiB `.exe` file was accepted into FormData and shown as successful while the UI advertised JPG/PNG/DOC/DOCX/PDF and a 15MB limit. `maxSizeLabel` is only text, and drag/drop does not apply the picker accept filter.

Separate selected, uploading and uploaded states. Provide actual client validation or document and expose the consumer validation contract, with success controlled by the upload result. Server-side validation remains the consuming application's responsibility. A reusable UI component need not implement a backend, but its default status must describe what actually happened. [IDSK upload guidance](https://idsk.gov.sk/komponenty/nahratie-suboru) requires an accurate state.

### F10. P2: disabled uploads still allow file removal

Evidence: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 207-213 and 310-324.

`disabled` prevents new selection, but removal buttons remain enabled and `removeFile` has no disabled guard. Clicking remove on a disabled upload with a preloaded file removes the file and triggers callbacks.

Propagate disabled semantics to removal and block the mutation. If read-only removal is intentional, model it separately from disabling the entire component.

### F11. P2: textarea counters do not follow native form reset

Evidence: [textarea.tsx](../../../src/components/ui/textarea.tsx), lines 68-82.

An uncontrolled textarea with `defaultValue="original"` resets its DOM value correctly, but `internalValue` changes only on input events. After entering 16 characters and resetting, the input holds eight characters while the counter still displays `16/30`. The near-limit live announcement can also be stale.

Synchronize the counter with native form resets or adopt an internal value model that handles them. The checkbox reset was also tested and passed; this finding is specific to the textarea counter.

### F12. P2: Select renders four pixels taller than its reference sizes

Evidence: [select.tsx](../../../src/components/ui/select.tsx), lines 123-130; [browser measurements](evidence/behaviors.json).

Figma nodes [6601:15355](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=6601-15355) and [6601:15407](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=6601-15407) measure 48px and 40px. Local Select renders 52px and 44px. Text line height, vertical padding and borders exceed the minimum height. Input renders the correct 48px and 40px alongside it.

Adjust padding or sizing to meet the reference while preserving text and focus visibility. Compare actual bounding boxes for both sizes, rather than trusting the `min-h` class names.

### F13. P3: typography tracking and medium field support text drift from Figma

Evidence: [button.tsx](../../../src/components/ui/button.tsx), line 17; [input.tsx](../../../src/components/ui/input.tsx), lines 110-117; [field.tsx](../../../src/components/ui/field.tsx); [index.css](../../../src/index.css), lines 279-326.

Figma's active Button and field text uses 0.5px letter spacing, while measured Button, Input and Select styles use `normal`. Shared typography uses `0.025em`, which produces 0.4px at 16px and 0.6px at 24px rather than 0.5px. Caption uses 0.4px in Figma but 0.3px locally.

The medium Input label/value uses 16/24, but its hint, description and error retain FieldHint/FieldError's 19/28 defaults. Figma's medium Text field node [5927:6401](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=5927-6401) uses 16/24 support text and a smaller marker. RequiredMark is fixed at 24px.

Use shared text tokens matching active Figma styles, pass field size to supporting primitives, and verify their computed styles. Primary, semantic, neutral and focus colors sampled from the Figma palette match the corresponding CSS hex values; this is a typography issue, not a palette rewrite.

### F14. P2: header identity and iconography are incomplete reproductions

Evidence: [government-logo.tsx](../../../src/components/ui/government-logo.tsx), [header.tsx](../../../src/components/ui/header.tsx), and [Figma Header](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=5617-2039).

GovernmentLogo renders only text. The Figma header includes an identity graphic, and IdskHeader has no logo slot to supply one. Footer does have a custom logo API. Keeping the unofficial demo free of an official emblem is reasonable; preventing consumers from supplying their own approved identity is the library gap.

The designs use Material-style glyphs, including filled notification/mail and other symbols. Many local components substitute Lucide outline glyphs, so shape, fill and optical sizing differ. The header's Figma search field also includes suggestion results, while SearchInput exposes only submission and no suggestion list API.

Add an explicit header identity slot and document which search behavior is supported. Establish a reviewed icon mapping or label the substitutions as intentional deviations. Do not imply official government ownership in the demo.

### F15. P2: accordion content disappears without JavaScript

Evidence: [accordion.tsx](../../../src/components/ui/accordion.tsx), default closed state and Radix Content rendering; [no-JS result](evidence/followup.json).

With JavaScript disabled, the demo's closed accordion text is absent from the DOM and cannot be opened. The [IDSK accordion page](https://idsk.gov.sk/komponenty/akordeon) explicitly requires content to remain available without JavaScript.

Use a progressively enhanced disclosure or a server-visible fallback. This is a specific IDSK conformance gap, not a claim that WCAG prohibits all JavaScript-dependent controls.

### F16. P2: feedback confirmation omits the prescribed live region

Evidence: [feedback-bar.tsx](../../../src/components/ui/feedback-bar.tsx), lines 90-118 and 139-145.

The component moves focus to confirmation, but has no initially empty, persistent polite live region. The [IDSK feedback guidance](https://idsk.gov.sk/komponenty/lista-spatnej-vazby) explicitly prescribes that region. Focus movement is useful, but it is a different mechanism and does not establish conformity with the reference.

Add a dedicated status announcement, coordinating it with focus to avoid duplicate speech. Also document that the callbacks do not provide an async submission lifecycle: currently confirmation appears immediately, including when no callback is supplied. A network-backed consumer needs a way to represent pending and failure before displaying success.

### F17. P2: muted text fails contrast on tinted surfaces

Evidence: [home-demo.tsx](../../../src/components/home-demo.tsx), lines 102-115; [government-logo.tsx](../../../src/components/ui/government-logo.tsx), tagline styling; [axe results](evidence/browser-results.json).

Axe measured `#757575` against `#fafafa` at 4.41:1 in the foundations panel and against `#f5f5f5` at 4.22:1 in the footer logo caption. Both are below the 4.5:1 requirement for this normal-sized text. There were nine affected nodes at each tested axe viewport, including nested code fragments.

Choose a darker text token on those surfaces or a surface with sufficient contrast. The token is usable on white; its application here causes the failure. See [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### F18. P2: the demo installation instructions cannot install this library

Evidence: [home-demo.tsx](../../../src/components/home-demo.tsx), lines 136-181, versus [README.md](../../../README.md).

The UI tells users to configure `https://example.com/r/{name}.json` and then install `@idsk/button`. That address is a placeholder and the project does not publish an `/r` route in its app. The README correctly documents the GitHub registry path, and published Button resolution succeeded.

Replace the demo snippets with this repository's working GitHub commands, including Styles and font setup. The current [shadcn GitHub registry documentation](https://ui.shadcn.com/docs/registry/github) confirms that generated HTTP registry files are not required for GitHub distribution.

### F19. P2: mobile installation code blocks are not keyboard scrollable

Evidence: [home-demo.tsx](../../../src/components/home-demo.tsx), lines 163 and 177; [mobile axe results](evidence/browser-results.json).

Both installation `<pre>` elements scroll horizontally at mobile widths but expose no focus target. Axe reports `scrollable-region-focusable`. The document itself does not overflow, so this is a keyboard access problem inside the code blocks.

Make scrolling regions keyboard-focusable with a suitable label, or use wrapping/copy controls that preserve access to the complete command. The demo also lacks a skip-to-main link and a stable main ID. Add a bypass control as an integration improvement; that absence is not included in the axe counts above.

### F20. P2: mobile breadcrumb collapse can hide the only navigation entirely

Evidence: [breadcrumbs.tsx](../../../src/components/ui/breadcrumbs.tsx), lines 49-65.

When `collapseOnMobile` is true, the ordered list is hidden below 480px regardless of whether a usable parent exists. The replacement link renders only when `items.at(-2)?.href` exists. A one-item breadcrumb or a parent without an href therefore produces an empty navigation landmark on mobile.

Hide the full list only when an actual replacement can render. Otherwise retain the available breadcrumb. This finding is source-confirmed and was not part of the browser fixture results.

## Additional release and design observations

- No repository test suite or test script was found. CI builds and publishes the image on main but does not run lint, consumer installation checks, interaction tests, accessibility checks, or visual regression tests. The defects above demonstrate the missing coverage. Preserve a small regression suite around these actual failures.
- No license file or package license field was found despite open-source claims. Decide and document the repository's license and attribution requirements before inviting downstream reuse. This audit does not make a legal determination about upstream assets.
- The global stylesheet is deliberately invasive: it changes root tokens, element styles and Tailwind's `sm` breakpoint to 730px. Document this integration effect for existing shadcn projects. Styles installation is manual and separately documented, so the absence of Styles from every component's dependency list is not reported as a missing dependency.
- The Figma style page includes alternative Olive, Teal, Violet and Magenta palettes and alpha neutrals that are not exported as CSS tokens. Core component palette coverage is good; a claim of complete style-library coverage would need these additions.
- At 768px, FeedbackBar changes to a row while retaining two 228px buttons. The question wraps into four short lines. This is awkward but does not produce page overflow. See [tablet capture](evidence/feedback-768.png). Use a later layout breakpoint or flexible button widths after comparing intermediate-width designs.
- Footer uses four large-screen grid tracks regardless of column count, while Figma includes multiple column arrangements. Decide whether proportional layouts are required for one, two and three columns and document supported compositions.
- Card title and description are always line-clamped, including non-linked cards. Validate that consuming applications do not lose access to necessary text. No universal failure is claimed because the supplied demo text fits its intended use.
- The static demo CookieBar and FeedbackBar use optional callbacks and can display interactive controls that do not persist anything. Mark these as demos and provide a working integration example for consumers.
- Existing source and docs contain prohibited long-dash characters despite the supplied project writing rule. Treat that as a repository standards cleanup, separate from functional findings.

## Recommended implementation order

1. Refresh the locked dependencies and rerun advisory checks with deployment applicability recorded.
2. Fix disabled activation, required validation, mobile profile naming and cookie overflow. These are release blockers.
3. Fix error-summary focus, radio error semantics, file-state accuracy, disabled removal and textarea reset.
4. Correct the demo installation path and keyboard access, then fix contrast and no-JS accordion behavior.
5. Reconcile Select sizing, text tokens, medium field sizing, header identity, icons and feedback announcements with the pinned Figma version.
6. Add focused regression tests, component-state screenshots at 390/730/1440, and a clean-consumer install check to CI. Finish assistive-technology and Safari/Firefox verification before making a conformance claim.

## Evidence guide

- [Header reference](evidence/figma-5617-2039.png) and [local desktop header](evidence/header-desktop.png). Different demo content is expected; compare identity treatment, glyphs and spacing rather than text lengths.
- [Feedback reference](evidence/figma-4997-11088.png), [local desktop](evidence/feedback-desktop.png), and [768px local layout](evidence/feedback-768.png).
- [Cookie clipping at 320x568](evidence/cookie-320.png).
- [Figma Select](evidence/figma-6601-15355.png), [Button](evidence/figma-7024-19639.png), and [Signpost](evidence/figma-3313-26564.png).
- [Registry validation](evidence/registry-validation.log), [registry build](evidence/registry-build.log), and [consumer resolution preview](evidence/consumer-preview.log).
- The temporary browser fixture project and scripts are under `/tmp/idsk-audit/`. They are disposable. The report and selected evidence are retained in this repository.
