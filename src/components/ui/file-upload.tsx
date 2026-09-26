'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

import { buttonVariants } from '@/components/ui/button'
import { FieldError, FieldErrorIcon, FieldHint, FieldLabelText, type RequiredIndicator } from '@/components/ui/field'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

export type FileUploadItem = {
  error?: string
  file?: File
  id?: string
  name: string
  progress?: number
  size?: number
  status?: 'selected' | 'uploading' | 'success' | 'error'
}

export type FileUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'onChange' | 'size' | 'type' | 'value'
> & {
  buttonLabel?: string
  className?: string
  defaultFiles?: FileUploadItem[]
  /** Renders the drop zone (default). `false` renders the compact "Vyberte súbor" button. */
  dragAndDrop?: boolean
  error?: string
  files?: FileUploadItem[]
  hint?: string
  inputClassName?: string
  label?: string
  headingLevel?: 2 | 3 | 4
  /** Maximum bytes per file. Defaults to 15 MiB. */
  maxSizeBytes?: number
  maxSizeLabel?: string
  /** Additional client validation. Return a message to reject the file. */
  validateFile?: (file: File) => string | undefined
  onFilesRejected?: (files: { file: File; error: string }[]) => void
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onFilesChange?: (files: FileUploadItem[], selectedFiles?: File[]) => void
  onRemoveFile?: (file: FileUploadItem, index: number) => void
  optional?: boolean
  /** Text after the label for optional uploads. */
  optionalText?: ReactNode
  /** Show the mandatory marker as a red asterisk (default) or as "(povinné pole)". */
  requiredIndicator?: RequiredIndicator
  /** Prompt inside the drop zone. */
  subtitle?: string
  supportedFormats?: string
  /** Tooltip mark rendered after the label, see `InfoTooltip`. */
  tooltip?: ReactNode
}

/** IDSK shows sizes as "kB" and "MB" with one decimal place for megabytes. */
export function formatFileSize(size?: number) {
  if (size === undefined) return undefined
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} kB`
  return `${(size / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

function fileKey(file: FileUploadItem, index: number) {
  return file.id ?? `${file.name}-${file.size ?? 'unknown'}-${index}`
}

/** Slovak plural for "N súborov": 1 súbor, 2-4 súbory, 5+ súborov. */
function pluralFiles(count: number) {
  if (count === 1) return '1 súbor'
  if (count >= 2 && count <= 4) return `${count} súbory`
  return `${count} súborov`
}

/**
 * IDSK "Nahranie súboru". Multiple-file mode renders the N90 drop zone with a
 * 2px N600 border and 10px radius: cloud icon, prompt, accepted formats and a
 * secondary "Pridať súbor" button, all in P600. Uploaded files are listed below
 * the zone as 49px N90 rows with a 1px N300 border, Error alert border when the
 * upload failed. Single-file mode renders the button with the selection text.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      accept = '.jpg,.jpeg,.png,.doc,.docx,.pdf',
      buttonLabel,
      className,
      defaultFiles = [],
      disabled = false,
      dragAndDrop = true,
      error,
      files,
      hint,
      headingLevel = 2,
      id,
      inputClassName,
      label = 'Nahrajte súbory',
      maxSizeBytes = 15 * 1024 * 1024,
      maxSizeLabel = formatFileSize(maxSizeBytes),
      validateFile,
      onFilesRejected,
      multiple = true,
      name,
      onChange,
      onFilesChange,
      onRemoveFile,
      optional = false,
      optionalText = '(nepovinné prílohy)',
      required = false,
      requiredIndicator,
      subtitle = 'Zvoľte súbor a nahrajte ho alebo preneste zvolenú prílohu sem.',
      supportedFormats = 'jpg, png, doc, docx, pdf',
      tooltip,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId()
    const inputId = id ?? `file-upload-${generatedId.replace(/:/g, '')}`
    const titleId = `${inputId}-title`
    const titleTextId = `${inputId}-title-text`
    const hintId = hint ? `${inputId}-hint` : undefined
    const subtitleId = dragAndDrop ? `${inputId}-subtitle` : undefined
    const formatsId = `${inputId}-formats`
    const maxSizeId = `${inputId}-max-size`
    const errorId = error ? `${inputId}-error` : undefined
    const selectionStatusId = !dragAndDrop ? `${inputId}-selection-status` : undefined
    const filesTitleId = `${inputId}-files-title`
    const describedBy = [
      inputProps['aria-describedby'],
      `${inputId}-validation`,
      hintId,
      subtitleId,
      formatsId,
      maxSizeId,
      selectionStatusId,
      errorId,
    ]
      .filter(Boolean)
      .join(' ')
    const inputRef = useRef<HTMLInputElement>(null)
    const compactButtonRef = useRef<HTMLButtonElement>(null)
    const selectionCounter = useRef(0)
    const [internalFiles, setInternalFiles] = useState<FileUploadItem[]>(defaultFiles)
    const [dragging, setDragging] = useState(false)
    const [announcement, setAnnouncement] = useState('')
    const [validationError, setValidationError] = useState('')
    const displayedFiles = files ?? internalFiles
    const isUploading = displayedFiles.some((file) => file.status === 'uploading')
    const Heading = headingLevel === 3 ? 'h3' : headingLevel === 4 ? 'h4' : 'h2'
    const FilesHeading = headingLevel === 3 ? 'h4' : headingLevel === 4 ? 'h5' : 'h3'
    const resolvedButtonLabel = buttonLabel ?? 'Pridať súbor'

    const syncNativeFiles = useCallback((nextFiles: FileUploadItem[]) => {
      if (!inputRef.current || typeof DataTransfer === 'undefined') return

      const transfer = new DataTransfer()
      nextFiles.forEach((item) => {
        if (item.file instanceof File) transfer.items.add(item.file)
      })
      inputRef.current.files = transfer.files
    }, [])

    useEffect(() => {
      syncNativeFiles(displayedFiles)
    }, [displayedFiles, syncNativeFiles])

    useEffect(() => {
      const form = inputRef.current?.form
      const reset = (event: Event) => {
        setTimeout(() => {
          if (event.defaultPrevented) return
          const resetFiles = files ?? defaultFiles
          if (files === undefined) setInternalFiles(resetFiles)
          syncNativeFiles(resetFiles)
          setValidationError('')
          setAnnouncement('')
        })
      }
      form?.addEventListener('reset', reset)
      return () => form?.removeEventListener('reset', reset)
    }, [files, defaultFiles, syncNativeFiles])

    const updateFiles = (nextFiles: FileUploadItem[], selectedFiles?: File[]) => {
      if (files === undefined) setInternalFiles(nextFiles)
      onFilesChange?.(nextFiles, selectedFiles)
    }

    const appendFiles = (fileList: FileList | null) => {
      if (!fileList?.length || disabled) {
        syncNativeFiles(displayedFiles)
        return
      }

      const rejected: { file: File; error: string }[] = []
      const formats = accept.split(',').map((format) => format.trim().toLowerCase()).filter(Boolean)
      const selectedFiles = Array.from(fileList).filter((file) => {
        const matchesFormat = formats.length === 0 || formats.some((format) =>
          format.startsWith('.') ? file.name.toLowerCase().endsWith(format)
            : format.endsWith('/*') ? file.type.startsWith(format.slice(0, -1))
              : file.type === format,
        )
        const reason = !matchesFormat ? 'Nepodporovaný formát súboru.'
          : file.size > maxSizeBytes ? `Súbor prekračuje maximálnu veľkosť ${maxSizeLabel}.`
            : validateFile?.(file)
        if (reason) rejected.push({ file, error: reason })
        return !reason
      })
      setValidationError(rejected.map(({ file, error }) => `${file.name}: ${error}`).join(' '))
      if (rejected.length) onFilesRejected?.(rejected)
      if (!selectedFiles.length) {
        syncNativeFiles(displayedFiles)
        return
      }
      const nextItems = selectedFiles.map<FileUploadItem>((file) => ({
        file,
        id: `${file.name}-${file.lastModified}-${file.size}-${++selectionCounter.current}`,
        name: file.name,
        size: file.size,
        status: 'selected',
      }))
      const nextFiles = multiple ? [...displayedFiles, ...nextItems] : nextItems.slice(0, 1)

      updateFiles(nextFiles, selectedFiles)
      syncNativeFiles(files === undefined ? nextFiles : files)
      if (!nextItems.length) return
      setAnnouncement(
        files !== undefined ? 'Výber bol odovzdaný na spracovanie.' : nextItems.length === 1
          ? `Súbor ${nextItems[0].name} bol vybraný.`
          : nextItems.length <= 4
            ? `Boli vybrané ${pluralFiles(nextItems.length)}.`
            : `Bolo vybraných ${pluralFiles(nextItems.length)}.`,
      )
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      appendFiles(event.currentTarget.files)
      onChange?.(event)
    }

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault()
      setDragging(false)
      appendFiles(event.dataTransfer.files)
    }

    const removeFile = (file: FileUploadItem, index: number) => {
      if (disabled) return
      const nextFiles = displayedFiles.filter((_, currentIndex) => currentIndex !== index)
      updateFiles(nextFiles)
      syncNativeFiles(files === undefined ? nextFiles : files)
      setAnnouncement(files === undefined ? `Súbor ${file.name} bol odstránený.` : `Požiadavka na odstránenie súboru ${file.name} bola odovzdaná na spracovanie.`)
      onRemoveFile?.(file, index)
    }

    const selectionText = displayedFiles.length ? 'Vyberte ďalší súbor' : 'Nie je vybraný žiadny súbor'

    const formatsInfo = (
      <>
        <span className="block" id={formatsId}>
          Podporované formáty: {supportedFormats}
        </span>
        <span className="block" id={maxSizeId}>
          Maximálna veľkosť súboru: {maxSizeLabel}
        </span>
      </>
    )

    const fileList = displayedFiles.length ? (
      <section
        aria-busy={isUploading || undefined}
        aria-labelledby={filesTitleId}
        className={dragAndDrop ? 'mt-[15px] sm:mt-5' : undefined}
      >
        <FilesHeading
          className={cn(
            'mb-5 text-[20px] leading-[26px] font-bold text-foreground',
            !dragAndDrop && 'sr-only',
          )}
          id={filesTitleId}
        >
          Vybrané súbory
        </FilesHeading>
        <ul className="flex flex-col gap-[10px]">
          {displayedFiles.map((file, index) => {
            const status = file.status ?? 'selected'
            const statusId = `${inputId}-file-${index}-status`
            const itemErrorId = status === 'error' && file.error ? `${inputId}-file-${index}-error` : undefined
            const progress = Math.max(0, Math.min(100, file.progress ?? 0))
            const statusText =
              status === 'uploading'
                ? `Nahrávanie súboru ${file.name} prebieha. Priebeh nahrávania je ${progress} %.`
                : status === 'error'
                  ? `Súbor ${file.name} sa nepodarilo nahrať.`
                  : status === 'success' ? `Súbor ${file.name} bol úspešne nahraný.`
                    : `Súbor ${file.name} bol vybraný.`

            return (
              <li
                aria-busy={status === 'uploading' || undefined}
                aria-describedby={[statusId, itemErrorId].filter(Boolean).join(' ')}
                className={cn(
                  'grid min-h-[49px] grid-cols-[minmax(0,1fr)_49px] items-center gap-x-[10px] rounded-[5px] bg-surface py-0 pr-0 pl-[10px] ring-1 ring-inset',
                  'sm:grid-cols-[minmax(0,1fr)_auto_49px] sm:gap-x-[10px]',
                  status === 'error' ? 'ring-error' : 'ring-border',
                )}
                key={fileKey(file, index)}
              >
                <span className="sr-only" id={statusId}>
                  {statusText}
                </span>
                <p className="col-start-1 row-start-1 flex min-w-0 items-center gap-[10px] break-words text-[19px] leading-7 text-foreground">
                  {status === 'uploading' ? (
                    <MaterialIcon name="upload" aria-hidden="true" className="size-6 shrink-0 text-foreground-muted" />
                  ) : status === 'error' ? (
                    <FieldErrorIcon className="size-6 shrink-0 text-error" />
                  ) : status === 'selected' ? (
                    <MaterialIcon name="file" aria-hidden="true" className="size-6 shrink-0 text-foreground-soft" />
                  ) : (
                    <MaterialIcon name="checkCircle" aria-hidden="true" className="size-6 shrink-0 text-success" />
                  )}
                  <span className="min-w-0 break-words">{file.name}</span>
                </p>
                <div className="col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1 sm:mr-5 sm:flex sm:items-center sm:justify-end">
                  {status === 'uploading' ? (
                    <div className="flex w-full min-w-0 items-center gap-[10px] sm:w-[180px]">
                      <span className="sr-only" id={`${inputId}-file-${index}-progress-label`}>
                        Priebeh nahrávania súboru {file.name}
                      </span>
                      <div className="flex h-4 min-w-0 flex-1 items-center rounded-[10px] border border-primary-dark p-[3px]">
                        <progress
                          aria-labelledby={`${inputId}-file-${index}-progress-label`}
                          aria-valuetext={`${progress}%`}
                          className="block h-full w-full appearance-none overflow-hidden rounded-lg [&::-moz-progress-bar]:rounded-lg [&::-moz-progress-bar]:bg-primary-dark [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-primary-dark"
                          max={100}
                          value={progress}
                        >
                          {progress}%
                        </progress>
                      </div>
                      <span className="shrink-0 text-[16px] leading-6 whitespace-nowrap">{progress}%</span>
                    </div>
                  ) : status === 'error' ? (
                    <p className="min-w-0 break-words text-[16px] leading-6 text-error sm:text-right" id={itemErrorId}>
                      <span className="sr-only">Chyba: </span>
                      {file.error ?? 'Nepodarilo sa nahrať súbor.'}
                    </p>
                  ) : (
                    <span className="text-[16px] leading-6 whitespace-nowrap text-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </div>
                <div className="col-start-2 row-start-1 flex size-[49px] items-center justify-center sm:col-start-3">
                  <button
                    aria-label={`Odstrániť súbor ${file.name}`}
                    className={cn(
                      'inline-flex size-[49px] items-center justify-center rounded-[5px]',
                      status === 'error'
                        ? 'text-error hover:ring-[5px] hover:ring-foreground-muted active:bg-surface-error'
                        : 'text-link hover:ring-[5px] hover:ring-foreground-muted active:bg-surface-primary',
                      'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
                    )}
                    disabled={disabled}
                    onClick={() => removeFile(file, index)}
                    type="button"
                  >
                    <MaterialIcon name="close" aria-hidden="true" className="size-[25px]" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    ) : null

    return (
      <div className={cn('w-full', className)}>
        <div aria-atomic="true" aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <FieldError id={`${inputId}-validation`} prefix={validationError ? 'Chyba: ' : ''} role="alert">{validationError}</FieldError>
        <div
          aria-describedby={describedBy}
          aria-labelledby={titleTextId}
          className={cn(!dragAndDrop && error && 'border-l-[5px] border-error pl-[15px]')}
          role="region"
        >
          <Heading
            className={cn(
              'text-[20px] leading-[26px] font-bold text-foreground sm:text-[24px] sm:leading-[35px]',
              hint ? (dragAndDrop ? 'mb-[10px]' : 'mb-0') : 'mb-[15px] sm:mb-5',
            )}
            id={titleId}
          >
            <FieldLabelText
              optional={optional}
              optionalText={optionalText}
              required={required}
              requiredIndicator={requiredIndicator}
              textId={titleTextId}
              tooltip={tooltip}
            >
              {label}
              {!dragAndDrop && required && requiredIndicator !== 'text' ? (
                <span className="sr-only"> (povinné pole)</span>
              ) : null}
            </FieldLabelText>
          </Heading>
          {hint ? (
            <FieldHint className="mb-[15px] text-[16px] leading-6 sm:mb-5 sm:text-[19px] sm:leading-7" id={hintId}>
              {hint}
            </FieldHint>
          ) : null}

          <input
            {...inputProps}
            accept={accept}
            aria-describedby={describedBy}
            aria-invalid={error || validationError ? true : inputProps['aria-invalid']}
            aria-labelledby={titleTextId}
            className={cn('peer sr-only', inputClassName)}
            disabled={disabled}
            id={inputId}
            multiple={multiple}
            name={name}
            onChange={handleChange}
            ref={(node) => {
              inputRef.current = node
              if (typeof forwardedRef === 'function') forwardedRef(node)
              else if (forwardedRef) forwardedRef.current = node
            }}
            required={required && !displayedFiles.some((item) => item.file || item.status === 'success')}
            onInvalid={(event) => {
              inputProps.onInvalid?.(event)
              if (!dragAndDrop && !event.defaultPrevented) {
                event.preventDefault()
                compactButtonRef.current?.focus()
                setValidationError('Vyberte súbor.')
              }
            }}
            tabIndex={dragAndDrop ? undefined : -1}
            type="file"
          />

          {dragAndDrop ? (
            <label
              className={cn(
                'group flex flex-col items-center gap-[10px] rounded-[10px] border-2 bg-surface px-[13px] py-[18px] text-center transition-[box-shadow,background-color] duration-150 sm:px-[18px] sm:py-[28px]',
                'peer-focus:outline-solid peer-focus:outline-[3px] peer-focus:outline-offset-2 peer-focus:outline-focus',
                disabled
                  ? 'cursor-not-allowed border-border text-foreground-muted'
                  : 'cursor-pointer border-foreground-muted text-primary-dark hover:bg-surface-primary hover:ring-[5px] hover:ring-foreground-muted',
                dragging && !disabled && 'bg-surface-primary ring-[5px] ring-foreground-muted',
                error && 'border-error',
              )}
              htmlFor={inputId}
              onDragEnter={(event) => {
                event.preventDefault()
                if (!disabled) setDragging(true)
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false)
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <MaterialIcon name="cloudUpload" aria-hidden="true" className="size-10 shrink-0" />
              <span className="block">
                <span className="block text-[19px] leading-6 font-bold sm:text-[20px] sm:leading-[26px]" id={subtitleId}>
                  {subtitle}
                </span>
                <span className="block text-[16px] leading-6 sm:text-[19px] sm:leading-7">{formatsInfo}</span>
              </span>
              <span
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  disabled
                    ? 'border-disabled text-disabled'
                    : 'group-hover:underline group-active:bg-surface-primary',
                )}
              >
                <MaterialIcon name="add" aria-hidden="true" className="size-[25px] shrink-0" />
                <span>{resolvedButtonLabel}</span>
                <span className="sr-only"> pre pole {label}</span>
              </span>
            </label>
          ) : (
            <div className="flex flex-col gap-[15px] sm:gap-5">
              {fileList}
              {error ? (
                <FieldError className="font-bold" id={errorId}>
                  {error}
                </FieldError>
              ) : null}
              <div className="flex flex-col gap-[15px] sm:flex-row sm:items-center sm:gap-5">
                <button
                  aria-describedby={describedBy}
                  className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'self-start')}
                  disabled={disabled}
                  ref={compactButtonRef}
                  onClick={() => inputRef.current?.click()}
                  type="button"
                >
                  <MaterialIcon name="add" aria-hidden="true" className="size-[25px] shrink-0" />
                  <span>{resolvedButtonLabel}</span>
                  <span className="sr-only">
                    {' '}
                    pre pole {label}
                    {required ? ' (povinné pole)' : null}
                  </span>
                </button>
                <p
                  className={cn('text-[16px] leading-6 sm:text-[19px] sm:leading-7', disabled ? 'text-foreground-muted' : 'text-foreground')}
                  id={selectionStatusId}
                >
                  {selectionText}
                </p>
              </div>
              <div className="text-[16px] leading-6 text-foreground-muted sm:text-[19px] sm:leading-7">{formatsInfo}</div>
            </div>
          )}

          {dragAndDrop ? fileList : null}

          {dragAndDrop && error ? (
            <FieldError className="mt-[10px]" id={errorId}>
              {error}
            </FieldError>
          ) : null}
        </div>
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'
