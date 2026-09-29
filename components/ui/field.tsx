import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react"

type FieldProps = {
  label: string
  htmlFor?: string
  children: ReactNode
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary ${props.className ?? ""}`}
    />
  )
}

export function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary ${props.className ?? ""}`}
    />
  )
}
