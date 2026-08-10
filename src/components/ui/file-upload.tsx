import { AlertTriangle, CheckCircle, Upload, X } from 'lucide-react'
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
} from 'react'

import { cn } from '@/lib/utils'

export type FileUploadItem = {
  error?: string
  file?: File
  id?: string
  name: string
  progress?: number
  size?: number
  status?: 'uploading' | 'success' | 'error'
}

export type FileUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'onChange' | 'size' | 'type' | 'value'
> & {
  buttonLabel?: string
  className?: string
  defaultFiles?: FileUploadItem[]
  dragAndDrop?: boolean
  error?: string
  files?: FileUploadItem[]
  hint?: string
  inputClassName?: string
  label?: string
  headingLevel?: 2 | 3 | 4
  maxSizeLabel?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onFilesChange?: (files: FileUploadItem[], selectedFiles?: File[]) => void
  onRemoveFile?: (file: FileUploadItem, index: number) => void
  optional?: boolean
  subtitle?: string
  supportedFormats?: string
}

function formatFileSize(size?: number) {
  if (size === undefined) return undefined
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function fileKey(file: FileUploadItem, index: number) {
  return file.id ?? `${file.name}-${file.size ?? 'unknown'}-${index}`
}

const CloudUploadIcon = () => (
  <svg
    aria-hidden="true"
    className="mx-auto mb-4 h-10 w-10 text-primary-dark"
    fill="none"
    focusable="false"
    viewBox="0 0 40 40"
  >
    <path
      d="M32.25 16.7332C31.1167 10.9832 26.0667 6.6665 20 6.6665C15.1833 6.6665 11 9.39984 8.91667 13.3998C3.9 13.9332 0 18.1832 0 23.3332C0 28.8498 4.48333 33.3332 10 33.3332H31.6667C36.2667 33.3332 40 29.5998 40 24.9998C40 20.5998 36.5833 17.0332 32.25 16.7332ZM23.3333 21.6665V28.3332H16.6667V21.6665H11.6667L20 13.3332L28.3333 21.6665H23.3333Z"
      fill="currentColor"
    />
  </svg>
)

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
      hint = 'Spresnite požiadavku na nahrávaný súbor.',
      headingLevel = 2,
      id,
      inputClassName,
      label = 'Nahrajte súbor',
      maxSizeLabel = '15 MB',
      multiple = true,
      name,
      onChange,
      onFilesChange,
      onRemoveFile,
      optional = false,
      required = false,
      subtitle = 'Nahrajte súbor alebo ho sem presuňte.',
      supportedFormats = 'JPG, PNG, DOC, DOCX, PDF',
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId()
    const inputId = id ?? `file-upload-${generatedId.replace(/:/g, '')}`
    const titleId = `${inputId}-title`
    const hintId = `${inputId}-hint`
    const subtitleId = `${inputId}-subtitle`
    const formatsId = `${inputId}-formats`
    const maxSizeId = `${inputId}-max-size`
    const errorId = error ? `${inputId}-error` : undefined
    const selectionStatusId = !dragAndDrop ? `${inputId}-selection-status` : undefined
    const filesTitleId = `${inputId}-files-title`
    const describedBy = [
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
    const [internalFiles, setInternalFiles] = useState<FileUploadItem[]>(defaultFiles)
    const [dragging, setDragging] = useState(false)
    const [announcement, setAnnouncement] = useState('')
    const displayedFiles = files ?? internalFiles
    const isUploading = displayedFiles.some((file) => file.status === 'uploading')
    const Heading = headingLevel === 3 ? 'h3' : headingLevel === 4 ? 'h4' : 'h2'

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

    const updateFiles = (nextFiles: FileUploadItem[], selectedFiles?: File[]) => {
      if (files === undefined) setInternalFiles(nextFiles)
      onFilesChange?.(nextFiles, selectedFiles)
    }

    const appendFiles = (fileList: FileList | null) => {
      if (!fileList?.length || disabled) return

      const selectedFiles = Array.from(fileList)
      const nextItems = selectedFiles.map<FileUploadItem>((file) => ({
        file,
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        size: file.size,
        status: 'success',
      }))
      const nextFiles = multiple ? [...displayedFiles, ...nextItems] : nextItems.slice(0, 1)

      updateFiles(nextFiles, selectedFiles)
      syncNativeFiles(nextFiles)
      setAnnouncement(
        nextItems.length === 1
          ? `Súbor ${nextItems[0].name} bol vybraný.`
          : `Boli vybrané ${nextItems.length} súbory.`,
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
      const nextFiles = displayedFiles.filter((_, currentIndex) => currentIndex !== index)
      updateFiles(nextFiles)
      syncNativeFiles(nextFiles)
      setAnnouncement(`Súbor ${file.name} bol odstránený.`)
      onRemoveFile?.(file, index)
    }

    const selectionText = displayedFiles.length
      ? displayedFiles.length === 1
        ? 'Vybraný je 1 súbor.'
        : `Vybrané sú ${displayedFiles.length} súbory.`
      : 'Nie je vybraný žiadny súbor.'

    return (
      <div className={cn('w-full', className)}>
        <div aria-atomic="true" aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <div aria-describedby={describedBy} aria-labelledby={titleId} role="region">
          <Heading className="mb-[10px] text-2xl leading-tight font-bold text-foreground" id={titleId}>
            {label}
            {required ? (
              <span aria-hidden="true" className="ml-1 text-warning">
                *
              </span>
            ) : optional ? (
              <span className="ml-1 text-base font-normal text-foreground-muted">
                (nepovinné pole)
              </span>
            ) : null}
          </Heading>
          <p className="mb-5 text-[19px] leading-7 text-foreground-muted" id={hintId}>
            {hint}
          </p>

          {displayedFiles.length ? (
            <section aria-busy={isUploading || undefined} aria-labelledby={filesTitleId} className="mb-5">
              <h3 className="mb-3 text-[20px] leading-7 font-bold text-foreground" id={filesTitleId}>
                Nahrané súbory
              </h3>
              <ul className="space-y-3">
                {displayedFiles.map((file, index) => {
                  const status = file.status ?? 'success'
                  const statusId = `${inputId}-file-${index}-status`
                  const itemErrorId = status === 'error' && file.error ? `${inputId}-file-${index}-error` : undefined
                  const progress = Math.max(0, Math.min(100, file.progress ?? 0))
                  const statusText =
                    status === 'uploading'
                      ? `Nahrávanie súboru ${file.name} prebieha. Priebeh nahrávania je ${progress} %.`
                      : status === 'error'
                        ? `Súbor ${file.name} sa nepodarilo nahrať.`
                        : `Súbor ${file.name} bol úspešne nahraný.`

                  return (
                    <li
                      aria-busy={status === 'uploading' || undefined}
                      aria-describedby={[statusId, itemErrorId].filter(Boolean).join(' ')}
                      className={cn(
                        'grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-x-3 gap-y-2 rounded-[5px] border bg-surface-muted px-4 py-4',
                        'md:grid-cols-[40px_minmax(0,1fr)_minmax(160px,34%)_40px]',
                        status === 'error' ? 'border-warning' : 'border-border',
                      )}
                      key={fileKey(file, index)}
                    >
                      <span className="sr-only" id={statusId}>
                        {statusText}
                      </span>
                      <div className="col-start-1 row-start-1 flex h-10 w-10 items-center justify-center">
                        {status === 'uploading' ? (
                          <Upload aria-hidden="true" className="h-7 w-7 text-primary-dark" />
                        ) : status === 'error' ? (
                          <AlertTriangle aria-hidden="true" className="h-7 w-7 text-warning" />
                        ) : (
                          <CheckCircle aria-hidden="true" className="h-7 w-7 text-success" />
                        )}
                      </div>
                      <p className="col-start-2 row-start-1 min-w-0 break-words text-[19px] leading-7 text-foreground">
                        {file.name}
                      </p>
                      <div className="col-start-2 row-start-2 min-w-0 md:col-start-3 md:row-start-1 md:flex md:items-center md:justify-end">
                        {status === 'uploading' ? (
                          <div className="flex w-full min-w-0 items-center gap-3">
                            <span className="sr-only" id={`${inputId}-file-${index}-progress-label`}>
                              Priebeh nahrávania súboru {file.name}
                            </span>
                            <div className="flex h-4 min-w-0 flex-1 items-center rounded-[10px] border-2 border-primary-dark p-0.5">
                              <progress
                                aria-labelledby={`${inputId}-file-${index}-progress-label`}
                                aria-valuetext={`${progress} %`}
                                className="block h-full w-full overflow-hidden rounded-lg appearance-none [&::-moz-progress-bar]:rounded-lg [&::-moz-progress-bar]:bg-primary-dark [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-primary-dark"
                                max={100}
                                value={progress}
                              >
                                {progress} %
                              </progress>
                            </div>
                            <span className="shrink-0 text-base leading-6 whitespace-nowrap">{progress} %</span>
                          </div>
                        ) : status === 'error' ? (
                          <p className="min-w-0 break-words text-base leading-6 text-warning md:text-right" id={itemErrorId}>
                            <span>Chyba: </span>
                            {file.error ?? 'Nepodarilo sa nahrať súbor.'}
                          </p>
                        ) : (
                          <span className="text-[19px] leading-7 whitespace-nowrap">
                            {formatFileSize(file.size)}
                          </span>
                        )}
                      </div>
                      <div className="col-start-3 row-start-1 flex h-10 w-10 items-center justify-center md:col-start-4">
                        <button
                          aria-label={`Odstrániť súbor ${file.name}`}
                          className={cn(
                            'inline-flex h-10 w-10 items-center justify-center rounded-md',
                            'hover:ring-[4px] hover:ring-foreground-muted active:bg-surface-primary',
                            'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
                            status === 'error' ? 'text-warning' : 'text-primary-dark',
                          )}
                          onClick={() => removeFile(file, index)}
                          type="button"
                        >
                          <X aria-hidden="true" className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          <input
            {...inputProps}
            accept={accept}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            aria-labelledby={titleId}
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
            required={
              required && !displayedFiles.some((item) => item.file)
            }
            tabIndex={dragAndDrop ? undefined : -1}
            type="file"
          />

          {dragAndDrop ? (
            <label
              className={cn(
                'group block rounded-md border-2 border-dashed px-5 py-[30px] text-center text-primary-dark transition-all duration-150',
                'peer-focus:bg-surface-primary peer-focus:outline-solid peer-focus:outline-[3px] peer-focus:outline-offset-2 peer-focus:outline-focus',
                disabled
                  ? 'cursor-not-allowed border-border bg-surface-muted opacity-60'
                  : 'cursor-pointer border-foreground-muted bg-white hover:bg-surface-primary hover:ring-[4px] hover:ring-foreground-muted',
                dragging && !disabled && 'bg-surface-primary ring-[4px] ring-foreground-muted',
                error && 'border-warning',
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
              <CloudUploadIcon />
              <p className="mt-2 text-[20px] leading-[26px] font-bold" id={subtitleId}>
                {subtitle}
              </p>
              <div className="mt-1 space-y-1 text-[19px] leading-7">
                <div id={formatsId}>
                  Podporované formáty: <span className="font-bold">{supportedFormats}</span>
                </div>
                <p id={maxSizeId}>
                  Maximálna veľkosť súboru: <span className="font-bold">{maxSizeLabel}</span>
                </p>
              </div>
              <span className="mt-6 inline-flex items-center justify-center rounded-[5px] border-2 border-primary-dark bg-white px-5 py-3 font-bold text-primary-dark transition-colors duration-150 group-hover:bg-primary-dark group-hover:text-white">
                <Upload aria-hidden="true" className="mr-2 h-5 w-5 shrink-0" />
                <span>{buttonLabel ?? (multiple ? 'Vyberte súbory' : 'Vyberte súbor')}</span>
                <span className="sr-only"> pre pole {label}</span>
              </span>
            </label>
          ) : (
            <div>
              <p className="mb-5 text-[19px] leading-7 text-foreground-muted" id={subtitleId}>
                {subtitle}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  aria-describedby={describedBy}
                  className={cn(
                    'inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] border-2 px-5 py-3 font-bold tracking-wide',
                    'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
                    disabled
                      ? 'cursor-not-allowed border-border bg-white text-border'
                      : 'border-primary-dark bg-white text-primary-dark hover:underline hover:ring-[4px] hover:ring-foreground-muted active:bg-surface-primary',
                  )}
                  disabled={disabled}
                  onClick={() => inputRef.current?.click()}
                  type="button"
                >
                  <Upload aria-hidden="true" className="h-5 w-5" />
                  <span>{buttonLabel ?? (multiple ? 'Vyberte súbory' : 'Vyberte súbor')}</span>
                  <span className="sr-only"> pre pole {label}</span>
                </button>
                <p className="text-base leading-6 text-foreground-muted" id={selectionStatusId}>
                  {selectionText}
                </p>
              </div>
              <div className="mt-3 space-y-1 text-[19px] leading-7 text-foreground-muted">
                <div id={formatsId}>
                  Podporované formáty: <span className="font-bold">{supportedFormats}</span>
                </div>
                <p id={maxSizeId}>
                  Maximálna veľkosť súboru: <span className="font-bold">{maxSizeLabel}</span>
                </p>
              </div>
            </div>
          )}

          {error ? (
            <p className="mt-3 text-[19px] leading-7 text-warning" id={errorId}>
              <span>Chyba: </span>
              {error}
            </p>
          ) : null}
        </div>
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'
