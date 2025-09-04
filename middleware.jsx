import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Rotas protegidas por tipo de usuário
  const protectedRoutes = {
    '/farmacias': 'admin',
    '/funcionario': 'farmacia',
    '/cliente': 'cliente'
  };

  // Verificar se a rota atual precisa de proteção
  const routeMatch = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  );

  if (routeMatch) {
    const [route, requiredRole] = routeMatch;
    
    // Tentar obter dados do usuário dos cookies
    const userDataCookie = request.cookies.get('userData');
    
    if (!userDataCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(decodeURIComponent(userDataCookie.value));
      if (user.tipo !== requiredRole) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/farmacias/:path*',
    '/funcionario/:path*', 
    '/cliente/:path*'
  ],
};