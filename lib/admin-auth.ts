import crypto from "crypto"

export const ADMIN_COOKIE = "timehouse_admin"

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123"
}

export function makeSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function isValidSessionToken(token: string | undefined): boolean {
  return Boolean(token)
}
