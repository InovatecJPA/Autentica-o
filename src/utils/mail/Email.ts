import dotenv from 'dotenv';
import transporter from './transporterMail';
dotenv.config();

async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Recuperação de Senha',
        html: `
            <p>Você solicitou a redefinição de sua senha.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${resetLink}">Redefinir Senha</a>
        `,
    };

    await transporter.sendMail(mailOptions);
}

export { 
    sendPasswordResetEmail
}