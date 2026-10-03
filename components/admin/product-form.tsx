"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import type { Product } from "@/lib/types"
import {
  Field,
  TextInput,
  TextArea,
} from "@/components/ui/field"

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

/*
 * Firestore document field limit is about 1MB.
 * Keep image safely below that limit.
 */
const MAX_IMAGE_BYTES = 700_000

function dataUrlSize(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || ""
  return Math.floor((base64.length * 3) / 4)
}

async function compressImage(
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = document.createElement("img")

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let width = img.naturalWidth
      let height = img.naturalHeight

      /*
       * Resize large images first.
       */
      const MAX_WIDTH = 1400
      const MAX_HEIGHT = 1400

      if (
        width > MAX_WIDTH ||
        height > MAX_HEIGHT
      ) {
        const scale = Math.min(
          MAX_WIDTH / width,
          MAX_HEIGHT / height,
        )

        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }

      const canvas =
        document.createElement("canvas")

      let quality = 0.82
      let result = ""

      /*
       * Try multiple times until the image is
       * comfortably below Firestore's limit.
       */
      for (let attempt = 0; attempt < 8; attempt++) {
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(
            new Error(
              "Could not process image",
            ),
          )
          return
        }

        // White background for JPEG conversion.
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(
          0,
          0,
          width,
          height,
        )

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height,
        )

        result = canvas.toDataURL(
          "image/jpeg",
          quality,
        )

        const size = dataUrlSize(result)

        if (size <= MAX_IMAGE_BYTES) {
          resolve(result)
          return
        }

        /*
         * Reduce quality first.
         */
        quality -= 0.08

        /*
         * If quality gets low, also reduce dimensions.
         */
        if (quality < 0.4) {
          width = Math.round(width * 0.8)
          height = Math.round(height * 0.8)
          quality = 0.72
        }
      }

      /*
       * Final safety check.
       */
      if (
        result &&
        dataUrlSize(result) <= MAX_IMAGE_BYTES
      ) {
        resolve(result)
      } else {
        reject(
          new Error(
            "Image could not be compressed enough",
          ),
        )
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(
        new Error("Invalid image file"),
      )
    }

    img.src = objectUrl
  })
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
  const toast = (
    message: string,
    _type?: "success" | "error" | "info",
  ) => {
    console.log(message)
  }

  const fileRef =
    useRef<HTMLInputElement>(null)

  const [draft, setDraft] = useState<Draft>(
    initial
      ? { ...initial }
      : emptyDraft,
  )

  const [compressing, setCompressing] =
    useState(false)

  function set<K extends keyof Draft>(
    key: K,
    value: Draft[K],
  ) {
    setDraft((d) => ({
      ...d,
      [key]: value,
    }))
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast(
        "Please select an image file",
        "error",
      )
      return
    }

    setCompressing(true)

    try {
      const compressed =
        await compressImage(file)

      const size = dataUrlSize(compressed)

      if (size > MAX_IMAGE_BYTES) {
        toast(
          "Image is still too large. Please choose another image.",
          "error",
        )
        return
      }

      set("image", compressed)

      toast(
        "Image compressed successfully",
        "success",
      )
    } catch (error) {
      console.error(
        "Image compression error:",
        error,
      )

      toast(
        "Could not process this image",
        "error",
      )
    } finally {
      setCompressing(false)
    }
  }

  async function submit() {
    if (!draft.name.trim()) {
      toast(
        "Product name is required",
        "error",
      )
      return
    }

    if (draft.price <= 0) {
      toast(
        "Enter a valid price",
        "error",
      )
      return
    }

    if (!draft.image) {
      toast(
        "Add a product image",
        "error",
      )
      return
    }

    if (compressing) {
      toast(
        "Please wait for image processing",
        "info",
      )
      return
    }

    let finalImage = draft.image

    /*
     * Safety check for existing base64 images.
     * This is useful when editing an old product.
     */
    if (
      finalImage.startsWith("data:") &&
      dataUrlSize(finalImage) >
        MAX_IMAGE_BYTES
    ) {
      toast(
        "This image is too large. Please upload it again.",
        "error",
      )
      return
    }

    onSubmit({
      ...draft,
      image: finalImage,
      name: draft.name.trim(),
      brand:
        draft.brand?.trim() ||
        undefined,
      description:
        draft.description.trim(),
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
                  src={
                    draft.image ||
                    "/placeholder.svg"
                  }
                  alt="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    set("image", "")
                  }
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
              disabled={compressing}
              onClick={() =>
                fileRef.current?.click()
              }
              className="w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground disabled:opacity-50"
            >
              {compressing
                ? "Compressing image..."
                : "Upload from device"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0]

                if (file) {
                  void handleFile(file)
                }

                /*
                 * Allow selecting the same image again.
                 */
                e.currentTarget.value = ""
              }}
            />

            <TextInput
              value={
                draft.image.startsWith(
                  "data:",
                )
                  ? ""
                  : draft.image
              }
              onChange={(e) =>
                set(
                  "image",
                  e.target.value,
                )
              }
              placeholder="or paste image URL"
              className="text-xs"
            />
          </div>
        </div>

        <p className="mt-1 text-[10px] text-muted-foreground">
          Uploaded images are automatically compressed
          for faster loading.
        </p>
      </div>

      <Field
        label="Product Name"
        htmlFor="p-name"
      >
        <TextInput
          id="p-name"
          value={draft.name}
          onChange={(e) =>
            set(
              "name",
              e.target.value,
            )
          }
          placeholder="e.g. Chrono Noir Automatic"
        />
      </Field>

      <Field
        label="Brand"
        htmlFor="p-brand"
      >
        <TextInput
          id="p-brand"
          value={draft.brand ?? ""}
          onChange={(e) =>
            set(
              "brand",
              e.target.value,
            )
          }
          placeholder="e.g. Aurelia"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Price (INR)"
          htmlFor="p-price"
        >
          <TextInput
            id="p-price"
            inputMode="numeric"
            value={
              draft.price || ""
            }
            onChange={(e) =>
              set(
                "price",
                Number(
                  e.target.value.replace(
                    /\D/g,
                    "",
                  ),
                ),
              )
            }
            placeholder="0"
          />
        </Field>

        <Field
          label="Discount (%)"
          htmlFor="p-discount"
        >
          <TextInput
            id="p-discount"
            inputMode="numeric"
            value={
              draft.discount || ""
            }
            onChange={(e) =>
              set(
                "discount",
                Math.min(
                  100,
                  Number(
                    e.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  ),
                ),
              )
            }
            placeholder="0"
          />
        </Field>
      </div>

      <Field
        label="Stock Quantity"
        htmlFor="p-stock"
      >
        <TextInput
          id="p-stock"
          inputMode="numeric"
          value={
            draft.stock || ""
          }
          onChange={(e) =>
            set(
              "stock",
              Number(
                e.target.value.replace(
                  /\D/g,
                  "",
                ),
              ),
            )
          }
          placeholder="0"
        />
      </Field>

      <Field
        label="Description"
        htmlFor="p-desc"
      >
        <TextArea
          id="p-desc"
          value={draft.description}
          onChange={(e) =>
            set(
              "description",
              e.target.value,
            )
          }
          placeholder="Describe the timepiece..."
          rows={4}
        />
      </Field>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => void submit()}
          disabled={compressing}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {compressing
            ? "Processing..."
            : initial
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </div>
  )
}
