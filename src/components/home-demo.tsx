'use client'

import { FileText, Home, Search } from 'lucide-react'
import { useState } from 'react'

import { IdskAccordion } from '@/components/ui/accordion'
import { AnnouncementBar } from '@/components/ui/announcement-bar'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { CookieBar } from '@/components/ui/cookie-bar'
import { DataPanel } from '@/components/ui/data-panel'
import { Divider } from '@/components/ui/divider'
import { ErrorSummary } from '@/components/ui/error-summary'
import { FeedbackBar } from '@/components/ui/feedback-bar'
import { FileUpload } from '@/components/ui/file-upload'
import { IdskFooter } from '@/components/ui/footer'
import { IdskHeader } from '@/components/ui/header'
import { InformationBar } from '@/components/ui/information-bar'
import { Input } from '@/components/ui/input'
import { MandatoryFieldLegend } from '@/components/ui/mandatory-field-legend'
import { IdskRadioGroup } from '@/components/ui/radio-group'
import { SearchInput } from '@/components/ui/search-input'
import { Select } from '@/components/ui/select'
import { Signpost } from '@/components/ui/signpost'
import { Textarea } from '@/components/ui/textarea'
import { InfoTooltip } from '@/components/ui/tooltip'

const placeholderImage =
  'https://placehold.co/960x540/EFF5FE/126DFF?text=IDSK'

export function HomeDemo() {
  const [radioValue, setRadioValue] = useState('citizen')
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['notifications'])
  const [cookieBarOpen, setCookieBarOpen] = useState(false)
  const [announcementOpen, setAnnouncementOpen] = useState(true)

  return (
    <div className="min-w-0 bg-background text-foreground">
      <a className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3" href="#main-content">Preskočiť na hlavný obsah</a>
      <IdskHeader
        actions={[
          { label: 'Prihlásiť sa' },
          { label: 'Kontakt', variant: 'secondary' },
        ]}
        showOfficialBanner
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

      <main className="pb-16" id="main-content" tabIndex={-1}>
        <section className="idsk-container py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-[5px] bg-surface-primary px-[10px] py-[2px] text-[16px] leading-6 font-bold text-link">
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
                <Button asChild leadingIcon={<Search />}>
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
                <Button asChild variant="text">
                  <a href="#instalacia">Ako nainštalovať</a>
                </Button>
              </div>
            </div>
            <div className="rounded-[5px] border border-border bg-surface p-4 shadow-idsk-md sm:p-6">
              <h2 className="idsk-h3">Použité základy</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground-soft md:text-base">
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
              <h2 className="idsk-h2">Zdrojový kód a inštalácia</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Zdrojový kód projektu je verejne dostupný. Zdrojový kód nájdete v repozitári{' '}
                <a
                  className="idsk-link font-bold"
                  href="https://github.com/bmikuska46/idsk-shadcn"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  github.com/bmikuska46/idsk-shadcn
                </a>
                . Komponenty inštalujte cez oficiálny shadcn postup pre GitHub registry.
              </p>
            </div>

            <InformationBar
              className="max-w-none"
              title="Inštalácia z GitHub registry"
            >
              Postupujte podľa dokumentácie{' '}
              <a
                className="font-bold underline underline-offset-2"
                href="https://ui.shadcn.com/docs/registry/github"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub registry
              </a>
              : v projekte s nakonfigurovaným shadcn inštalujte štýly a jednotlivé komponenty cez CLI.
            </InformationBar>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2">
              <div className="min-w-0 space-y-4 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <h3 className="idsk-h4">1. Nainštalujte štýly</h3>
                <p className="idsk-body text-foreground-soft">
                  Importujte súbor src/styles/idsk.css v hlavnom vstupe aplikácie. Štýly nastavujú globálne tokeny a breakpoint sm na 730px.
                </p>
                <pre tabIndex={0} aria-label="Inštalačný príkaz" className="max-w-full min-w-0 overflow-x-auto rounded-[5px] bg-surface-primary p-4 text-sm text-foreground">
                  <code>{`pnpm dlx shadcn@latest add bmikuska46/idsk-shadcn/styles
pnpm add @fontsource/source-sans-pro`}</code>
                </pre>
              </div>
              <div className="min-w-0 space-y-4 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
                <h3 className="idsk-h4">2. Nainštalujte komponent</h3>
                <p className="idsk-body text-foreground-soft">
                  Načítajte font Source Sans Pro vo váhach 400, 700 a 900 v hlavnom vstupe aplikácie.
                </p>
                <pre tabIndex={0} aria-label="Inštalačný príkaz" className="max-w-full min-w-0 overflow-x-auto rounded-[5px] bg-surface-primary p-4 text-sm text-foreground">
                  <code>{`pnpm dlx shadcn@latest add bmikuska46/idsk-shadcn/button

import '@fontsource/source-sans-pro/400.css'
import '@fontsource/source-sans-pro/700.css'
import '@fontsource/source-sans-pro/900.css'
import './styles/idsk.css' `}</code>
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
                Primárne, sekundárne a terciárne (textové) varianty v základnej, úspešnej a chybovej farebnej schéme, veľkosti L, M a S podľa špecifikácie IDSK.
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
                  <Button tone="error">Odstrániť</Button>
                  <Button tone="error" variant="text">
                    Zrušiť oprávnenie
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="idsk-h4">Veľkosti a stavy</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg">Veľkosť L</Button>
                  <Button size="md">Veľkosť M</Button>
                  <Button size="sm">Veľkosť S</Button>
                  <Button disabled>Neaktívne</Button>
                  <Button disabled variant="secondary">
                    Neaktívne
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="idsk-h4">Vysvetlivka a oddeľovač</h3>
                <p className="flex items-center gap-2 text-[19px] leading-7">
                  Rodné číslo
                  <InfoTooltip>
                    Rodné číslo nájdete na prednej strane občianskeho preukazu. Zadajte ho bez lomky alebo s lomkou.
                  </InfoTooltip>
                </p>
                <Divider />
                <Button variant="text-inline">Terciárne bez odsadenia</Button>
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
              <InformationBar title="Upozornenie" variant="warning">
                Ak prílohy nenahráte teraz, bude potrebné ich doložiť dodatočne.
              </InformationBar>
              <InformationBar title="Žiadosť nie je úplná" variant="error">
                Skontrolujte formulár a doplňte chýbajúce povinné údaje.
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

        <section className="idsk-container py-8" id="listy">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="idsk-h2">Oznamovacia a cookie lišta</h2>
              <p className="idsk-body max-w-3xl text-foreground-soft">
                Oznamovacia lišta upozorňuje na celoportálové udalosti v štyroch stavoch. Cookie lišta ponúka prijatie, odmietnutie a nastavenia cookies.
              </p>
            </div>
            <div className="grid gap-5">
              {announcementOpen ? (
                <AnnouncementBar
                  headingLevel={3}
                  link={<a className="idsk-link" href="#">Viac informácií o odstávke</a>}
                  onDismiss={() => setAnnouncementOpen(false)}
                  title="Plánovaná odstávka služieb"
                >
                  V sobotu 4. 10. 2026 od 22:00 do 02:00 budú elektronické služby nedostupné z dôvodu údržby.
                </AnnouncementBar>
              ) : (
                <Button className="self-start" onClick={() => setAnnouncementOpen(true)} variant="secondary">
                  Zobraziť oznamovaciu lištu
                </Button>
              )}
              <AnnouncementBar headingLevel={3} status="success" title="Podanie bolo odoslané">
                Potvrdenie sme vám poslali do elektronickej schránky.
              </AnnouncementBar>
              <AnnouncementBar headingLevel={3} status="warning" title="Blíži sa termín">
                Žiadosť je potrebné doplniť do 30. 9. 2026.
              </AnnouncementBar>
              <AnnouncementBar headingLevel={3} status="error" title="Služba je dočasne nedostupná">
                Skúste to prosím neskôr alebo kontaktujte podporu.
              </AnnouncementBar>
            </div>
            <div className="space-y-4">
              <Button onClick={() => setCookieBarOpen(true)} variant="secondary">
                Zobraziť cookie lištu
              </Button>
              <CookieBar position="static" />
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
            <MandatoryFieldLegend />
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
                  label="Stredné pole"
                  optional
                  placeholder="VS123"
                  size="m"
                />
                <Input disabled label="Neaktívne pole" value="Nedá sa upraviť" />
                <Select
                  defaultValue="second"
                  label="Typ žiadosti"
                  tooltip={<InfoTooltip>Vyberte typ podania, ktorý najlepšie zodpovedá vašej situácii.</InfoTooltip>}
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
              <FileUpload headingLevel={3} optional />
            </div>
            <div className="min-w-0 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
              <FileUpload
                headingLevel={3}
                defaultFiles={[{ name: 'zivotopis.pdf', size: 245760, status: 'success' }]}
                dragAndDrop={false}
                label="Nahrajte súbor"
                multiple={false}
              />
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
                navLabel="Navigácia služby"
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
                mail={{ hasNew: true, href: '#' }}
                notifications={{ hasNew: false, href: '#' }}
                serviceName="Elektronická služba"
                subheading="Ministerstvo investícií, regionálneho rozvoja a informatizácie SR"
                user={{ caption: 'Fyzická osoba', name: 'Jana Nováková' }}
                variant="service"
              />
            </div>
            <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Signpost
                description="Prehľad základných údajov a stav vybavenia žiadosti."
                href="#"
                icon={<Home />}
                title="Horizontálny rázcestník"
                variant="horizontal"
              />
              <Signpost
                description="Obsahová dlaždica bez ikony vhodná pre stručné textové navigácie."
                href="#"
                showArrow={false}
                tag="Nové"
                title="Textový rázcestník"
                variant="text"
              />
              <Signpost
                description="Variant pre obsah s vizuálnou podporou, obrázkom a dlhším popisom."
                href="#"
                imageAlt="Ilustračný náhľad vertikálneho rázcestníka"
                imageSrc={placeholderImage}
                title="Vertikálny rázcestník"
                variant="vertical"
              />
            </div>
            <div className="min-w-0 rounded-[5px] border border-border bg-white p-4 shadow-idsk-sm sm:p-6">
              <IdskAccordion
                headingLevel={3}
                title="Časté otázky"
                toggleAll
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
                actions={
                  <>
                    <Button size="md" variant="secondary">
                      Otvoriť
                    </Button>
                    <Button size="md" variant="text-inline">
                      Zdieľať
                    </Button>
                  </>
                }
              />
            </div>
            <DataPanel
              actions={
                <>
                  <Button size="md" variant="text">
                    Upraviť
                  </Button>
                  <Button size="md" variant="text">
                    Stiahnuť PDF
                  </Button>
                </>
              }
              icon={<FileText />}
              items={[
                { label: 'Číslo podania', value: 'POD-2026-004512' },
                { label: 'Stav', value: 'Prijaté na spracovanie' },
                { label: 'Dátum podania', value: '21. 4. 2026' },
                { label: 'Úrad', value: 'Okresný úrad Bratislava' },
              ]}
              title="Podanie žiadosti o občiansky preukaz"
            />
          </div>
        </section>
      </main>

      <FeedbackBar />

      {cookieBarOpen ? (
        <CookieBar
          onAcceptAll={() => setCookieBarOpen(false)}
          onRejectAll={() => setCookieBarOpen(false)}
          onSettings={() => setCookieBarOpen(false)}
        />
      ) : null}

      <IdskFooter
        id="paticka"
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
                href: 'https://ui.shadcn.com/docs/registry/github',
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
