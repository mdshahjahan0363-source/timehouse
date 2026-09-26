import crypto from "crypto"

// The admin password is read from an environment variable so it can be set in
// Vercel. A development fallback keeps the preview usable before it is set.
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123"
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? getAdminPassword()
}

// Deterministic session token derived from the password + secret. Stored in an
// httpOnly cookie so it is never readable by client JS.
export function makeSessionToken(): string {
  return crypto
    .createHmac("sha256", secret())
    .update(`admin:${getAdminPassword()}`)
    .digest("hex")
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false
  const expected = makeSessionToken()
  return (
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  )
}

export const ADMIN_COOKIE = "aurelia_admin"
