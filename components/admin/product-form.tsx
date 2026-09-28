"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import type { Product } from "@/lib/types"
import { Field, TextInput, TextArea } from "@/components/ui/field"

type Draft = Omit<Product, "id">

const emptyDraft: Draft = {
  name: "",
  brand: "",
  price: 0,
  discount: 0,
  description: "",
  stock: 0,
  image: "",
  gallery: [],
}

export function ProductForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Product
  onSubmit: (draft: Draft) => void
  onCancel: () => void
}) {
  const toast = (message: string, _type?: "success" | "error" | "info") => {
    console.log(message)
  }

  const fileRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState<Draft>(
    initial ? { ...initial } : emptyDraft,
  )

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function handleFile(file: File) {
    if (file.size > 2_000_000) {
      toast("Image must be under 2MB", "error")
      return
    }

    const reader = new FileReader()
    reader.onload = () => set("image", reader.result as string)
    reader.readAsDataURL(file)
  }

  function submit() {
    if (!draft.name.trim()) {
      toast("Product name is required", "error")
      return
    }

    if (draft.price <= 0) {
      toast("Enter a valid price", "error")
      return
    }

    if (!draft.image) {
      toast("Add a product image", "error")
      return
    }

    onSubmit({
      ...draft,
      name: draft.name.trim(),
      brand: draft.brand?.trim() || undefined,
      description: draft.description.trim(),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          Product Image
        </span>

        <div className="flex items-center gap-3">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/40">
            {draft.image ? (
              <>
                <Image
                  src={draft.image || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />

                <button
                  onClick={() => set("image", "")}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/80 text-foreground"
                  aria-label="Remove image"
                >
                  <X className="size-3" />
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Upload className="size-6" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground"
            >
              Upload from device
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />

            <TextInput
              value={draft.image.startsWith("data:") ? "" : draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="or paste image URL"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      <Field label="Product Name" htmlFor="p-name">
        <TextInput
          id="p-name"
          value={draft.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Chrono Noir Automatic"
        />
      </Field>

      <Field label="Brand" htmlFor="p-brand">
        <TextInput
          id="p-brand"
          value={draft.brand ?? ""}
          onChange={(e) => set("brand", e.target.value)}
          placeholder="e.g. Aurelia"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (INR)" htmlFor="p-price">
          <TextInput
            id="p-price"
            inputMode="numeric"
            value={draft.price || ""}
            onChange={(e) =>
              set("price", Number(e.target.value.replace(/\D/g, "")))
            }
            placeholder="0"
          />
        </Field>

        <Field label="Discount (%)" htmlFor="p-discount">
          <TextInput
            id="p-discount"
            inputMode="numeric"
            value={draft.discount || ""}
            onChange={(e) =>
              set(
                "discount",
                Math.min(100, Number(e.target.value.replace(/\D/g, ""))),
              )
            }
            placeholder="0"
          />
        </Field>
      </div>

      <Field label="Stock Quantity" htmlFor="p-stock">
        <TextInput
          id="p-stock"
          inputMode="numeric"
          value={draft.stock || ""}
          onChange={(e) =>
            set("stock", Number(e.target.value.replace(/\D/g, "")))
          }
          placeholder="0"
        />
      </Field>

      <Field label="Description" htmlFor="p-desc">
        <TextArea
          id="p-desc"
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the timepiece..."
          rows={4}
        />
      </Field>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          {initial ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  )
}
