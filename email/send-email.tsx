import { Session } from '@/lib/auth-client';
import VerifyEmailTemplate from '@/mail/verification-template';
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(url: string, user: Session) =>{
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'builtforyou.xyz@gmail.com',
        subject: "Verify your email",
        react: VerifyEmailTemplate({url, name: user.name})
    })
}