// app/page.jsx

import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o usuário da rota '/' para '/login'
  redirect('/home');

  // Como o redirecionamento acontece no servidor,
  // nada abaixo será renderizado.
  // Você pode retornar null ou um componente de carregamento.
  return null;
}