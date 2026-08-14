'use client'

import { Home, Search } from 'lucide-react'
import { useState } from 'react'

import { IdskAccordion } from '@/components/ui/accordion'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { ErrorSummary } from '@/components/ui/error-summary'
import { FeedbackBar } from '@/components/ui/feedback-bar'
import { FileUpload } from '@/components/ui/file-upload'
import { IdskFooter } from '@/components/ui/footer'
import { IdskHeader } from '@/components/ui/header'
import { InformationBar } from '@/components/ui/information-bar'
import { Input } from '@/components/ui/input'
import { IdskRadioGroup } from '@/components/ui/radio-group'
import { SearchInput } from '@/components/ui/search-input'
import { Select } from '@/components/ui/select'
import { Signpost } from '@/components/ui/signpost'
import { Textarea } from '@/components/ui/textarea'

const placeholderImage =
  'https://placehold.co/960x540/EFF5FE/126DFF?text=IDSK'

export function HomeDemo() {
  const [radioValue, setRadioValue] = useState('citizen')
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['notifications'])

  return (
    <div className="min-w-0 bg-background text-foreground">
      <IdskHeader
        actions={[
          { label: 'Prihlásiť sa' },
          { label: 'Kontakt', variant: 'secondary' },
        ]}
        nav={[
          { href: '#instalacia', label: 'Inštalácia' },
          { href: '#komponenty', label: 'Komponenty', active: true },
          { href: '#formulare', label: 'Formuláre' },
          { href: '#navigacia', label: 'Navigácia' },
          { href: '#obsah', label: 'Obsah' },
          { href: '#paticka', label: 'Päta' },
        ]}
        search
        serviceName="IDSK shadcn"
        tagline="Neoficiálna ukážka React komponentov"
        variant="website"
      />

      <Breadcrumbs
        collapseOnMobile
        items={[
          { href: '#', label: 'Domov' },
          { href: '#', label: 'Dizajn systém' },
          { label: 'IDSK komponenty v štýle shadcn' },
        ]}
      />

      <main className="pb-16">
        <section className="idsk-container py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-surface-primary px-4 py-2 text-sm font-bold text-primary-dark">
                Neoficiálna ukážka shadcn komponentov
              </span>
              <div className="space-y-4">
                <h1 className="idsk-h1 max-w-4xl">
                  Shadcn-style React komponenty postavené na pravidlách IDSK
                </h1>
                <p className="idsk-subtitle max-w-3xl text-foreground-soft">
                  Tokeny, typografia, stavy formulárov a základná informačná architektúra podľa IDSK, preložené do lokálnych Tailwind / React komponentov. Toto nie je oficiálna stránka verejnej správy.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild leadingIcon={<Search className="h-4 w-4" />}>
                  <a href="#komponenty">Preskúmať komponenty</a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href="https://github.com/bmikuska46/idsk-shadcn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Zobraziť zdroje
                  </a>
                </Button>
                <Button asChild tone="warning" variant="text">
                  <a href="#instalacia">Ako nainštalovať</a>
                </Button>
              </div>
            </div>
            <div className="rounded-[5px] border border-border bg-surface p-4 shadow-idsk-md sm:p-6">
              <h2 className="idsk-h3">Použité základy</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground-muted md:text-base">
                <li>
                  <span className="font-bold text-foreground">Typografia:</span> Source Sans Pro, responzívny škálovaný systém nadpisov, textu a odkazov.
                </li>
                <li>
                  <span className="font-bold text-foreground">Farby:</span> primárna modrá <code>#126DFF</code>, tmavá modrá <code>#072C66</code>, chybová červená <code>#C3112B</code>, focus oranžová <code>#D96E00</code>.
                </li>
                <li>
                  <span className="font-bold text-foreground">Tiene:</span> malé, stredné, veľké, dialógové a hlavičkové tiene podľa IDSK.
                </li>
                <li>
                  <span className="font-bold text-foreground">Grid:</span> kontajner do 1120 px, štrukturálne medzery IDSK a responzívna 4/8/12-stĺpcová mriežka.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="idsk-container py-8" id="instalacia">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Open source a inštalácia</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Tento projekt je open source. Zdrojový kód nájdete v repozitári{' '}
                <a
                  className="idsk-link font-bold"
                  href="https://github.com/bmikuska46/idsk-shadcn"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  github.com/bmikuska46/idsk-shadcn
                </a>
                . Komponenty inštalujte cez oficiálny shadcn postup pre registry tretích strán (namespaced registries).
              </p>
            </div>

            <InformationBar
              className="max-w-none"
              title="Použite oficiálny shadcn návod pre other registries"
            >
              Postupujte podľa dokumentácie{' '}
              <a
                className="font-bold underline underline-offset-2"
                href="https://ui.shadcn.com/docs/registry/namespace"
                rel="noopener noreferrer"
                target="_blank"
              >
                Namespaces / other registries
              </a>
              : najprv pridajte registry do <code>components.json</code>, potom
              inštalujte položky cez CLI v tvare <code>@namespace/component</code>.
            </InformationBar>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2">
              <div className="min-w-0 space-y-4 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <h3 className="idsk-h4">1. Pridajte registry</h3>
                <p className="idsk-body text-foreground-soft">
                  Do <code>components.json</code> doplňte pole{' '}
                  <code>registries</code> podľa oficiálneho návodu. URL musí
                  obsahovať placeholder <code>{'{name}'}</code>.
                </p>
                <pre className="max-w-full min-w-0 overflow-x-auto rounded-[5px] bg-surface-primary p-4 text-sm text-foreground">
                  <code>{`{
  "registries": {
    "@idsk": "https://example.com/r/{name}.json"
  }
}`}</code>
                </pre>
              </div>
              <div className="min-w-0 space-y-4 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <h3 className="idsk-h4">2. Nainštalujte komponent</h3>
                <p className="idsk-body text-foreground-soft">
                  Po konfigurácii registry použite shadcn CLI. Alternatívne môžete
                  pridať položku priamo z URL podľa rovnakého oficiálneho návodu.
                </p>
                <pre className="max-w-full min-w-0 overflow-x-auto rounded-[5px] bg-surface-primary p-4 text-sm text-foreground">
                  <code>{`npx shadcn@latest add @idsk/button

# alebo priamo z URL
npx shadcn@latest add https://example.com/r/button.json`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="idsk-container py-8" id="komponenty">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Tlačidlá</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Primárne, sekundárne a textové varianty s basic, success a warning tónmi podľa oficiálnej špecifikácie tlačidiel.
              </p>
            </div>
            <div className="grid min-w-0 gap-6 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="idsk-h4">Základné akcie</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primárne tlačidlo</Button>
                  <Button variant="secondary">Sekundárne tlačidlo</Button>
                  <Button variant="text">Textové tlačidlo</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="idsk-h4">Procesné stavy</h3>
                <div className="flex flex-wrap gap-3">
                  <Button tone="success">Súhlasím</Button>
                  <Button tone="success" variant="secondary">
                    Sekundárne úspešné
                  </Button>
                  <Button tone="warning">Odstrániť</Button>
                  <Button tone="warning" variant="text">
                    Zrušiť oprávnenie
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="idsk-container py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Informačné lišty</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Statické informačné, varovné, upozorňovacie a úspešné správy používajú text a ikonu, takže význam nie je vyjadrený iba farbou.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <InformationBar title="Dôležitá informácia">
                Pre rýchlejšie vybavenie žiadosti odporúčame priložiť doklad o ukončení štúdia.
              </InformationBar>
              <InformationBar title="Žiadosť nie je úplná" variant="error">
                Skontrolujte formulár a doplňte chýbajúce povinné údaje.
              </InformationBar>
              <InformationBar title="Upozornenie" variant="warning">
                Ak prílohy nenahráte teraz, bude potrebné ich doložiť dodatočne.
              </InformationBar>
              <InformationBar title="Formulár bol uložený" variant="success">
                Vypĺňanie môžete bezpečne dokončiť neskôr.
              </InformationBar>
              <InformationBar
                action={
                  <Button size="sm" variant="text">
                    Zobraziť detail
                  </Button>
                }
                className="max-w-none lg:col-span-2"
                title="K dispozícii je nová verzia žiadosti"
              >
                Skontrolujte zmeny a pokračujte v najnovšej verzii formulára.
              </InformationBar>
            </div>
          </div>
        </section>

        <section className="idsk-container py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Vyhľadávanie</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Samostatné vyhľadávacie pole replikuje hlavičkové vyhľadávanie z webu IDSK vrátane rozloženia, rádiusu a ikonového tlačidla.
              </p>
            </div>
            <div className="min-w-0 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
              <div className="w-full max-w-lg min-w-0">
                <SearchInput
                  buttonAriaLabel="Vyhľadať komponent"
                  label="Vyhľadať komponent"
                  placeholder="Vyhľadať komponent..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="idsk-container py-8" id="formulare">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Formulárové polia</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Textové pole, viacriadkové pole, rozbaľovací zoznam, prepínacie a zaškrtávacie polia s povinnými stavmi a chybovým prehľadom.
              </p>
            </div>
            <ErrorSummary
              description="Priestor pre popis, k akým chybám došlo a ako ich opraviť."
              items={[
                { href: '#rodne-cislo', text: 'Prosím, zadajte správny tvar vášho Rodného čísla.' },
                { href: '#telefon', text: 'Prosím, zadajte platné telefónne číslo.' },
              ]}
              title="Zadajte správne tieto vstupné údaje a skúste odoslať znova."
            />
            <div className="grid min-w-0 gap-8 lg:grid-cols-2">
              <div className="min-w-0 space-y-6 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <Input
                  description="Popisný text"
                  hint="Napríklad vo formáte 850101/1234."
                  id="rodne-cislo"
                  label="Rodné číslo"
                  placeholder="850101/1234"
                  required
                />
                <Input
                  error="Telefónne číslo musí mať medzinárodný formát."
                  hint="Príklad: +421 901 234 567"
                  id="telefon"
                  label="Telefónne číslo"
                  placeholder="+421 901 234 567"
                />
                <Input
                  label="Malé pole"
                  optional
                  placeholder="VS123"
                  small
                />
                <Select
                  defaultValue="second"
                  label="Typ žiadosti"
                  options={[
                    { value: 'first', label: 'Nová žiadosť' },
                    { value: 'second', label: 'Doplnenie podania' },
                    { value: 'third', label: 'Oprava údajov', disabled: true },
                  ]}
                  required
                />
              </div>
              <div className="min-w-0 space-y-6 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <Textarea
                  hint="Uveďte len informácie, ktoré súvisia s vašou žiadosťou."
                  label="Doplňujúce informácie"
                  maxLength={200}
                  required
                  rows={5}
                />
                <IdskRadioGroup
                  hint="Vyberte jednu možnosť."
                  items={[
                    {
                      label: 'Som občan Slovenskej republiky',
                      value: 'citizen',
                    },
                    {
                      hint: 'Vyžaduje sa doplňujúci doklad totožnosti.',
                      label: 'Som občan iného štátu EÚ',
                      value: 'eu',
                    },
                    {
                      label: 'Iná štátna príslušnosť',
                      value: 'other',
                    },
                  ]}
                  label="Štátna príslušnosť"
                  name="citizenship"
                  onValueChange={setRadioValue}
                  value={radioValue}
                />
                <CheckboxGroup
                  hint="Môžete vybrať viacero možností."
                  items={[
                    {
                      label: 'E-mailové notifikácie o stave podania',
                      value: 'notifications',
                    },
                    {
                      label: 'SMS upozornenia',
                      value: 'sms',
                    },
                    {
                      label: 'Zdieľanie údajov medzi formulármi',
                      value: 'sharing',
                    },
                  ]}
                  label="Nastavenia doručovania"
                  onValuesChange={setCheckboxValues}
                  values={checkboxValues}
                />
              </div>
            </div>
            <div className="min-w-0 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
              <FileUpload />
            </div>
          </div>
        </section>

        <section className="idsk-container py-8" id="navigacia">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Navigačné komponenty</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Rázcestníky, akordeón a hlavička elektronickej služby vychádzajú z oficiálnych IDSK vzorov, ale sú prepísané do lokálnych React komponentov.
              </p>
            </div>
            <div className="rounded-[5px] border border-border bg-white shadow-idsk-sm">
              <IdskHeader
                actions={[
                  { label: 'Profil', variant: 'secondary' },
                  { label: 'Odhlásiť sa', variant: 'text' },
                ]}
                nav={[
                  { href: '#', label: 'Moje podania', active: true },
                  { href: '#', label: 'Dokumenty' },
                  { href: '#', label: 'Správy' },
                  { href: '#', label: 'Platby' },
                ]}
                serviceName="Elektronická služba"
                userName="jana.novakova"
                variant="service"
              />
            </div>
            <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Signpost
                description="Prehľad základných údajov a stav vybavenia žiadosti."
                href="#"
                icon={<Home className="h-6 w-6" />}
                showArrow
                title="Horizontálny rázcestník"
                variant="horizontal"
              />
              <Signpost
                description="Obsahová dlaždica bez ikony vhodná pre stručné textové navigácie."
                href="#"
                showArrow
                tag="Nové"
                title="Textový rázcestník"
                variant="text"
              />
              <Signpost
                description="Variant pre obsah s vizuálnou podporou, obrázkom a dlhším popisom."
                href="#"
                imageAlt="Ilustračný náhľad vertikálneho rázcestníka"
                imageSrc={placeholderImage}
                showArrow
                title="Vertikálny rázcestník"
                variant="vertical"
              />
            </div>
            <div className="min-w-0 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
              <IdskAccordion
                items={[
                  {
                    content:
                      'Potrebujeme poznať vašu štátnu príslušnosť, aby sme mohli určiť správny postup a dostupné služby.',
                    description: 'Sekcia s opisným textom',
                    title: 'Osobné údaje',
                    value: 'personal',
                  },
                  {
                    content:
                      'Prílohy majú byť vo formáte PDF, JPG alebo PNG. Maximálna veľkosť jednej prílohy je 10 MB.',
                    title: 'Prílohy',
                    value: 'attachments',
                  },
                  {
                    content:
                      'Spracovanie podania prebieha elektronicky. O ďalších krokoch vás budeme informovať cez zvolený komunikačný kanál.',
                    title: 'Ďalší postup',
                    value: 'process',
                  },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="idsk-container py-8" id="obsah">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Obsahové komponenty</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Kartičky a dlaždice sú použiteľné pre články, služby, oznamy aj vstupné body do procesov verejnej správy.
              </p>
            </div>
            <div className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Card
                className="md:col-span-2 xl:col-span-1"
                date="2026-04-21"
                dateLabel="21. 4. 2026"
                description="V tejto časti nájdete všetky podstatné informácie o vydaní a používaní občianskeho preukazu s čipom."
                href="#"
                imageAlt="Ilustračný náhľad informácií o občianskom preukaze"
                imageSrc={placeholderImage}
                tags={[
                  { text: 'Doklady' },
                  { text: 'Elektronické služby' },
                ]}
                title="Horizontálna kartička"
              />
              <Card
                date="2026-04-01"
                dateLabel="1. 4. 2026"
                description="Samostatná vertikálna karta pre články, kampane alebo tematické bloky s výraznejším vizuálom."
                href="#"
                imageAlt="Ilustračný náhľad elektronických služieb"
                imageSrc={placeholderImage}
                tags={[{ text: 'Novinka' }, { text: 'Dizajn systém' }]}
                title="Vertikálna kartička"
                variant="vertical"
              />
              <Card
                date="2026-03-20"
                dateLabel="20. 3. 2026"
                description="Obsahový blok bez obrázka pre stránky, kde sa kladie dôraz na text, meta informácie a odkazy."
                tags={[{ text: 'Usmernenie' }, { text: 'Formuláre' }]}
                title="Kartička bez obrázku"
              />
            </div>
          </div>
        </section>
      </main>

      <FeedbackBar />

      <IdskFooter
        columns={[
          {
            title: 'Elektronické služby',
            links: [
              { href: '#', label: 'Všetky služby' },
              { href: '#', label: 'Životné situácie' },
              { href: '#', label: 'Moje podania' },
            ],
          },
          {
            title: 'Informácie',
            links: [
              { href: '#', label: 'Prístupnosť' },
              { href: '#', label: 'Ochrana osobných údajov' },
              { href: '#', label: 'Cookies' },
            ],
          },
          {
            title: 'Podpora',
            links: [
              { href: '#', label: 'Kontakty' },
              { href: '#', label: 'Nahlásiť chybu' },
              { href: '#', label: 'Často kladené otázky' },
            ],
          },
          {
            title: 'O systéme',
            links: [
              {
                href: 'https://github.com/bmikuska46/idsk-shadcn',
                label: 'GitHub (open source)',
              },
              {
                href: 'https://ui.shadcn.com/docs/registry/namespace',
                label: 'shadcn other registries',
              },
              { href: '#instalacia', label: 'Inštalácia' },
            ],
          },
        ]}
      />
    </div>
  )
}
