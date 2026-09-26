# IDSK 3.1 - shadcn komponenty

React + TypeScript UI komponenty podľa dizajnového systému **IDSK 3.1**, implementované v štýle [shadcn/ui](https://ui.shadcn.com/) (kopírovateľné komponenty, Tailwind CSS, Radix UI).

Tento repozitár poskytuje hotové komponenty (formuláre, navigácia, layout, obsah) pre elektronické služby a weby verejnej správy v súlade s IDSK.

Ukážková aplikácia: [idsk.bmikuska.com](https://idsk.bmikuska.com).

## Čo je IDSK?

[IDSK](https://idsk.gov.sk/co-je/uvod) (Jednotný dizajn manuál elektronických služieb) je súbor pravidiel tvorby obsahu a funkčnosti elektronických služieb v súlade s potrebami používateľov. Definuje komponenty, jednotné používanie výrazov, princípy, vzory a pravidlá pre tvorbu jednotného používateľského rozhrania.

Jeho účelom je **jednotný spôsob komunikácie** s používateľom elektronických služieb v celej verejnej správe Slovenskej republiky.

Komponenty IDSK sú:

- **responzívne** - správne sa zobrazujú na PC, mobile aj tablete
- **prístupné** - použiteľné aj s asistenčnými technológiami
- **použiteľné** - vychádzajú z overených heuristík použiteľnosti

IDSK je verejne dostupný na voľné použitie. Oficiálny úvod: [idsk.gov.sk/co-je/uvod](https://idsk.gov.sk/co-je/uvod).

## Stack

- React 19
- TypeScript
- Next.js (App Router)
- Tailwind CSS v4
- Radix UI (tam, kde to dáva zmysel)
- Alias `@/*` → `src/*`

## Inštalácia cez shadcn CLI (GitHub registry)

Repozitár je publikovaný ako [shadcn GitHub registry](https://ui.shadcn.com/docs/registry/github). V projekte so shadcn (`components.json`) nainštalujte:

```bash
# IDSK tokeny a utility triedy (odporúčané raz na začiatok)
pnpm dlx shadcn@latest add bmikuska46/idsk-shadcn/styles

# konkrétny komponent
pnpm dlx shadcn@latest add bmikuska46/idsk-shadcn/button
pnpm dlx shadcn@latest add bmikuska46/idsk-shadcn/header
```

Ďalšie príkazy:

```bash
pnpm dlx shadcn@latest list bmikuska46/idsk-shadcn
pnpm dlx shadcn@latest view bmikuska46/idsk-shadcn/button
```

Po inštalácii `styles` importujte `src/styles/idsk.css` v root layoute (alebo vstupe aplikácie) a načítajte Source Sans Pro (`@fontsource/source-sans-pro`, váhy 400, 700 a 900).

## Použitie komponentov

Komponenty sa nachádzajú v `src/components/ui/`. Zatiaľ nie je barrel export - importujte ich priamo zo súborov:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
```

Pred použitím zabezpečte, že aplikácia načítava globálne štýly a font (projekt to už robí v `src/app/layout.tsx` a `src/index.css`):

- tokeny a utility: `src/index.css`
- font Source Sans Pro
- oranžový focus ring IDSK: `#D96E00`, šírka `3px`, offset `2px`

### Príklad: tlačidlo

```tsx
import { Button } from '@/components/ui/button'

export function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>Primárne tlačidlo</Button>
      <Button variant="secondary">Sekundárne tlačidlo</Button>
      <Button variant="text">Textové tlačidlo</Button>
      <Button tone="success">Potvrdiť</Button>
    </div>
  )
}
```

### Príklad: formulárové polia

```tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IdskRadioGroup } from '@/components/ui/radio-group'
import { CheckboxGroup } from '@/components/ui/checkbox-group'

export function FormExample() {
  const [citizenship, setCitizenship] = useState('citizen')
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <Input
        id="meno"
        label="Meno a priezvisko"
        required
      />

      <Select
        label="Typ žiadosti"
        options={[
          { value: 'first', label: 'Nová žiadosť' },
          { value: 'second', label: 'Doplnenie podania' },
        ]}
      />

      <Textarea
        label="Doplňujúce informácie"
        maxLength={200}
        rows={5}
      />

      <IdskRadioGroup
        name="citizenship"
        label="Štátna príslušnosť"
        value={citizenship}
        onValueChange={setCitizenship}
        items={[
          { label: 'Občan SR', value: 'citizen' },
          { label: 'Občan EÚ', value: 'eu' },
        ]}
      />

      <CheckboxGroup
        label="Spôsob doručovania"
        values={deliveryOptions}
        onValuesChange={setDeliveryOptions}
        items={[
          { label: 'E-mail', value: 'email' },
          { label: 'SMS', value: 'sms' },
        ]}
      />
    </div>
  )
}
```

### Príklad: layout (hlavička a pätička)

```tsx
import { IdskHeader } from '@/components/ui/header'
import { IdskFooter } from '@/components/ui/footer'

export function LayoutExample() {
  return (
    <>
      <IdskHeader
        serviceName="gov.sk / moja služba"
        variant="website"
        search
        nav={[
          { href: '#komponenty', label: 'Komponenty', active: true },
          { href: '#formulare', label: 'Formuláre' },
        ]}
      />
      {/* obsah stránky */}
      <IdskFooter
        columns={[
          {
            title: 'Pomoc',
            links: [
              { href: '/kontakt', label: 'Kontakt' },
              { href: '/faq', label: 'FAQ' },
            ],
          },
        ]}
      />
    </>
  )
}
```

## Dostupné komponenty

| Komponent | Súbor |
|-----------|--------|
| Button | `src/components/ui/button.tsx` |
| Input | `src/components/ui/input.tsx` |
| Textarea | `src/components/ui/textarea.tsx` |
| Select | `src/components/ui/select.tsx` |
| CheckboxGroup | `src/components/ui/checkbox-group.tsx` |
| IdskRadioGroup | `src/components/ui/radio-group.tsx` |
| FileUpload | `src/components/ui/file-upload.tsx` |
| SearchInput | `src/components/ui/search-input.tsx` |
| FieldLabelText, FieldHint, FieldError, RequiredMark | `src/components/ui/field.tsx` |
| InfoTooltip, Tooltip | `src/components/ui/tooltip.tsx` |
| Divider | `src/components/ui/divider.tsx` |
| MandatoryFieldLegend | `src/components/ui/mandatory-field-legend.tsx` |
| ErrorSummary | `src/components/ui/error-summary.tsx` |
| FeedbackBar | `src/components/ui/feedback-bar.tsx` |
| InformationBar | `src/components/ui/information-bar.tsx` |
| AnnouncementBar | `src/components/ui/announcement-bar.tsx` |
| CookieBar | `src/components/ui/cookie-bar.tsx` |
| DataPanel | `src/components/ui/data-panel.tsx` |
| Breadcrumbs | `src/components/ui/breadcrumbs.tsx` |
| IdskAccordion | `src/components/ui/accordion.tsx` |
| Signpost | `src/components/ui/signpost.tsx` |
| Card | `src/components/ui/card.tsx` |
| IdskHeader | `src/components/ui/header.tsx` |
| IdskFooter | `src/components/ui/footer.tsx` |
| GovernmentLogo | `src/components/ui/government-logo.tsx` |

## Štruktúra projektu

```text
src/
  app/             # Next.js App Router (layout + page)
  components/ui/   # IDSK komponenty v štýle shadcn
  components/home-demo.tsx  # ukážková stránka
  lib/utils.ts     # cn() helper (clsx + tailwind-merge)
  index.css        # tokeny a globálne štýly
```

## Lokálny vývoj

```bash
pnpm install
pnpm dev
```

## Docker / GHCR

Pri pushi do `main` (alebo manuálne cez Actions) sa zbuildí a publikuje image:

```text
ghcr.io/bmikuska46/idsk-shadcn:latest
```

Lokálne spustenie:

```bash
docker pull ghcr.io/bmikuska46/idsk-shadcn:latest
docker run --rm -p 8080:3000 ghcr.io/bmikuska46/idsk-shadcn:latest
```

## Odkazy

- [Ukážka - idsk.bmikuska.com](https://idsk.bmikuska.com)
- [Čo je IDSK - Úvod](https://idsk.gov.sk/co-je/uvod)
- [Oficiálny IDSK manuál](https://idsk.gov.sk/)
- [shadcn/ui](https://ui.shadcn.com/)

## IDSK 3.1.0 integration and verification

See [integration contracts](docs/idsk-integration.md) for upload validation, async feedback, native fallbacks, identity slots, icon mappings, style scope and verification commands. The implementation is unofficial; automated checks are not a conformance certification.
