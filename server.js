import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'triroars@gmail.com',
    pass: 'yptziftrwazlyupx'
  }
});

// Email template for Triroars
const getTriroarsEmailTemplate = (clientName, clientEmail, signatureDataUrl, date) => {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #F2E8C3;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #193752 0%, #2a4a65 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .success-badge {
      background: linear-gradient(135deg, #F5A219 0%, #F27612 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 50px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #F2E8C3;
      border-right: 4px solid #F27612;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 8px;
    }
    .label {
      font-weight: bold;
      color: #193752;
    }
    .value {
      color: #F27612;
    }
    .signature-section {
      margin: 30px 0;
      text-align: center;
    }
    .signature-title {
      font-size: 18px;
      color: #193752;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .signature-box {
      border: 3px solid #F5A219;
      border-radius: 15px;
      padding: 20px;
      background: white;
      display: inline-block;
    }
    .signature-img {
      max-width: 300px;
      height: auto;
    }
    .footer {
      background-color: #193752;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .next-steps {
      background: linear-gradient(135deg, #F5A219 0%, #F27612 100%);
      color: white;
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
    }
    .next-steps h3 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 הצעת מחיר אושרה!</h1>
    </div>
    
    <div class="content">
      <div class="success-badge">
        ✓ אישור התקבל בהצלחה
      </div>

      <p style="font-size: 18px; color: #193752; line-height: 1.8;">
        שלום צוות Triroars,<br><br>
        הלקוח אישר את הצעת המחיר עבור <strong>"תוכנית ההבראה הפיננסית הדיגיטלית"</strong>.
      </p>

      <div class="info-box">
        <div class="info-row">
          <span class="label">שם הלקוח:</span>
          <span class="value">${clientName}</span>
        </div>
        <div class="info-row">
          <span class="label">אימייל:</span>
          <span class="value">${clientEmail}</span>
        </div>
        <div class="info-row">
          <span class="label">תאריך אישור:</span>
          <span class="value">${date}</span>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-title">חתימת הלקוח:</div>
        <div class="signature-box">
          <img src="cid:signature" alt="חתימת לקוח" class="signature-img" />
        </div>
      </div>

      <div class="next-steps">
        <h3>📋 השלבים הבאים:</h3>
        <ul style="text-align: right; line-height: 2;">
          <li>צור קשר עם הלקוח תוך 24 שעות</li>
          <li>שלח הסכם רשמי לחתימה</li>
          <li>קבע פגישת קיק-אוף</li>
          <li>הכן את סביבת הפיתוח</li>
        </ul>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>סה"כ עלות הפרויקט:</strong> 33,000 ₪ + מע"מ<br>
        <strong>משך הפרויקט:</strong> 8 שבועות
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">Triroars 🦁</div>
      <p>עיצוב ופיתוח חוויות דיגיטליות בעולמות הבינה המלאכותית</p>
    </div>
  </div>
</body>
</html>
`;
};

// Email template for Client (Gadi)
const getClientEmailTemplate = (clientName, signatureDataUrl, date) => {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #F2E8C3;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #193752 0%, #2a4a65 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .thank-you {
      background: linear-gradient(135deg, #F5A219 0%, #F27612 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      margin: 20px 0;
      font-size: 22px;
      font-weight: bold;
    }
    .signature-section {
      margin: 30px 0;
      text-align: center;
      background-color: #F2E8C3;
      padding: 30px;
      border-radius: 15px;
    }
    .signature-title {
      font-size: 18px;
      color: #193752;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .signature-box {
      border: 3px solid #F5A219;
      border-radius: 15px;
      padding: 20px;
      background: white;
      display: inline-block;
    }
    .signature-img {
      max-width: 300px;
      height: auto;
    }
    .project-details {
      background: linear-gradient(135deg, #F2E8C3 0%, #fff 100%);
      border-right: 4px solid #193752;
      padding: 25px;
      margin: 25px 0;
      border-radius: 12px;
    }
    .detail-item {
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-label {
      font-weight: bold;
      color: #193752;
      font-size: 16px;
    }
    .detail-value {
      color: #F27612;
      font-weight: 600;
      font-size: 16px;
    }
    .timeline {
      background: white;
      border: 2px solid #F5A219;
      border-radius: 15px;
      padding: 25px;
      margin: 25px 0;
    }
    .timeline h3 {
      color: #193752;
      margin-top: 0;
      text-align: center;
    }
    .timeline-item {
      padding: 12px;
      margin: 10px 0;
      background: #F2E8C3;
      border-radius: 8px;
      border-right: 3px solid #F27612;
    }
    .contact-box {
      background: #193752;
      color: white;
      padding: 25px;
      border-radius: 15px;
      margin: 25px 0;
      text-align: center;
    }
    .contact-box a {
      color: #F5A219;
      text-decoration: none;
      font-weight: bold;
    }
    .footer {
      background-color: #193752;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ תודה שבחרת בנו!</h1>
    </div>
    
    <div class="content">
      <div class="thank-you">
        הצעת המחיר אושרה בהצלחה 🎉
      </div>

      <p style="font-size: 18px; color: #193752; line-height: 1.8;">
        שלום ${clientName},<br><br>
        תודה רבה שאישרת את הצעת המחיר עבור <strong>"תוכנית ההבראה הפיננסית הדיגיטלית"</strong>.<br>
        אנחנו נרגשים להתחיל לעבוד איתך על הפרויקט המרתק הזה! 🚀
      </p>

      <div class="signature-section">
        <div class="signature-title">החתימה שלך:</div>
        <div class="signature-box">
          <img src="cid:signature" alt="חתימה" class="signature-img" />
        </div>
        <p style="color: #666; margin-top: 15px; font-size: 14px;">
          תאריך אישור: ${date}
        </p>
      </div>

      <div class="project-details">
        <h3 style="color: #193752; text-align: center; margin-top: 0;">📊 פרטי הפרויקט</h3>
        <div class="detail-item">
          <span class="detail-label">🎯 שם הפרויקט:</span>
          <span class="detail-value">תוכנית ההבראה הפיננסית הדיגיטלית</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">💰 עלות:</span>
          <span class="detail-value">33,000 ₪ + מע"מ</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">⏱️ משך:</span>
          <span class="detail-value">8 שבועות</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🔧 טכנולוגיות:</span>
          <span class="detail-value">React + Supabase + AI</span>
        </div>
      </div>

      <div class="timeline">
        <h3>📅 השלבים הקרובים:</h3>
        <div class="timeline-item">
          <strong>שלב 1:</strong> נשלח אליך הסכם רשמי לחתימה תוך 48 שעות
        </div>
        <div class="timeline-item">
          <strong>שלב 2:</strong> נקבע פגישת קיק-אוף לאפיון סופי
        </div>
        <div class="timeline-item">
          <strong>שלב 3:</strong> תשלום ראשון (30%) והתחלת העבודה
        </div>
        <div class="timeline-item">
          <strong>שלב 4:</strong> התחלת פיתוח ועדכונים שוטפים
        </div>
      </div>

      <div class="contact-box">
        <h3 style="margin-top: 0;">📞 יצירת קשר</h3>
        <p>יש לך שאלות? נשמח לעזור!</p>
        <p style="margin: 15px 0;">
          <strong>אימייל:</strong> <a href="mailto:triroars@gmail.com">triroars@gmail.com</a>
        </p>
        <p style="font-size: 14px; color: #F5A219; margin-top: 20px;">
          נחזור אליך תוך 24 שעות עם פרטים נוספים
        </p>
      </div>

      <p style="text-align: center; color: #193752; font-size: 16px; line-height: 1.8; margin-top: 30px;">
        אנחנו מתחייבים ליצור עבורך מוצר איכותי שיעמוד בכל הציפיות.<br>
        בהצלחה משותפת! 💪
      </p>
    </div>

    <div class="footer">
      <div class="footer-logo">Triroars 🦁</div>
      <p>עיצוב ופיתוח חוויות דיגיטליות בעולמות הבינה המלאכותית</p>
      <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
        © 2025 Triroars - כל הזכויות שמורות
      </p>
    </div>
  </div>
</body>
</html>
`;
};

// API endpoint to send approval emails
app.post('/api/send-approval', async (req, res) => {
  try {
    const { clientName, clientEmail, signatureDataUrl } = req.body;

    if (!clientName || !clientEmail || !signatureDataUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'חסרים פרטים נדרשים' 
      });
    }

    const date = new Date().toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Convert base64 signature to buffer
    const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, '');
    const signatureBuffer = Buffer.from(base64Data, 'base64');

    // Email to Triroars
    const triroarsMailOptions = {
      from: 'triroars@gmail.com',
      to: 'triroars@gmail.com',
      subject: `🎉 הצעת מחיר אושרה - ${clientName}`,
      html: getTriroarsEmailTemplate(clientName, clientEmail, signatureDataUrl, date),
      attachments: [{
        filename: 'signature.png',
        content: signatureBuffer,
        encoding: 'base64',
        cid: 'signature'
      }]
    };

    // Email to Client (Gadi)
    const clientMailOptions = {
      from: 'triroars@gmail.com',
      to: clientEmail,
      subject: '✨ אישור הצעת מחיר - תוכנית ההבראה הפיננסית הדיגיטלית',
      html: getClientEmailTemplate(clientName, signatureDataUrl, date),
      attachments: [{
        filename: 'signature.png',
        content: signatureBuffer,
        encoding: 'base64',
        cid: 'signature'
      }]
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(triroarsMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    res.json({ 
      success: true, 
      message: 'המיילים נשלחו בהצלחה!' 
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'שגיאה בשליחת המיילים',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

