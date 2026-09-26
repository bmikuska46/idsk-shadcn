# Independent IDSK implementation audit

26 September 2026. This is a separate assessment of the current working tree, including its uncommitted components. It does not replace or extend the report in `../2026-09-26/`. Findings and priorities below were written from source inspection, newly downloaded references, and a new browser fixture. The earlier report was already known to the reviewer, so this is not a blind second review. Its results and screenshots were not reused as evidence here.

The library implements all 22 numbered Figma families and represents the 16 families in the website catalogue. Coverage is broad, but form integrity and accessibility defects prevent a full IDSK conformance claim. Build and registry distribution checks pass. The most serious newly tested case allows a controlled file picker to submit a file its parent rejected.

There are **22 findings: 6 P1, 15 P2, and 1 P3**. P1 should be resolved before release; P2 is a functional, accessibility, documentation, or reference-design gap; P3 is lower-impact visual drift. These are project priorities, not security advisory severity ratings.

## Scope and evidence

- All 25 UI files, shared utility and CSS, demo, app routes, registry, README, package files, Dockerfile and publishing workflow were inspected. [Source manifest](evidence/source-manifest.json) pins the reviewed files and base commit.
- The [IDSK component catalogue](https://idsk.gov.sk/komponenty) and all 16 linked component pages were fetched afresh. [Website source list](evidence/website-sources.json).
- The supplied PAT retrieved the full [Figma file](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=2910-6754) through Figma REST. Version `2403288842141627689`, modified `2026-09-25T21:31:51Z`. The credential is not stored in these artifacts.
- All 22 numbered pages were inventoried, excluding the archive. Eight selected nodes were exported and their resolved text styles and dimensions extracted. [Inventory](evidence/figma-inventory.json), [measurements](evidence/figma-measurements.json). Presence in the inventory does not mean every permutation passed visual inspection.
- Fresh Chromium 153 tests covered widths 320, 390, 729, 730, 768, 1024 and 1440. Axe ran on the demo at 390 and 1440. A new fixture exercised controlled uploads, reset, required validation, disabled actions, error focus, mobile navigation and tooltip focus/Escape. [Browser results](evidence/browser-results.json), [fixture](evidence/fixture.tsx.txt), [probe script](evidence/browser-probe.cjs).
- No-JavaScript interaction was tested separately. [Results](evidence/no-js-interaction.json).
- A new consumer installed all 27 generated registry items through a local HTTP mirror with normal dependency resolution. Its aliases were `~/ui` and `~/lib/utils`; it type-checked successfully. This tests the current working-tree registry, not the published GitHub revision. [Install output](evidence/consumer-install.txt).

No production implementation was changed. Safari, Firefox, VoiceOver, NVDA, real touch devices, every Figma variant, production infrastructure and Docker image execution were not tested. This is not a WCAG certification or penetration test. Screen-reader findings concern exposed semantics, not observed speech output.

## Verification results

| Check | Fresh result |
| --- | --- |
| Lint | Pass, 0 errors and 3 native-image warnings |
| TypeScript | Pass |
| Production build | Pass using Next.js 16.3.0 and Turbopack |
| Registry validation/build | Pass, 27 items |
| Consumer install/type check | Pass, 25 UI files plus utility and stylesheet |
| Demo horizontal overflow | None at all seven widths |
| Demo runtime exceptions | None in tested paths |
| Axe at 1440 | Contrast failure on 9 nodes |
| Axe at 390 | Contrast on 9 nodes; keyboard scrolling on 2 code blocks |
| Native form and controlled upload checks | Failures detailed below |
| Production dependency audit | 7 advisories: 2 critical, 3 high, 1 moderate, 1 low |

[Check metadata](evidence/checks.json), [lint output](evidence/lint.txt), [build output](evidence/build.txt), [registry validation](evidence/registry-validate.txt), [registry build](evidence/registry-build.txt), [dependency results](evidence/dependencies.json).

## Findings

### A01. P1: controlled uploads submit rejected files

Source: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 153-186 and 207-210. Evidence: `rejectedControlledUpload` in [browser results](evidence/browser-results.json).

Render `FileUpload` with `files={[]}` and an `onFilesChange` handler that declines the new selection. After selecting `test.pdf`, the list stays empty, but the native input and `FormData` contain that file. `appendFiles` synchronizes its proposed list into the input before the parent accepts it. The same unconditional synchronization pattern is present during removal.

Make the controlled prop authoritative for both display and native submission. After a parent rejects a file, the native file list and submitted payload must also exclude it. Test accepted, rejected and asynchronously accepted changes.

### A02. P1: required uploads allow empty submission in compact mode and after reset

Source: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 147-165 and 389. Evidence: `initial` and `uploadAfterReset` in [browser results](evidence/browser-results.json).

`dragAndDrop={false}` forces the native required attribute off. An empty compact upload therefore passes `checkValidity()`. There is a second path: select a file in a required drop-zone upload, then reset the form. The native input becomes empty while the displayed list retains one file. Required remains false and the form is valid.

Keep required semantics independent of presentation mode. Handle native form reset so the displayed list, native payload and validity agree. Both cases must reject an empty submission and direct the user to a visible control.

### A03. P1: disabled slotted buttons still run child handlers

Source: [button.tsx](../../../src/components/ui/button.tsx), lines 134-156. Evidence: `disabledActionCalls` in [browser results](evidence/browser-results.json).

A `Button asChild aria-disabled="true"` containing an anchor with an `onClick` callback still executes that callback when activated with Enter. The counter increased to one. Radix Slot invokes the child handler before the wrapper's prevention code. Pointer-event styling does not prevent keyboard activation.

Block activation before either callback runs. Verify keyboard and pointer behavior for both wrapper and child callbacks, and define how the native `disabled` prop behaves with `asChild`.

### A04. P1: the fixed cookie notice clips on short screens

Source: [cookie-bar.tsx](../../../src/components/ui/cookie-bar.tsx), lines 60-72. Evidence: [320px screenshot](evidence/cookie-320.png), `cookie` in [browser results](evidence/browser-results.json).

At 320x568 the default notice is 633px tall, starts at y=-65, and has visible overflow rather than internal scrolling. The top content cannot be reached by scrolling the document.

The [Figma mobile notice](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=6601-7890) is itself 633px tall. Matching that design height does not solve runtime viewport constraints. Limit the fixed region to the available viewport and make all its content reachable, including at zoom and with long translations.

### A05. P1: mobile profile links lose their accessible name

Source: [header.tsx](../../../src/components/ui/header.tsx), lines 153-180. Evidence: `mobileProfile` in [browser results](evidence/browser-results.json).

Below 730px, the name container is hidden. Initials are `aria-hidden` and avatar images have empty alternative text. When the user has an `href`, the remaining link has no name in Chromium's accessibility snapshot.

Give the link a persistent accessible name using the person's name and profile purpose. Check both image and initials variants at mobile widths.

### A06. P1: the production lockfile contains unresolved security advisories

Source: [package.json](../../../package.json), [lockfile](../../../pnpm-lock.yaml). Evidence: [fresh audit output](evidence/dependencies.json).

Seven advisories are reported. Next.js is locked at 16.3.0; the two critical advisories identify 16.3.3 as patched. One concerns [Windows-hosted servers](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), while this Dockerfile uses Linux Alpine. The other concerns [AVIF image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4); an exploitable input path was not established here. The remaining entries affect sharp, Browserslist, baseline-browser-mapping and Babel.

Update to patched compatible versions and refresh the lockfile. Rerun build and advisory checks, recording deployment applicability. Do not describe seven advisory entries as seven proven remotely exploitable vulnerabilities.

### A07. P2: a disabled first checkbox defeats required-group validation

Source: [checkbox-group.tsx](../../../src/components/ui/checkbox-group.tsx), lines 108-111. Evidence: `initial.checkboxValid` in [browser results](evidence/browser-results.json).

Only item zero gets the group-required constraint while no values are selected. When it is disabled, the browser excludes it from validation. An enabled second option remains optional and the empty form is valid.

Attach the group constraint to an enabled control or provide an independent group validator. Disabled or unavailable values should not silently satisfy the requirement.

### A08. P2: disabled uploads still allow removal

Source: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 207-213 and 310-324. Evidence: `disabledFileRemoved` in [browser results](evidence/browser-results.json).

The selection input is disabled but removal buttons are active. Clicking remove deletes a preloaded file. Apply the disabled contract to mutation controls and their handlers, or expose a separate read-only mode with explicit behavior.

### A09. P2: selecting a file is announced as a completed upload

Source: [file-upload.tsx](../../../src/components/ui/file-upload.tsx), lines 172-181 and 249-256. Evidence: `uploadClaim` in [browser results](evidence/browser-results.json).

New selections default to `status: 'success'`, producing text that says the file was successfully uploaded before any upload occurs. A programmatically selected 16MiB `.exe` is also shown as successful despite the advertised formats and 15MB limit. The `accept` attribute is a picker hint; `maxSizeLabel` is only display text. Dropped files have no matching validation path.

Separate selected and uploaded states. Expose or implement client validation and make completion depend on the consumer's upload result. Document the consumer's server-validation responsibility. The defect is the misleading status and apparent validation contract, not the absence of a backend in a UI library. [IDSK upload guidance](https://idsk.gov.sk/komponenty/nahratie-suboru).

### A10. P2: textarea counters retain the pre-reset length

Source: [textarea.tsx](../../../src/components/ui/textarea.tsx), lines 68-82. Evidence: `textAfterReset` in [browser results](evidence/browser-results.json).

After editing and resetting a textarea with `defaultValue="seed"`, its value is four characters but its counter reads `18/30`. The native reset does not update React's counter state. Synchronize reset handling and verify both visual and live-region counts.

### A11. P2: Select discards explicit invalid-state attributes

Source: [select.tsx](../../../src/components/ui/select.tsx), lines 115-121. Evidence: `initial.selectInvalidOverride` in [browser results](evidence/browser-results.json).

`<Select aria-invalid="true" ... />` renders without `aria-invalid` when `error` is absent. The component spreads trigger props and then replaces the supplied value with `undefined`. This breaks consumers that provide an external error message or derive invalid state separately.

Preserve the caller's invalid-state value unless the component's own error requires `true`. Input and Textarea already follow that pattern. Audit other overwritten ARIA attributes while fixing it.

### A12. P2: radio error styling omits invalid semantics

Source: [radio-group.tsx](../../../src/components/ui/radio-group.tsx), lines 72-79 and 125-135. Evidence: `initial.radioInvalid` in [browser results](evidence/browser-results.json).

The `error` prop draws an error border and message, but neither the radio input nor group is marked invalid. The error description is associated with the group, which is useful but does not expose its invalid state. Add invalid semantics consistent with [IDSK radio guidance](https://idsk.gov.sk/komponenty/prepinacie-pole).

### A13. P2: error-summary links do not focus radio groups

Source: [error-summary.tsx](../../../src/components/ui/error-summary.tsx), lines 26-46 and 69-96. Evidence: `summaryFocus` in [browser results](evidence/browser-results.json).

A summary link to the public radio-group ID calls `focus()` on a non-focusable fieldset. Focus stays on the summary anchor. Resolve group targets to the appropriate enabled form control.

Also choose one summary announcement strategy. With `focusOnMount`, the summary still has `role="alert"`; [IDSK guidance](https://idsk.gov.sk/komponenty/prehlad-s-chybovymi-hlaseniami) explicitly calls for focus or alert rather than both. Verify focus directly and then test speech output with assistive technology.

### A14. P2: three components lose required no-JavaScript behavior

Sources: [accordion.tsx](../../../src/components/ui/accordion.tsx), [select.tsx](../../../src/components/ui/select.tsx), [checkbox-group.tsx](../../../src/components/ui/checkbox-group.tsx). Evidence: `noJavaScript` in [browser results](evidence/browser-results.json) and [interaction results](evidence/no-js-interaction.json).

With scripts disabled, closed Accordion content is absent; clicking the Select trigger opens nothing; clicking the enabled Checkbox trigger leaves it unchecked. The native checkbox inputs are transparent, reject pointer interaction and have `tabIndex=-1`. Native selects occupy a visually hidden 1px box.

The official [Accordion](https://idsk.gov.sk/komponenty/akordeon), [Select](https://idsk.gov.sk/komponenty/rozbalovacie-pole), and [Checkbox](https://idsk.gov.sk/komponenty/zaciarkavacie-pole) pages describe no-JavaScript availability. Provide native controls or server-rendered fallbacks that remain usable until enhancement. This is a reference requirement, not a claim that all JavaScript-dependent controls violate WCAG.

### A15. P2: feedback confirmation lacks the prescribed status announcement

Source: [feedback-bar.tsx](../../../src/components/ui/feedback-bar.tsx), lines 90-145. Source-confirmed.

Confirmation moves focus, but there is no persistent, initially empty polite live region as prescribed by [IDSK feedback guidance](https://idsk.gov.sk/komponenty/lista-spatnej-vazby). Add a coordinated status announcement and verify it does not repeat the focus announcement.

The callbacks also provide no pending/failure state and confirmation appears immediately. Document this integration limit or add a consumer-controlled submission lifecycle before using it with asynchronous requests.

### A16. P2: muted text fails contrast on tinted backgrounds

Sources: [home-demo.tsx](../../../src/components/home-demo.tsx), foundations panel; [government-logo.tsx](../../../src/components/ui/government-logo.tsx), tagline. Evidence: axe nodes in [browser results](evidence/browser-results.json).

The tested combinations include `#757575` on `#fafafa` at 4.41:1 and on `#f5f5f5` at 4.22:1. Both are below 4.5:1 for normal-sized text. Nine nodes fail at each tested viewport. Use a darker token on those backgrounds and check the actual foreground/background pair. The same muted token on white is not the reported failure. [WCAG contrast explanation](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### A17. P2: mobile breadcrumb collapse can remove every item

Source: [breadcrumbs.tsx](../../../src/components/ui/breadcrumbs.tsx), lines 49-65. Evidence: `mobileBreadcrumbVisible` and `mobileBreadcrumbReplacementCount` in [browser results](evidence/browser-results.json).

With one item and `collapseOnMobile`, the full list is hidden and no parent link exists. The mobile result is an empty navigation region. Hide the list only when a replacement parent link can actually render. Retain the available breadcrumb otherwise.

### A18. P2: Select is four pixels taller than the design

Source: [select.tsx](../../../src/components/ui/select.tsx), lines 123-130. Evidence: `initial.fields` in [browser results](evidence/browser-results.json), [Figma measurements](evidence/figma-measurements.json).

The two trigger sizes render at 52px and 44px. The corresponding [48px reference](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=6601-15355) and [40px reference](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=6601-15407) are smaller. Text line height, padding and borders exceed the minimum height.

Correct the box sizing and verify actual bounding boxes beside Input. Figma's internal size names differ from the public prop names, so compare measured geometry rather than labels alone.

### A19. P3: text spacing and medium field support text drift

Sources: [input.tsx](../../../src/components/ui/input.tsx), [field.tsx](../../../src/components/ui/field.tsx), [index.css](../../../src/index.css), typography rules. Evidence: [Figma measurements](evidence/figma-measurements.json) and browser field styles.

The sampled Figma field text has 0.5px tracking, while local Input and Select use `normal`. Shared CSS uses `0.025em`, which changes tracking with font size. The [medium Input reference](https://www.figma.com/design/P2AW3NcCg7dHXlxwQ7EG10/?node-id=5927-6401) uses 16/24 supporting text and a 19px required marker; local FieldHint/FieldError default to 19/28 and RequiredMark is fixed at 24px.

Model size-specific text tokens and pass field size through supporting elements. Recheck wrapping as well as computed typography after adjustment.

### A20. P2: header identity and glyphs cannot reproduce the reference

Sources: [header.tsx](../../../src/components/ui/header.tsx), line 413; [government-logo.tsx](../../../src/components/ui/government-logo.tsx). Evidence: [Figma header](evidence/figma-5617-2039.png), [local header](evidence/header-1440.png).

The header hardcodes a text-only GovernmentLogo and offers no identity-graphic slot. Consumers cannot supply the approved identity shown in the reference without editing component source. Footer already exposes a logo slot. Add the same capability to Header while retaining a clearly unofficial demo identity.

The reference also uses filled and Material-style glyphs where the implementation uses Lucide outlines. Review and document an icon mapping. Do not count different demo text, absent optional actions or chosen login-button variants as intrinsic layout defects. Search suggestions are another scope limit: SearchInput exposes submission but no suggestion-list API.

### A21. P2: demo installation instructions point to a placeholder

Source: [home-demo.tsx](../../../src/components/home-demo.tsx), lines 165-183.

The demo tells users to install from `https://example.com/r/...`. Following those instructions cannot install this library. README documents the GitHub registry address instead.

Replace the demo instructions with the repository's actual registry commands, including styles and font setup. The current [shadcn GitHub registry format](https://ui.shadcn.com/docs/registry/github) supports `owner/repo/item` and does not require generated HTTP routes in the app.

### A22. P2: mobile installation snippets cannot be keyboard-scrolled

Source: [home-demo.tsx](../../../src/components/home-demo.tsx), lines 165 and 179. Evidence: mobile `scrollable-region-focusable` nodes in [browser results](evidence/browser-results.json).

The code blocks scroll horizontally at mobile widths but have no focus target. Make each scrolling region keyboard-accessible with an appropriate label, or present the complete commands without requiring inaccessible scrolling. The document itself did not overflow in this test.

## Component coverage

Presence is separate from conformance. The inventory includes internal master components and documentation components; their raw counts should not be presented as user-facing variant coverage.

| Figma family | Implementation | Assessment from this pass |
| --- | --- | --- |
| 01 Header | Header, GovernmentLogo, SearchInput | Website/service and menu APIs present; A05 and A20 |
| 02 Footer | Footer | Columns, operator and custom logo present; default caption affected by A16 |
| 03 Button | Button | Variants, sizes and tones present; A03 |
| 04 Cookies bar | CookieBar | Desktop/mobile composition present; A04 |
| 05 Text input | Input, Field | Native control, hints and errors present; A19 |
| 06 Text area | Textarea | Counter and native constraints present; A10 |
| 07 Select | Select | Selection, disabled options and form API present; A11, A14 and A18 |
| 08 Checkbox | CheckboxGroup | Group and mixed state present; A07 and A14 |
| 09 Radio | IdskRadioGroup | Native selection and group semantics present; A12 and A13 |
| 10 Error summary | ErrorSummary | Links and focus option present; A13 |
| 11 File upload | FileUpload | Compact/drop-zone and status rows present; A01, A02, A08 and A09 |
| 12 Accordion | IdskAccordion | Multiple panels and toggle-all present; A14 |
| 13 Breadcrumbs | Breadcrumbs | Ordered navigation and parent collapse present; A17 |
| 14 Notification banner | InformationBar | Four semantic variants and dynamic/static roles present; icon caveat in A20 |
| 15 Feedback bar | FeedbackBar | Answer, report and confirmation states present; A15 |
| 16 Announcement bar | AnnouncementBar | Four statuses and dismissal API present; icon caveat in A20 |
| 17 Card | Card | Orientations, metadata, image and action composition present; global typography caveat |
| 18 Signpost | Signpost | Horizontal family present; vertical/text are local extensions |
| 19 Data panel | DataPanel | Label/value list and responsive action placement present; global typography caveat |
| 20 Tooltip | Tooltip, InfoTooltip | Focus opens and Escape closes in fresh tests; other interaction modes not exhaustively tested |
| 21 Divider | Divider | Rule and decorative semantics present; no separate defect established |
| 22 Mandatory field indication | MandatoryFieldLegend, Field | Legend and marker choices present; size caveat in A19 |

## Integration and release observations

These are follow-up decisions, not additional counted defects:

- Styles modifies global element rules, root color names and Tailwind's `sm` breakpoint to 730px. Document the effect on an existing shadcn application. Successful installation alone does not prove visual isolation.
- The registry installs and rewrites imports correctly into a consumer with custom aliases. Font and stylesheet imports remain explicit consumer setup, as documented. The published GitHub revision was not installed in this pass.
- CI builds and publishes a container but does not run the browser fixture, accessibility checks or registry-consumer tests. There is no checked-in regression test suite for the reproduced failures.
- README describes open-source reuse but no license file or package license field is present. Establish the repository license and upstream attribution before presenting reuse terms as settled. This report makes no legal determination.
- Footer uses four desktop tracks regardless of supplied column count. Card clamps titles and descriptions even when not linked. Test these compositions with real consumer content before broadening layout claims.
- The demo lacks a skip-to-main link. Add a stable main target and bypass control as an integration improvement.
- Existing authored files contain long-dash characters contrary to the repository writing rule. This pass did not rewrite them.

## Recommended order and acceptance criteria

1. Repair upload state ownership and required/reset behavior. Assert that displayed files, native FileList and FormData agree after acceptance, rejection, removal and reset.
2. Fix disabled activation, mobile profile naming and short-viewport cookie access. Test with keyboard and at 320px width.
3. Patch dependencies and rerun the production build, advisory scan and container smoke test.
4. Correct invalid-state semantics, summary focus, no-JavaScript fallbacks, contrast and keyboard scrolling. Preserve the new reproductions as regression tests.
5. Align Select geometry, field text tokens, header identity and icons against the pinned Figma nodes. Capture equal-content comparisons rather than interpreting demo-content differences as defects.
6. Add clean-consumer, interaction and accessibility checks to CI. Complete Safari/Firefox and screen-reader verification before claiming full conformance.

## Reproducing the browser evidence

Create an isolated copy of the source, add [fixture.tsx.txt](evidence/fixture.tsx.txt) as `src/app/probe/page.tsx`, and run Next on port 3158. The fixture deliberately exercises broken states; do not publish it. Install Playwright and axe-core in a temporary tooling directory and install Chromium. Run [browser-probe.cjs](evidence/browser-probe.cjs) with that directory's node_modules in `NODE_PATH`. `AUDIT_URL` overrides the default local URL. Results and captures are written beside the script.

The audit used webpack for the temporary fixture to support an external node_modules symlink. The actual repository production build used Turbopack. Temporary files are under `/tmp/idsk-independent`; the report and its evidence are self-contained in this folder.
