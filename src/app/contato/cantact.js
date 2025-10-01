// src/pages/api/contact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Permite apenas requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { name, email, phone, subject, category, message } = req.body;

  // Validação simples no backend para segurança
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios faltando' });
  }

  // Configuração do Nodemailer (transportador de e-mail)
  // IMPORTANTE: Use variáveis de ambiente para suas credenciais!
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Exemplo para Gmail
    port: 465,
    secure: true, // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_USER, // Seu e-mail
      pass: process.env.EMAIL_PASS, // Sua senha de aplicativo
    },
  });

  try {
    // Detalhes do E-mail
    const mailOptions = {
      from: `"Contato Site" <${process.env.EMAIL_USER}>`, // Seu e-mail
      to: process.env.EMAIL_USER, // O e-mail que receberá a mensagem
      replyTo: email, // Para responder diretamente ao usuário que enviou
      subject: `[Contato - ${category}] ${subject}`,
      text: `
        Você recebeu uma nova mensagem de contato:
        
        Nome: ${name}
        E-mail: ${email}
        Telefone: ${phone || 'Não informado'}
        Categoria: ${category}
        
        Mensagem:
        ${message}
      `,
      html: `
        <h2>Nova Mensagem de Contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Categoria:</strong> ${category}</p>
        <hr>
        <h3>Mensagem:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ success: false, message: 'Erro ao enviar a mensagem.' });
  }
}