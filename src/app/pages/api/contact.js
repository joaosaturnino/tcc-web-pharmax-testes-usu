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

  // Configuração do "transporter" do Nodemailer
  // Utilize variáveis de ambiente para segurança
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ex: 'smtp.gmail.com'
    port: process.env.EMAIL_PORT, // Ex: 465
    secure: true, // true para a porta 465, false para outras
    auth: {
      user: process.env.EMAIL_USER, // Seu e-mail de envio
      pass: process.env.EMAIL_PASS, // A senha do seu e-mail ou senha de aplicativo
    },
  });

  try {
    // Envia o e-mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // E-mail que aparecerá no campo "De"
      to: 'pharmax.l2024@gmail.com', // O e-mail que receberá a mensagem
      replyTo: email, // Para responder diretamente ao remetente
      subject: `[Contato Site] - ${subject}`, // Assunto do e-mail
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nova Mensagem do Formulário de Contato</h2>
          <p>Você recebeu uma nova mensagem através do site.</p>
          <hr>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Categoria:</strong> ${category}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <h3>Mensagem:</h3>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <hr>
          <p><small>Este e-mail foi enviado a partir do formulário de contato do seu site.</small></p>
        </div>
      `,
    });

    // Retorna sucesso
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar a mensagem. Tente novamente mais tarde.' });
  }
}