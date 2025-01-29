import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check if the request has a Referer header
    const referer = request.headers.get('referer');

    // If there's no Referer, it's likely a direct access
    if (!referer) {
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error',
        },
        {
          status: 500,
        },
      );
    }

    // If there is a Referer, check if it's from the same origin
    const refererUrl = new URL(referer);
    if (refererUrl.origin !== request.nextUrl.origin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Cross-origin API access is not allowed',
        }),
        { status: 403, headers: { 'content-type': 'application/json' } },
      );
    }

    // If we reach here, it's a same-origin programmatic request, so we allow it
  }
}

export const config = {
  matcher: '/api/:path*',
};
