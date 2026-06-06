import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,            // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),    // 465
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { nombre, empresa, email, sector, empleados, consent } = req.body || {};
    if (!nombre || !email || !consent) return res.status(400).json({ error: 'Faltan campos obligatorios o consentimiento RGPD' });
    await transporter.sendMail({
      from: '"Polaris AI Web" <contacto@polaris-ai.es>',
      to: 'contacto@polaris-ai.es',
      replyTo: email,
      subject: `Nueva solicitud de demo — ${empresa || nombre}`,
      text: `Nombre: ${nombre}\nEmpresa: ${empresa}\nEmail: ${email}\nSector: ${sector}\nNº empleados: ${empleados}`
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
}
