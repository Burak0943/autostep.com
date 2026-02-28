import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Mantığı diğer dosyadan çağırıyoruz
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Tüm yolları eşleştir ama şunları hariç tut:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public klasöründeki resimler)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}