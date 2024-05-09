import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, password,link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Активация аккаунта на ' + process.env.API_URL,
                text: '',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f5f5f5;">
                        <h2 style="color: #333; text-align: center;">Активация аккаунта на ${process.env.API_URL}</h2>
                        <p>Здравствуйте,</p>
                        <p>Для завершения регистрации на нашем сайте, Вам необходимо активировать свой аккаунт.</p>
                        <p>Ваши учетные данные:</p>
                        <ul>
                            <li><strong>Логин:</strong> ${to}</li>
                            <li><strong>Пароль:</strong> ${password}</li>
                        </ul>
                        <p style="text-align: center;">Для активации аккаунта перейдите по ссылке:</p>
                        <p style="text-align: center;"><a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Активировать аккаунт</a></p>
                        <p style="text-align: center;">После активации, рекомендуем изменить пароль в разделе <strong style="color: #333;">Настройки -> Смена пароля</strong>.</p>
                        <p>С наилучшими пожеланиями,<br/>Команда BMW Group.</p>
                    </div>
                `,
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sendTestMail(to, sendedTest, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Начать прохождение теста',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f5f5f5;">
                        <p style="text-align: center;">Вы получили приглашение пройти тест.</p>
                        <p><strong>Время на прохождение:</strong> ${sendedTest.duration} минут</p>
                        <p>Для начала теста перейдите по ссылке:</p>
                        <p style="text-align: center;"><a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Начать тест</a></p>
                    </div>
            `,
            });
        } catch (error) {
            console.error('Error sending test email:', error);
        }
    }
}

export default new MailService();
