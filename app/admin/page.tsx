e="font-mono text-xs text-foreground">
                        #{o.id}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <PaymentBadge status={o.paymentStatus} />
                  </div>

                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {o.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-xs"
                      >
                        <span className="line-clamp-1 text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="shrink-0 text-foreground">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {o.address.fullName} · +91 {o.address.mobile}
                    </p>
                    <p>
                      {o.address.address}, {o.address.city}, {o.address.state} -{" "}
                      {o.address.pincode}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">
                      {formatINR(o.amount)}
                    </span>
                    <OrderStatusBadge status={o.orderStatus} />
                  </div>

                  <div className="mt-3">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Update Order Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ORDER_STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            updateOrderStatus(o.id, status as OrderStatus)
                            toast(`Order marked ${status}`, "success")
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                            o.orderStatus === status
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-background/70 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-popover p-4 animate-in slide-in-from-bottom">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <ProductForm
              initial={editing ?? undefined}
              onCancel={() => {
                setEditing(null)
                setCreating(false)
              }}
              onSubmit={(draft) => {
                if (editing) {
                  updateProduct({ ...draft, id: editing.id })
                  toast("Product updated", "success")
                } else {
                  addProduct(draft)
                  toast("Product added", "success")
                }
                setEditing(null)
                setCreating(false)
              }}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Trash2 className="size-6" />
            </div>
            <h3 className="mt-3 font-serif text-lg text-foreground">
              Delete product?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {confirmDelete.name} will be permanently removed.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(confirmDelete.id)
                  toast("Product deleted", "info")
                  setConfirmDelete(null)
                }}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground",
      )}
    >
      {children}
    </button>
  )
}
