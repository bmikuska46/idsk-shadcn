# IDSK 3.1.0 audit remediation

This work applies the findings in the [independent audit](../2026-09-26-independent/README.md) and [first audit](../2026-09-26/README.md) to the existing working tree. Historical audit evidence is unchanged. The pinned Figma version and website guidance in those reports remain the design baseline.

## Changes against findings

| Independent | First audit | Remediation |
| --- | --- | --- |
| A01 | - | Controlled upload props own native FileList and FormData, including delayed acceptance and rejected removal. |
| A02 | F03 | Both upload presentations enforce required; form reset restores the authoritative/default files. Compact invalid focus reaches its visible button. |
| A03 | F02 | Disabled slotted buttons intercept activation before child and wrapper handlers, including capture handlers. Tab remains available for disabled links. |
| A04 | F06 | Fixed cookie content scrolls within the dynamic viewport, accounting for the desktop bottom margin. |
| A05 | F05 | Profile links have a persistent name independent of avatar and breakpoint. |
| A06 | F01 | Next.js and compatible dependencies refreshed; Browserslist override fixes the optional Babel path. Production advisory scan is clean. |
| A07 | F04 | Required checkbox-group constraint targets an enabled input and ignores disabled/mixed selections. |
| A08 | F10 | Disabled uploads block removal in both buttons and handlers. |
| A09 | F09 | Selected and uploaded states are separate. Picker and drop validate type and size; custom validation and rejection callbacks are available. |
| A10 | F11 | Textarea counters follow completed native resets, respecting prevented resets. |
| A11 | - | Select preserves external invalid, error-message and labelled-by attributes. |
| A12 | F08 | Radio errors expose invalid state on the group, with error descriptions on inputs. |
| A13 | F07 | Summary links resolve group IDs to enabled controls; focused summaries omit the alert role. |
| A14 | F15 | Native checkbox controls, pre-hydration native Select and server-visible accordion content work without JavaScript. |
| A15 | F16 | Feedback has a persistent polite status region, separate focus destination, pending state, failure message and retry for promise-returning callbacks. |
| A16 | F17 | Tinted demo surfaces and logo captions use darker foreground text. |
| A17 | F20 | Mobile breadcrumbs hide the full list only when a replacement parent link exists. |
| A18 | F12 | Select measures 48px at L and 40px at M. |
| A19 | F13 | Control/body tracking is 0.5px, captions 0.4px; medium supporting text is 16/24 and the mandatory marker is 19px. |
| A20 | F14 | Header accepts an identity slot. Library glyphs use Material SVG paths with attribution and license distribution. Search submission scope is documented. |
| A21 | F18 | Demo installation uses the real GitHub registry and includes styles/font setup. |
| A22 | F19 | Installation snippets are keyboard-focusable; a skip link targets main content. |

Additional changes distribute footer columns according to the supplied count, preserve full text in unlinked cards, delay the feedback row layout until wider screens, remove long dashes from active source/docs, and gate container publishing on verification.

## Verification and boundaries

| Check | Result |
| --- | --- |
| TypeScript | Pass |
| ESLint | 0 errors, 3 existing native-image warnings |
| Production build | Pass, Next.js 16.3.6 |
| Browser regressions | 42 passed across Chromium, Firefox and WebKit |
| Demo axe checks | No violations at 390, 730 and 1440px in all three engines |
| Production dependency audit | No known vulnerabilities |
| Clean consumer | 28 items installed, 26 UI modules type-checked |
| Docker build and smoke | Pass; home/CSS 200, fixture 404, non-root UID 1001 |

[Browser output](evidence/browser.txt), [consumer output](evidence/consumer.txt), [dependency audit](evidence/dependencies.json), [container smoke](evidence/container.json). Visual evidence: [fields](evidence/fields-chromium.png), [header](evidence/header-chromium.png), [cookie notice](evidence/cookie-chromium.png).

The checked-in browser suite runs in Chromium, Firefox and WebKit. It tests native form data, accepted/rejected/async controlled uploads, disabled actions, reset and prevented reset, picker/drop validation, group focus, ARIA states, measured field geometry, no-JavaScript use, mobile navigation labels, cookie reachability, feedback retry, and demo axe/overflow at 390, 730 and 1440px.

The consumer check installs 28 registry items through shadcn into a disposable project with `~/ui` and `~/lib/utils` aliases, then type-checks all 26 UI modules. It tests the local working tree, not a published revision.

Screenshots of fields, the header and the cookie notice were visually inspected against the audit references. They verify the named corrections, not every permutation of the Figma library. All static and generated test routes remain outside the production application.

Read [integration contracts](../../idsk-integration.md) before adopting changed upload status and validation behavior. Header search remains submission-only; autocomplete is not implemented. Native no-JavaScript checkbox groups retain the first enabled control's native required constraint and need server validation for group rules. Consent storage and server upload validation remain consumer responsibilities.

These results do not certify complete IDSK or WCAG conformance. Actual VoiceOver/NVDA speech output, released Safari on devices, all Figma variants, and downstream application integrations still need manual verification. Repository reuse terms remain an owner decision; Material Icons attribution and its upstream license are included separately.
