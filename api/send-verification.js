import 'dotenv/config'; // 🌟 Add this if your local setup isn't reading the .env file automatically
import { Resend } from 'resend';

// This safely extracts your key from the secure environment vault
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, verificationCode } = req.body;

    try {
        const data = await resend.emails.send({
            // 🌟 Use onboarding@resend.dev until you purchase or configure a domain
            from: 'Gamerack Security <onboarding@resend.dev>', 
            to: ['dev.crxvengs@gmail.com'], // During free testing, route strictly to your account email
            subject: '🎮 Gamerack Gateway Access Token',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; background: #09090b; color: #ffffff;">
                    <h2 style="color: #6366f1; margin-bottom: 4px;">Gamerack Security Portal</h2>
                    <p style="color: #a1a1aa; font-size: 14px;">A node initialization attempt requires identity synchronization authorization.</p>
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid rgba(255,255,255,0.1);">
                        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6366f1;">${verificationCode}</span>
                    </div>
                    <p style="color: #71717a; font-size: 12px; margin-top: 24px;">If you did not request this authorization matrix, please disregard this transmission securely.</p>
                </div>
            `
        });

        return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}