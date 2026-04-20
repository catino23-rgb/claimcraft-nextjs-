import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     * - _next/static         (bundler assets)
     * - _next/image          (optimized images)
     * - favicon.ico
     * - api/*                (route handlers manage their own auth)
     * - any file with a recognized static extension
     */
    "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf|otf|map)$).*)",
  ],
};
