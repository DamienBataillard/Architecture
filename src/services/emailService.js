const nodemailer = require('nodemailer');

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Exemple avec Gmail
    auth: {
        user: process.env.EMAIL_USER, // Adresse e-mail
        pass: process.env.EMAIL_PASSWORD, // Mot de passe ou mot de passe d'application
    },
});

// Fonction pour envoyer un e-mail
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Expéditeur
            to, // Destinataire
            subject, // Sujet
            html, // Contenu HTML
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
