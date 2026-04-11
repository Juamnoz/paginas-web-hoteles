import { NextRequest } from "next/server";

export function isCronAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev: no secret set, allow
  return auth === `Bearer ${secret}`;
}
