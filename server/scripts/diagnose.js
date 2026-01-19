const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const prisma = new PrismaClient();

async function deepDiagnostics() {
    console.log('Starting Diagnostics...');
    console.log('--------------------------------');

    // 1. Check Environment Variables
    console.log('1. Checking Environment Variables...');
    const requiredVars = ['DATABASE_URL', 'EMAIL_USER', 'EMAIL_PASS'];
    const missingVars = requiredVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
        console.error('❌ Missing Environment Variables:', missingVars.join(', '));
        process.exit(1);
    }
    console.log('✅ Environment Variables Present');
    console.log(`   - User: ${process.env.EMAIL_USER}`);
    console.log('--------------------------------');

    // 2. Test Database Connection
    console.log('2. Testing Database Connection...');
    try {
        await prisma.$connect();
        console.log('✅ Database Connection Successful');
        const userCount = await prisma.user.count();
        console.log(`   - Current User Count: ${userCount}`);
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
    console.log('--------------------------------');

    // 3. Test SMTP Connection
    console.log('3. Testing SMTP (Email) Connection...');
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Verified');

        // Attempt to send a self-email
        console.log('   - Attempting to send test email to self...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from Diagnostic Script',
            text: 'If you receive this, the email system is working correctly.',
        });
        console.log('✅ Test Email Sent Successfully');
    } catch (error) {
        console.error('❌ SMTP Connection/Sending Failed:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   Hint: Check your EMAIL_USER and EMAIL_PASS. If using Gmail, you need an App Password.');
        }
    }
    console.log('--------------------------------');
    console.log('Diagnostics Complete.');
}

deepDiagnostics();
