'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FeedbackBar } from '@/components/ui/feedback-bar'
import { FileUpload, type FileUploadItem } from '@/components/ui/file-upload'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { IdskRadioGroup } from '@/components/ui/radio-group'
import { ErrorSummary } from '@/components/ui/error-summary'
import { IdskHeader } from '@/components/ui/header'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { CookieBar } from '@/components/ui/cookie-bar'
import { InfoTooltip } from '@/components/ui/tooltip'
import { IdskAccordion } from '@/components/ui/accordion'

export default function Probe() {
  const [clicks, setClicks] = useState(0)
  const [files, setFiles] = useState<FileUploadItem[]>([])
  const [asyncFiles, setAsyncFiles] = useState<FileUploadItem[]>([])
  const [failFeedback, setFailFeedback] = useState(true)
  return <>
    <IdskHeader serviceName="Audit service" search mail={{ label: 'Pošta', href: '#mail' }} notifications={{ label: 'Notifikácie', href: '#notifications' }} user={{ name: 'Jana Novakova', href: '#profile' }} nav={[{ label: 'Services', children: [{ label: 'Child page', href: '#child' }] }]} />
    <main style={{ maxWidth: 720, margin: '30px auto', padding: 16 }}>
      <h1>Independent audit fixture</h1>
      <div id="accepted"><form><FileUpload id="accepted-file" name="attachment" files={files} onFilesChange={setFiles} /></form></div>
      <div id="async"><form><FileUpload id="async-file" name="attachment" files={asyncFiles} onFilesChange={(next) => setTimeout(() => setAsyncFiles(next), 200)} /></form></div>
      <FeedbackBar onYes={async () => { await new Promise((resolve) => setTimeout(resolve, 200)); if (failFeedback) { setFailFeedback(false); throw new Error('Test failure') } }} />
      <div id="buttons"><Button asChild aria-disabled="true" onClickCapture={() => setClicks(v => v + 1)} onClick={() => setClicks(v => v + 1)}><a onClickCapture={() => setClicks(v => v + 1)} id="disabled-action" href="#destination" onClick={() => setClicks(v => v + 1)}>Disabled action</a></Button><Button asChild disabled onClick={() => setClicks(v => v + 1)}><a id="native-disabled-action" href="#destination" onClick={() => setClicks(v => v + 1)}>Native disabled action</a></Button><output id="clicks">{clicks}</output></div>
      <form id="single-upload"><FileUpload id="single-file" name="attachment" multiple={false} /></form>
      <form id="compact-form"><FileUpload id="compact" name="attachment" required dragAndDrop={false} /></form>
      <form id="checks"><CheckboxGroup required name="choices" label="Required choice" items={[{ value: 'a', label: 'Unavailable', disabled: true }, { value: 'b', label: 'Available' }]} /></form>
      <form id="reset-upload"><FileUpload id="reset-file" name="attachment" required /><button type="reset">Reset upload</button></form>
      <form id="controlled-upload"><FileUpload id="controlled-file" name="attachment" files={[]} onFilesChange={() => {}} /></form>
      <form id="disabled-upload"><FileUpload id="disabled-file" disabled defaultFiles={[{ name: 'existing.pdf' }]} /></form>
      <form id="prevented-reset" onReset={(event) => event.preventDefault()}><Textarea id="prevented-area" label="Prevented reset" defaultValue="seed" maxLength={30} /><button type="reset">Prevent reset</button></form>
      <form id="reset-text"><Textarea id="reset-area" name="text" label="Reset text" defaultValue="seed" maxLength={30} /><button type="reset">Reset text</button></form>
      <div id="fields"><Input id="input-m" size="m" label="Medium input" hint="Input hint" error="Input error" required /><Select id="select-m" size="m" label="Medium select" aria-invalid="true" options={[{ label: 'One', value: 'one' }]} /><Select id="select-l" label="Large select" options={[{ label: 'One', value: 'one' }]} /></div>
      <ErrorSummary focusOnMount id="focused-summary" title="Focused errors" items={[]} />
      <ErrorSummary title="Errors" items={[{ href: '#radio', text: 'Fix radio group' }]} />
      <IdskRadioGroup id="radio" name="radio" label="Radio choice" error="Select a choice" items={[{ value: 'a', label: 'Alpha' }]} />
      <div id="crumb"><Breadcrumbs contained={false} collapseOnMobile items={[{ label: 'Home', href: '/' }]} /></div>
      <InfoTooltip label="Audit tooltip">Tooltip content</InfoTooltip>
      <IdskAccordion items={[{ title: 'Audit accordion', value: 'a', content: 'Unique no JavaScript content' }]} />
      <div id="cookie"><CookieBar /></div>
    </main>
  </>
}
