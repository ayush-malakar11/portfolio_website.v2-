import { useState, useCallback, useRef, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import emailjs from '@emailjs/browser'
import { useFadeIn } from '../hooks/useFadeIn'

// ─────────────────────────────────────────────────────────────
// 🔧 CONFIG
// ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'
const CLOUDINARY_CLOUD    = 'YOUR_CLOUD_NAME'
const CLOUDINARY_PRESET   = 'YOUR_UPLOAD_PRESET'

const MAX_FILES = 5
const MAX_SIZE  = 20 * 1024 * 1024

// ── Validation rules ─────────────────────────────────────────
const RULES = {
  user_name: (v) => {
    if (!v.trim())                          return 'Name is required'
    if (v.trim().length < 2)               return 'Name must be at least 2 characters'
    if (v.trim().length > 50)              return 'Name must be under 50 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Name can only contain letters, spaces, hyphens or apostrophes'
    return ''
  },
  user_phone: (v) => {
    if (!v.trim())                          return 'Phone number is required'
    const digits = v.replace(/\D/g, '')
    if (digits.length < 10)                return 'Enter a valid phone number (min 10 digits)'
    if (digits.length > 15)                return 'Phone number is too long'
    return ''
  },
  user_email: (v) => {
    if (!v.trim())                          return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
    return ''
  },
  message: (v) => {
    if (!v.trim())                          return 'Message is required'
    if (v.trim().length < 10)              return 'Message must be at least 10 characters'
    if (v.trim().length > 1000)            return 'Message must be under 1000 characters'
    return ''
  },
}

function validate(form) {
  return Object.fromEntries(
    Object.entries(RULES).map(([k, fn]) => [k, fn(form[k])])
  )
}

// ── Helpers ───────────────────────────────────────────────────
function formatBytes(b) {
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / (1024 * 1024)).toFixed(1) + ' MB'
}
function fileIcon(type) {
  if (type.startsWith('image/')) return '🖼️'
  if (type.startsWith('video/')) return '🎬'
  if (type.includes('pdf'))      return '📄'
  if (type.includes('zip') || type.includes('rar')) return '🗜️'
  return '📎'
}
async function uploadToCloudinary(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`,
    { method: 'POST', body: fd }
  )
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).secure_url
}

// ── Static data ───────────────────────────────────────────────
const INFO = [
  { icon: '📧', label: 'Email',    value: 'ayushmalaka385@gmail.com'     },
  { icon: '📞', label: 'Phone',    value: '+91 6263005099'               },
  { icon: '📍', label: 'Location', value: 'Ahmedabad, Gujarat (Current)' },
  { icon: '🏠', label: 'Native',   value: 'Indore, Madhya Pradesh'       },
]
const SOCIAL = [
  { href: 'https://linkedin.com/in/ayush-malakar385', icon: 'fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://github.com/ayush-malakar11',       icon: 'fa-github',      label: 'GitHub'   },
]

// ── InfoCard ──────────────────────────────────────────────────
const InfoCard = memo(({ icon, label, value }) => (
  <div className="flex gap-4 items-start">
    <span className="text-xl mt-0.5 flex-shrink-0 w-8 text-center">{icon}</span>
    <div>
      <p className="text-xs text-muted uppercase tracking-widest font-medium">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  </div>
))
InfoCard.displayName = 'InfoCard'

// ── FilePreview ───────────────────────────────────────────────
const FilePreview = memo(({ file, onRemove, uploading }) => {
  const isImage = file.type.startsWith('image/')
  return (
    <div className="flex items-center gap-3 bg-bg border border-white/10 rounded-xl p-3
                    group hover:border-primary/40 transition-all duration-200">
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center
                      justify-center bg-white/5 text-xl">
        {isImage
          ? <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
          : fileIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{file.name}</p>
        <p className="text-xs text-muted mt-0.5">{formatBytes(file.size)}</p>
      </div>
      {uploading
        ? <span className="w-4 h-4 border-2 border-white/20 border-t-primary rounded-full animate-spin flex-shrink-0" />
        : (
          <button type="button" onClick={() => onRemove(file.name)}
            className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-muted
                       hover:bg-red-500/20 hover:text-red-400 transition-all duration-200
                       opacity-0 group-hover:opacity-100 flex-shrink-0">
            <i className="fas fa-times text-xs" />
          </button>
        )}
    </div>
  )
})
FilePreview.displayName = 'FilePreview'

// ── DropZone ──────────────────────────────────────────────────
function DropZone({ files, onDrop, onRemove, uploading }) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop, maxFiles: MAX_FILES, maxSize: MAX_SIZE,
    accept: { 'image/*': [], 'video/*': [], 'application/pdf': [],
              'application/zip': [], 'application/x-rar-compressed': [] },
  })
  const hasError = fileRejections.length > 0

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted">
        Attachments
        <span className="ml-2 text-white/30 font-normal">
          (images, videos, PDFs, ZIPs — max {MAX_FILES} files, 20 MB each)
        </span>
      </label>
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
                    transition-all duration-300 outline-none
                    ${isDragActive  ? 'border-primary bg-primary/10 scale-[1.01]'
                    : hasError      ? 'border-red-500/50 bg-red-900/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className={`text-3xl transition-transform duration-300 ${isDragActive ? 'scale-125' : ''}`}>
            {isDragActive ? '📂' : '📁'}
          </div>
          <p className="text-sm font-medium text-white/70">
            {isDragActive ? 'Drop files here!' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-muted">or click to browse</p>
          <div className="flex gap-2 mt-1 flex-wrap justify-center">
            {['🖼️ Images', '🎬 Videos', '📄 PDFs', '🗜️ ZIPs'].map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted">{t}</span>
            ))}
          </div>
        </div>
      </div>
      {hasError && (
        <p className="text-xs text-red-400">⚠️ {fileRejections[0].errors[0].message}</p>
      )}
      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-xs text-muted">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
          {files.map((f) => (
            <FilePreview key={f.name} file={f} onRemove={onRemove} uploading={uploading} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Field with validation UI ──────────────────────────────────
function Field({ label, name, type, placeholder, value, onChange, onBlur, error, touched, required, hint }) {
  const hasError = touched && error
  const isValid  = touched && !error && value.trim()
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
        {hint && !hasError && (
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{hint}</span>
        )}
      </div>
      <div className="relative">
        <input
          type={type} name={name} placeholder={placeholder}
          value={value} onChange={onChange} onBlur={onBlur}
          autoComplete="off"
          className={`form-input pr-9 ${hasError ? 'error' : isValid ? 'valid' : ''}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
          {hasError ? '❌' : isValid ? '✅' : ''}
        </span>
      </div>
      {hasError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <i className="fas fa-exclamation-circle text-[10px]" /> {error}
        </p>
      )}
    </div>
  )
}

function TextareaField({ label, name, placeholder, value, onChange, onBlur, error, touched, required }) {
  const hasError  = touched && error
  const isValid   = touched && !error && value.trim()
  const charCount = value.length
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted">
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
        <span className={`text-xs ${charCount > 900 ? 'text-red-400' : charCount > 700 ? 'text-yellow-400' : 'text-white/20'}`}>
          {charCount}/1000
        </span>
      </div>
      <textarea
        name={name} placeholder={placeholder} rows={4}
        value={value} onChange={onChange} onBlur={onBlur}
        autoComplete="off"
        className={`form-input resize-none ${hasError ? 'error' : isValid ? 'valid' : ''}`}
      />
      {hasError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <i className="fas fa-exclamation-circle text-[10px]" /> {error}
        </p>
      )}
    </div>
  )
}

// ── Main Contact ──────────────────────────────────────────────
const INIT_FORM    = { user_name: '', user_phone: '', user_email: '', message: '' }
const INIT_TOUCHED = { user_name: false, user_phone: false, user_email: false, message: false }

export default function Contact() {
  const formRef                         = useRef(null)
  const [form, setForm]                 = useState(INIT_FORM)
  const [touched, setTouched]           = useState(INIT_TOUCHED)
  const [files, setFiles]               = useState([])
  const [status, setStatus]             = useState('idle')
  const [uploadProgress, setUploadProgress] = useState('')
  const [ref, visible]                  = useFadeIn()

  const errors   = validate(form)
  const isFormValid = Object.values(errors).every((e) => !e)

  // Mark field as touched on blur
  const handleBlur = useCallback((e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }, [])

  const handleChange = useCallback((e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }, [])

  const onDrop = useCallback((accepted) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      return [...prev, ...accepted.filter((f) => !existing.has(f.name))].slice(0, MAX_FILES)
    })
  }, [])

  const removeFile = useCallback((name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Touch all fields to show any remaining errors
    setTouched({ user_name: true, user_phone: true, user_email: true, message: true })
    if (!isFormValid) return

    // Upload files
    let attachmentLinks = ''
    if (files.length > 0) {
      setStatus('uploading')
      try {
        const urls = []
        for (let i = 0; i < files.length; i++) {
          setUploadProgress(`Uploading file ${i + 1} of ${files.length}...`)
          urls.push(`${files[i].name}: ${await uploadToCloudinary(files[i])}`)
        }
        attachmentLinks = '\n\nAttachments:\n' + urls.join('\n')
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
        return
      }
    }

    // Send email
    setStatus('sending')
    setUploadProgress('')
    const hiddenInput       = document.createElement('input')
    hiddenInput.type        = 'hidden'
    hiddenInput.name        = 'attachments'
    hiddenInput.value       = attachmentLinks || 'No attachments'
    formRef.current.appendChild(hiddenInput)

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      setStatus('success')
      setForm(INIT_FORM)
      setTouched(INIT_TOUCHED)
      setFiles([])
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    } finally {
      hiddenInput.remove()
    }
  }, [files, isFormValid])

  const isBusy = status === 'uploading' || status === 'sending'

  return (
    <div className="page-wrapper">
      <div className="text-center mb-16">
        <h1 className="section-title">Contact <span>Me</span></h1>
        <p className="section-sub">Open to on-site, hybrid, and remote roles. Feel free to reach out!</p>
      </div>

      <div
        ref={ref}
        className={`grid grid-cols-1 lg:grid-cols-5 gap-12 items-start transition-all duration-700
          ${visible ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
      >
        {/* ── Info panel ── */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Let's Talk</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              I'm currently working at Srashtasoft, Ahmedabad and open to exciting new opportunities.
              Drop me a message and I'll get back to you soon.
            </p>
            <div className="space-y-5">
              {INFO.map((i) => <InfoCard key={i.label} {...i} />)}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Find me on</p>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, icon, label }) => (
                <a key={icon} href={href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                             transition-all duration-300 hover:border-primary hover:text-primary"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <i className={`fab ${icon}`} /><span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="section-card p-4 border-green-500/30 bg-green-900/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Available for new opportunities</span>
            </div>
            <p className="text-muted text-xs mt-1 ml-4">On-site · Hybrid · Remote</p>
          </div>
        </div>

        {/* ── Form ── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-3 section-card p-8 space-y-5"
        >
          {/* Status banners */}
          {status === 'success' && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-500/40
                            text-green-400 text-sm px-4 py-3 rounded-lg">
              ✅ Message sent! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40
                            text-red-400 text-sm px-4 py-3 rounded-lg">
              ❌ Something went wrong. Please email me at ayushmalaka385@gmail.com
            </div>
          )}
          {(status === 'uploading' || status === 'sending') && (
            <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-500/30
                            text-blue-300 text-sm px-4 py-3 rounded-lg">
              <span className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin flex-shrink-0" />
              {status === 'uploading' ? uploadProgress : 'Sending your message...'}
            </div>
          )}

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Your Name" name="user_name" type="text" placeholder="John Doe"
              value={form.user_name} onChange={handleChange} onBlur={handleBlur}
              error={errors.user_name} touched={touched.user_name} required
            />
            <Field
              label="Phone Number" name="user_phone" type="tel" placeholder="+91 XXXXX XXXXX"
              value={form.user_phone} onChange={handleChange} onBlur={handleBlur}
              error={errors.user_phone} touched={touched.user_phone} required
              hint="10–15 digits"
            />
          </div>
          <Field
            label="Email Address" name="user_email" type="email" placeholder="john@example.com"
            value={form.user_email} onChange={handleChange} onBlur={handleBlur}
            error={errors.user_email} touched={touched.user_email} required
          />
          <TextareaField
            label="Message" name="message" placeholder="Write your message here... (min 10 characters)"
            value={form.message} onChange={handleChange} onBlur={handleBlur}
            error={errors.message} touched={touched.message} required
          />

          <DropZone files={files} onDrop={onDrop} onRemove={removeFile} uploading={status === 'uploading'} />

          <button
            type="submit"
            disabled={isBusy}
            className="btn-primary w-full py-3.5 text-sm rounded-xl
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isBusy ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {status === 'uploading' ? 'Uploading files...' : 'Sending...'}
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane text-xs" />
                Send Message{files.length > 0 ? ` + ${files.length} file${files.length > 1 ? 's' : ''}` : ''}
              </>
            )}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>
            Fields marked with <span className="text-primary">*</span> are required
          </p>
        </form>
      </div>
    </div>
  )
}
