// Arquivo: app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Função que lida com requisições POST
export async function POST(req) {
  // Extrai os dados do corpo da requisição
  const { name, email, phone, subject, category, message } = await req.json();

  // Validação no backend para garantir que os dados essenciais estão presentes
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { success: false, message: 'Campos obrigatórios ausentes.' },
      { status: 400 }
    );
  }

  // Configura o "transporter" do Nodemailer usando variáveis de ambiente
  // Isso protege suas credenciais
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true, // true para a porta 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER, // Seu e-mail de envio
      pass: process.env.EMAIL_PASS, // Sua senha de aplicativo
    },
  });

  try {
    // Tenta enviar o e-mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Remetente
      to: 'pharmax.l2024@gmail.com', // << MUDE AQUI para o seu e-mail
      replyTo: email, // Permite responder diretamente para o e-mail do usuário
      subject: `[Contato Site] - ${subject}`, // Assunto do e-mail
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Nova Mensagem do Formulário de Contato</h2>
          <p>Você recebeu uma nova mensagem através do formulário do seu site.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Categoria:</strong> ${category}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <h3>Mensagem:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 0.9em; color: #888;">Este e-mail foi enviado automaticamente pelo site.</p>
        </div>
      `,
    });

    // Se o e-mail foi enviado, retorna uma resposta de sucesso
    return NextResponse.json(
      { success: true, message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no servidor ao enviar o e-mail:', error);
    // Em caso de erro, retorna uma mensagem de erro
    return NextResponse.json(
      { success: false, message: 'Falha ao enviar a mensagem.' },
      { status: 500 }
    );
  }
}