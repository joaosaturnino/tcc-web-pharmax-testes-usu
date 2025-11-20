import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import process from 'process';
import fs from 'fs';

export async function POST(req) {
  try {
    const { name, email, phone, subject, category, message } = await req.json();

    // Validação básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    // 1. Configuração do Caminho da Imagem
    const logoFileName = 'PharmaX.png'; // Certifique-se que este nome está correto na pasta public
    const logoPath = path.join(process.cwd(), 'public', logoFileName);
    const logoExists = fs.existsSync(logoPath);

    if (!logoExists) {
      console.warn(`⚠️ ALERTA: Logo não encontrada em: ${logoPath}`);
    }

    // 2. Configuração do Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Preparação dos Anexos (CID)
    const attachments = [];
    let headerLogoHtml = '';

    if (logoExists) {
      attachments.push({
        filename: logoFileName,
        path: logoPath,
        cid: 'logo_pharmax'
      });
      // Logo centralizada com fundo branco suave para destaque
      headerLogoHtml = `
        <div style="background-color: rgba(255,255,255,0.95); border-radius: 12px; padding: 12px 24px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <img src="cid:logo_pharmax" alt="PharmaX" style="height: 45px; width: auto; display: block;" />
        </div>
      `;
    } else {
      headerLogoHtml = `<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">PharmaX</h1>`;
    }

    // Data formatada para o rodapé
    const dateNow = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    // 4. Template HTML Moderno
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Mensagem PharmaX</title>
        <style>
          /* Reset e Fontes */
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; -webkit-font-smoothing: antialiased; }
          
          /* Container Principal */
          .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
          .email-card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          
          /* Header */
          .header { background: linear-gradient(135deg, #191970 0%, #458B00 100%); padding: 40px 20px; text-align: center; }
          .header-subtitle { color: rgba(255,255,255,0.9); margin-top: 15px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; }
          
          /* Conteúdo */
          .body-content { padding: 40px 30px; }
          .intro-text { font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px; }
          
          /* Grid de Detalhes */
          .details-grid { border-top: 1px solid #e5e7eb; margin-bottom: 30px; }
          .detail-row { padding: 15px 0; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; }
          .detail-label { width: 30%; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 700; letter-spacing: 0.5px; }
          .detail-value { width: 70%; font-size: 15px; color: #111827; font-weight: 500; }
          
          /* Badge de Categoria */
          .badge { background-color: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #bae6fd; }
          
          /* Caixa de Mensagem */
          .message-box { background-color: #f8fafc; border-radius: 12px; padding: 25px; border: 1px solid #e2e8f0; position: relative; margin-top: 10px; }
          .message-box::before { content: '"'; font-size: 60px; color: #e2e8f0; position: absolute; top: -10px; left: 20px; font-family: serif; z-index: 0; }
          .message-text { position: relative; z-index: 1; font-size: 16px; line-height: 1.7; color: #374151; white-space: pre-wrap; }
          
          /* Botão CTA */
          .btn-container { text-align: center; margin-top: 35px; }
          .btn { background-color: #191970; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.3s; box-shadow: 0 4px 6px rgba(25, 25, 112, 0.2); }
          .btn:hover { background-color: #131355; }
          
          /* Footer */
          .footer { background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #f3f4f6; }
          .footer-text { font-size: 12px; color: #9ca3af; margin: 5px 0; line-height: 1.5; }
          .secure-notice { display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 11px; color: #d1d5db; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="email-card">
            <div class="header">
              ${headerLogoHtml}
              <div class="header-subtitle">Nova Solicitação de Contato</div>
            </div>

            <div class="body-content">
              <p class="intro-text">
                Olá equipe, <br><br>
                Vocês receberam uma nova mensagem através do site.
              </p>

              <div class="details-grid">
                <div class="detail-row">
                  <span class="detail-label">Remetente</span>
                  <span class="detail-value">${name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">E-mail</span>
                  <span class="detail-value">
                    <a href="mailto:${email}" style="color: #458B00; text-decoration: none;">${email}</a>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Telefone</span>
                  <span class="detail-value">${phone || '<span style="color:#9ca3af">Não informado</span>'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Departamento</span>
                  <span class="detail-value">
                    <span class="badge">${category ? category.toUpperCase() : 'GERAL'}</span>
                  </span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Assunto</span>
                  <span class="detail-value">${subject}</span>
                </div>
              </div>

              <div style="margin-top: 20px;">
                <span class="detail-label" style="margin-bottom: 10px; display: block;">Mensagem do Cliente:</span>
                <div class="message-box">
                  <div class="message-text">${message}</div>
                </div>
              </div>

              <div class="btn-container">
                <a href="mailto:${email}?subject=Re: ${subject} [PharmaX]" class="btn">Responder Agora</a>
              </div>
            </div>

            <div class="footer">
              <p class="footer-text">
                Recebido em ${dateNow}<br>
                © ${new Date().getFullYear()} PharmaX - Sistema de Gestão Farmacêutica.
              </p>
              <div class="secure-notice">
                🔒 E-mail enviado via conexão segura do site.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || 'pharmax.l2024@gmail.com',
      replyTo: email,
      subject: ` [${category.toUpperCase()}] ${subject} - PharmaX`, // Ícone no assunto chama atenção
      html: htmlContent,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Enviado com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('❌ ERRO NO ENVIO:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}