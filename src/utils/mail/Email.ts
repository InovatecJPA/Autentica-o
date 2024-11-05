import dotenv from 'dotenv';
import transporter from './transporterMail';
dotenv.config();

async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

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

    transporter.sendMail(mailOptions).then((info) => {
        console.log('Email enviado: ' + info.response);
    }).catch((error) => {
        console.log(error);
        throw new Error('Erro ao enviar email');
    })
    return true
}

export { 
    sendPasswordResetEmail
}