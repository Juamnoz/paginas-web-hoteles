import { NextRequest, NextResponse } from "next/server";

const SUBDOMAIN_MAP: Record<string, string> = {
  terrabella: "/terrabella",
  pomarosa: "/pomarosa",
  lacasona: "/lacasona",
  infinity: "/infinity",
  polisuite: "/polisuite",
};

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  const path = SUBDOMAIN_MAP[subdomain];

  if (path && !req.nextUrl.pathname.startsWith(path)) {
    const url = req.nextUrl.clone();
    url.pathname = path + (req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
