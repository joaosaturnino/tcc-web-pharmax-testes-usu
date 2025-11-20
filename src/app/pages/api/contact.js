import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Permite apenas requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const { name, email, phone, subject, category, message } = req.body;

  // Validação simples dos campos no backend
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes.' });
  }

  // 1. Configuração da URL da Logo
  // Define a URL base do site para carregar a imagem.
  // Em produção, usa a variável de ambiente. Localmente, usa localhost.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Certifica-te de que a imagem "LogoEscrita2.png" existe na pasta /public
  const logoUrl = `${siteUrl}/LogoEscrita2.png`;

  // 2. Configuração do Transporte (Nodemailer)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outras
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 3. Construção do HTML Profissional
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
        .header { 
          background: linear-gradient(135deg, #191970 0%, #458B00 100%); 
          padding: 30px 20px; 
          text-align: center; 
        }
        .logo { max-height: 60px; width: auto; background-color: rgba(255,255,255,0.95); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; }
        .header-title { color: #ffffff; margin: 10px 0 0 0; font-size: 20px; font-weight: 600; }
        .content { padding: 30px; color: #334155; }
        .label { font-size: 12px; text-transform: uppercase; color: #458B00; font-weight: bold; margin-top: 15px; display: block; }
        .value { font-size: 16px; margin-top: 5px; color: #1e293b; line-height: 1.5; }
        .message-box { background-color: #f8fafc; border-left: 4px solid #458B00; padding: 15px; margin-top: 10px; border-radius: 4px; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .category-badge {
          background-color: #e2e8f0; color: #1e293b; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; vertical-align: middle; margin-left: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
           <img src="${logoUrl}" alt="PharmaX Logo" class="logo" />
           <h2 class="header-title">Nova Mensagem do Site</h2>
        </div>

        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">Olá equipe,</p>
          <p style="margin-bottom: 20px;">Uma nova mensagem foi recebida através do formulário de contato.</p>

          <span class="label">Assunto</span>
          <div class="value">
            ${subject} 
            <span class="category-badge">${category ? category.toUpperCase() : 'GERAL'}</span>
          </div>

          <div style="display: flex; gap: 20px; margin-top: 10px;">
            <div style="flex: 1;">
              <span class="label">Nome do Cliente</span>
              <div class="value">${name}</div>
            </div>
            <div style="flex: 1;">
               <span class="label">Telefone</span>
               <div class="value">${phone || 'Não informado'}</div>
            </div>
          </div>

          <span class="label">E-mail para Resposta</span>
          <div class="value"><a href="mailto:${email}" style="color: #191970; text-decoration: none; font-weight: 500;">${email}</a></div>

          <span class="label">Mensagem</span>
          <div class="value message-box">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} PharmaX - Sistema de Gestão.<br>
          Mensagem enviada automaticamente.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Envia o e-mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, 
      to: 'pharmax.l2024@gmail.com', 
      replyTo: email, 
      subject: `[PharmaX - ${category ? category.toUpperCase() : 'CONTATO'}] ${subject}`,
      html: htmlContent,
    });

    // Retorna sucesso
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar a mensagem. Tente novamente mais tarde.' });
  }
}