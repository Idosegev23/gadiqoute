import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';
import { FileText, Download, Send, X, Loader2, Check } from 'lucide-react';

const Contract = ({ clientName, clientEmail, onBack }) => {
  const [formData, setFormData] = useState({
    developerName: 'Triroars',
    developerLicense: '300700556',
    developerAddress: 'צבי סגל 20 א׳ אשקלון',
    clientFullName: clientName || '',
    clientLicense: '',
    clientAddress: '',
    clientEmail: clientEmail || '',
    contractDate: new Date().toLocaleDateString('he-IL')
  });

  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [developerSignatureBase64, setDeveloperSignatureBase64] = useState('');
  
  const clientSigRef = useRef(null);
  const contractRef = useRef(null);

  // Load developer signature on component mount
  React.useEffect(() => {
    const loadSignature = async () => {
      try {
        const response = await fetch('/sign.jpg');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setDeveloperSignatureBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    };
    loadSignature();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearSignature = () => {
    clientSigRef.current?.clear();
  };

  const generatePDF = async () => {
    const element = contractRef.current;
    const opt = {
      margin: 15,
      filename: `הסכם_פיתוח_${formData.clientFullName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    return html2pdf().set(opt).from(element).toPdf().output('blob');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.clientFullName.trim()) {
      setError('נא למלא את שם הלקוח');
      return;
    }

    if (!formData.clientEmail.trim()) {
      setError('נא למלא את אימייל הלקוח');
      return;
    }

    if (clientSigRef.current?.isEmpty()) {
      setError('נא לחתום בשדה חתימת הלקוח');
      return;
    }

    setIsSending(true);

    try {
      // Use already loaded developer signature
      const developerSignature = developerSignatureBase64;

      // Generate client signature
      const clientSignature = clientSigRef.current.toDataURL();

      // Generate PDF
      const pdfBlob = await generatePDF();
      
      // Convert PDF to base64
      const pdfReader = new FileReader();
      pdfReader.readAsDataURL(pdfBlob);
      
      pdfReader.onloadend = async () => {
        const pdfBase64 = pdfReader.result;

        // Send to server
        const response = await fetch('http://localhost:3001/api/send-contract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData,
            developerSignature,
            clientSignature,
            pdfBase64
          }),
        });

        const data = await response.json();

        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        } else {
          setError(data.message || 'שגיאה בשליחת ההסכם');
        }
        
        setIsSending(false);
      };
    } catch (error) {
      console.error('Error:', error);
      setError('שגיאה בשליחת ההסכם. נא לנסות שוב.');
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <FileText className="w-20 h-20 mx-auto mb-4 text-navy" />
          <h1 className="text-5xl font-bold text-navy mb-4">הסכם פיתוח תוכנה</h1>
          <p className="text-xl text-navy/70">תוכנית ההבראה הפיננסית הדיגיטלית</p>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-12 text-center max-w-md">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-navy mb-4">
                ההסכם נשלח בהצלחה! 🎉
              </h3>
              <p className="text-xl text-navy/70">
                קיבלת עותק במייל
              </p>
            </div>
          </motion.div>
        )}

        {/* Input Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-navy mb-6 text-center">מילוי פרטי הלקוח</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <label className="block text-navy font-bold mb-2">שם מלא: *</label>
              <input
                type="text"
                value={formData.clientFullName}
                onChange={(e) => handleInputChange('clientFullName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-cream rounded-xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                placeholder="הזן שם מלא"
                required
              />
            </div>
            <div>
              <label className="block text-navy font-bold mb-2">עוסק מורשה / ח.פ:</label>
              <input
                type="text"
                value={formData.clientLicense}
                onChange={(e) => handleInputChange('clientLicense', e.target.value)}
                className="w-full px-4 py-3 border-2 border-cream rounded-xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                placeholder="מספר רישיון (אופציונלי)"
              />
            </div>
            <div>
              <label className="block text-navy font-bold mb-2">כתובת:</label>
              <input
                type="text"
                value={formData.clientAddress}
                onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                className="w-full px-4 py-3 border-2 border-cream rounded-xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                placeholder="כתובת מלאה (אופציונלי)"
              />
            </div>
            <div>
              <label className="block text-navy font-bold mb-2">אימייל: *</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className="w-full px-4 py-3 border-2 border-cream rounded-xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <p className="text-center text-sm text-navy/60 mt-4">
            * שדות חובה - הפרטים יופיעו אוטומטית בהסכם למטה
          </p>
        </motion.div>

        {/* Contract Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Contract Content for PDF */}
          <div ref={contractRef} className="p-12" style={{ direction: 'rtl' }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-navy mb-4">הסכם פיתוח תוכנה</h1>
              <p className="text-lg text-navy/70">
                נחתם בתאריך: <span className="font-bold">{formData.contractDate}</span>
              </p>
            </div>

            {/* Parties */}
            <div className="mb-8 bg-cream/50 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-navy mb-4">בין הצדדים:</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange">1. המפתח</h3>
                  <div>
                    <label className="block text-navy font-bold mb-2">שם:</label>
                    <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-navy font-semibold">
                      {formData.developerName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy font-bold mb-2">עוסק מורשה / ח.פ:</label>
                    <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-navy font-semibold">
                      {formData.developerLicense}
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy font-bold mb-2">כתובת משרד:</label>
                    <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-navy font-semibold">
                      {formData.developerAddress}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange">2. הלקוח</h3>
                  <div>
                    <label className="block text-navy font-bold mb-2">שם מלא:</label>
                    <div className="w-full px-4 py-3 bg-white border-2 border-navy/20 rounded-xl text-navy font-semibold min-h-[50px] flex items-center">
                      {formData.clientFullName || '_____________________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy font-bold mb-2">עוסק מורשה / ח.פ:</label>
                    <div className="w-full px-4 py-3 bg-white border-2 border-navy/20 rounded-xl text-navy font-semibold min-h-[50px] flex items-center">
                      {formData.clientLicense || '_____________________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy font-bold mb-2">כתובת:</label>
                    <div className="w-full px-4 py-3 bg-white border-2 border-navy/20 rounded-xl text-navy font-semibold min-h-[50px] flex items-center">
                      {formData.clientAddress || '_____________________________'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy font-bold mb-2">אימייל:</label>
                    <div className="w-full px-4 py-3 bg-white border-2 border-navy/20 rounded-xl text-navy font-semibold min-h-[50px] flex items-center">
                      {formData.clientEmail || '_____________________________'}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-navy/60 mt-4">ביחד: "הצדדים"</p>
            </div>

            {/* Contract Terms */}
            <div className="space-y-6 text-navy leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">1. מטרת ההסכם</h2>
                <p className="text-justify">
                  המפתח יפתח עבור הלקוח מערכת אינטרנטית אינטראקטיבית בשם <strong>"תוכנית ההבראה הפיננסית הדיגיטלית"</strong> (להלן: "המערכת")
                  בהתאם לאפיון הטכני והמסמכים המצורפים להסכם זה כ<strong>נספח א׳</strong> (להלן: "מסמכי האפיון").
                  המערכת תכלול ממשק משתמש, אזור אדמין, אינטגרציה עם WhatsApp, ממשק בינה מלאכותית (OpenAI), OCR,
                  ואינטגרציה למערכת חשבונית ירוקה לסליקה חוזרת, כמפורט ב<strong>נספח ב׳</strong> (רשימת טכנולוגיות).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">2. שלבי העבודה ולוחות זמנים</h2>
                <p className="mb-4">
                  הפיתוח יתבצע במשך כ־<strong>שמונה (8) שבועות</strong> ממועד חתימת ההסכם וקבלת התשלום הראשון, על פי החלוקה הבאה:
                </p>
                <div className="bg-white rounded-xl overflow-hidden border-2 border-navy/10">
                  <table className="w-full text-right">
                    <thead className="bg-navy text-white">
                      <tr>
                        <th className="px-4 py-3">שלב</th>
                        <th className="px-4 py-3">תיאור</th>
                        <th className="px-4 py-3">משך משוער</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/10">
                      <tr><td className="px-4 py-3 font-bold">שלב א׳</td><td className="px-4 py-3">אפיון סופי ועיצוב UX/UI</td><td className="px-4 py-3">שבועיים</td></tr>
                      <tr><td className="px-4 py-3 font-bold">שלב ב׳</td><td className="px-4 py-3">פיתוח רכיבי המערכת ודשבורד המשתמש</td><td className="px-4 py-3">שלושה שבועות</td></tr>
                      <tr><td className="px-4 py-3 font-bold">שלב ג׳</td><td className="px-4 py-3">אינטגרציות (GreenAPI, OpenAI, OCR, חשבונית ירוקה)</td><td className="px-4 py-3">שבועיים</td></tr>
                      <tr><td className="px-4 py-3 font-bold">שלב ד׳</td><td className="px-4 py-3">בדיקות, תיקונים והשקה</td><td className="px-4 py-3">שבוע</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm">
                  המפתח ישתף את הלקוח בהתקדמות אחת לשבוע, או לפי בקשת הלקוח הסבירה.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">3. תשלומים ותנאים כספיים</h2>
                <p className="mb-4">
                  <strong>סה״כ עלות הפיתוח: 33,000 ₪ (לא כולל מע״מ).</strong><br />
                  פירוט מלא של עלויות הפיתוח מופיע ב<strong>נספח ג׳</strong>.<br />
                  התשלומים יתבצעו לפי אבני הדרך הבאות:
                </p>
                <div className="bg-white rounded-xl overflow-hidden border-2 border-navy/10">
                  <table className="w-full text-right">
                    <thead className="bg-warm-yellow text-navy">
                      <tr>
                        <th className="px-4 py-3">שלב</th>
                        <th className="px-4 py-3">אחוז</th>
                        <th className="px-4 py-3">סכום (₪)</th>
                        <th className="px-4 py-3">מועד</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/10">
                      <tr><td className="px-4 py-3">א. פתיחת פרויקט</td><td className="px-4 py-3 font-bold">30%</td><td className="px-4 py-3 font-bold">9,900 ₪ + מע״מ</td><td className="px-4 py-3">עם חתימת ההסכם</td></tr>
                      <tr><td className="px-4 py-3">ב. מסירת גרסת ביניים</td><td className="px-4 py-3 font-bold">40%</td><td className="px-4 py-3 font-bold">13,200 ₪ + מע״מ</td><td className="px-4 py-3">לאחר שלב הפיתוח הראשי</td></tr>
                      <tr><td className="px-4 py-3">ג. אינטגרציות ובדיקות</td><td className="px-4 py-3 font-bold">20%</td><td className="px-4 py-3 font-bold">6,600 ₪ + מע״מ</td><td className="px-4 py-3">לפני השקה</td></tr>
                      <tr><td className="px-4 py-3">ד. השקה מלאה</td><td className="px-4 py-3 font-bold">10%</td><td className="px-4 py-3 font-bold">3,300 ₪ + מע״מ</td><td className="px-4 py-3">ביום העלייה לאוויר</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm">
                  כל תשלום ישולם תוך 7 ימי עסקים ממועד הנפקת החשבונית.
                  אי־תשלום במועד ייחשב להפרת הסכם ויעצור את המשך הפיתוח עד להסדרה.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">4. אחריות וזמני תיקון</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>המפתח מתחייב לבצע תיקוני באגים קריטיים שיתגלו בתקופה של <strong>30 יום</strong> ממועד ההשקה, ללא עלות נוספת.</li>
                  <li>כל שינוי או הרחבה מעבר לאפיון המקורי ייחשב כעבודה נוספת בתשלום לפי שעת פיתוח או הצעה חדשה.</li>
                  <li>אחריות לתקלות הנובעות מהתקנות צד שלישי, שרתים חיצוניים, או שירותי API שאינם בשליטת המפתח – מוגבלת לתמיכה סבירה בלבד.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">5. תחזוקה והמשך עבודה</h2>
                <p className="mb-3">
                  לאחר סיום הפיתוח, הלקוח רשאי לבחור בחבילת תחזוקה חודשית הכוללת:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>ניטור תקינות המערכת וה־API</li>
                  <li>עדכוני גרסה ותיקוני אבטחה</li>
                  <li>גיבויים ובדיקות תפקוד</li>
                  <li>תמיכה טכנית (עד 5 שעות בחודש)</li>
                </ul>
                <p className="mt-3">
                  <strong>דמי תחזוקה חודשית: 1,000 ₪ (כולל מע״מ).</strong><br />
                  פירוט עלויות נלוות והיקף שימוש משוער מופיע ב<strong>נספח ד׳</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">6. זכויות קניין רוחני</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>כל קוד המקור, העיצוב, והקבצים שפותחו במסגרת ההסכם יהיו בבעלות המפתח, עד לקבלת התשלום המלא עבור הפרויקט.</li>
                  <li>עם קבלת מלוא התמורה, תועבר ללקוח רישיון שימוש מלא במערכת, לשימוש פנימי בלבד.</li>
                  <li>הלקוח אינו רשאי למכור, לשכפל, למסחר, או להעביר את הקוד לצד שלישי, אלא באישור כתוב מהמפתח.</li>
                  <li>המפתח רשאי לעשות שימוש ברעיונות כלליים, מבנה קוד, רכיבים גנריים וידע מקצועי שנצבר במהלך הפיתוח בפרויקטים אחרים.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">7. סודיות ופרטיות</h2>
                <p>
                  הצדדים מתחייבים לשמור בסודיות מוחלטת על כל מידע עסקי, טכנולוגי או כספי שייחשף ביניהם במהלך ההתקשרות.
                  התחייבות זו תחול גם לאחר סיום ההתקשרות.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">8. אחריות מוגבלת</h2>
                <p>
                  המפתח אינו אחראי לכל נזק עקיף, אובדן הכנסות או נתונים, או כל נזק משני אחר העלול להיגרם משימוש במערכת.
                  האחריות הכוללת של המפתח, מכל סיבה שהיא, לא תעלה על הסכום ששולם בפועל עבור הפרויקט.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">9. ביטול ההתקשרות</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>כל צד רשאי להפסיק את ההתקשרות בהודעה מוקדמת של 14 יום.</li>
                  <li>במקרה של ביטול ביוזמת הלקוח – יבוצע חיוב יחסי לפי שלב העבודה שבוצע בפועל.</li>
                  <li>במקרה של ביטול ביוזמת המפתח ללא הצדקה, יוחזר ללקוח סכום יחסי שלא נוצל.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">10. שמות מסחריים ולוגו</h2>
                <p>
                  המפתח רשאי להציג את המערכת בתיק העבודות שלו ובאתר החברה לצורכי שיווק בלבד, אלא אם הלקוח ביקש אחרת בכתב.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">11. סמכות שיפוט</h2>
                <p>
                  הצדדים מסכימים כי כל מחלוקת תתברר בבית משפט מוסמך באזור תל אביב בלבד.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-orange mb-3">12. נספחים</h2>
                <p className="mb-3">
                  הנספחים המפורטים להלן מהווים חלק בלתי נפרד מהסכם זה:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>נספח א׳</strong> – אפיון טכני מפורט ומטרות המערכת</li>
                  <li><strong>נספח ב׳</strong> – רשימת טכנולוגיות וכלי פיתוח</li>
                  <li><strong>נספח ג׳</strong> – פירוט עלויות פיתוח לפי רכיבים</li>
                  <li><strong>נספח ד׳</strong> – תרחישים עסקיים ועלויות תפעול חודשיות</li>
                </ul>
              </section>
            </div>

            {/* === נספחים === */}
            <div className="mt-16 pt-8 border-t-4 border-navy">
              <h1 className="text-4xl font-bold text-navy text-center mb-12">נספחים להסכם</h1>

              {/* נספח א׳ - אפיון */}
              <section className="mb-12">
                <div className="bg-orange text-white p-4 rounded-t-2xl">
                  <h2 className="text-3xl font-bold">נספח א׳ – אפיון טכני ומטרות המערכת</h2>
                </div>
                <div className="bg-cream/50 p-8 rounded-b-2xl">
                  <h3 className="text-2xl font-bold text-navy mb-4">מטרות המערכת</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-warm-yellow text-xl">•</span>
                      <span>להנגיש ניהול תקציב לכל אדם</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-warm-yellow text-xl">•</span>
                      <span>לספק ליווי פיננסי שוטף בצורה פשוטה, קלילה ואנושית</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-warm-yellow text-xl">•</span>
                      <span>להפוך נתונים פיננסיים לתהליך מובן ומעורר מוטיבציה</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-warm-yellow text-xl">•</span>
                      <span>ליצור חוויית שימוש צעירה וזורמת בשפה מדוברת</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold text-navy mb-4 mt-8">מבנה המערכת</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border-r-4 border-warm-yellow">
                      <h4 className="text-xl font-bold text-orange mb-3">🌐 אתר ציבורי (SaaS)</h4>
                      <ul className="space-y-2">
                        <li>• דף בית שיווקי שמעביר את הערך בשלוש שניות</li>
                        <li>• הרשמה ותשלום בהוראת קבע דרך חשבונית ירוקה</li>
                        <li>• סרטון הסבר קצר / אנימציה על התהליך</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-r-4 border-orange">
                      <h4 className="text-xl font-bold text-orange mb-3">👤 אזור משתמש</h4>
                      <ul className="space-y-2">
                        <li>• דשבורד עם מד בריאות פיננסית</li>
                        <li>• גרפים של הכנסות והוצאות</li>
                        <li>• אפשרות להזין הוצאות ידנית או דרך וואטסאפ</li>
                        <li>• ניתוח OCR של קבלות</li>
                        <li>• יעדים וחיסכון</li>
                        <li>• תמיכה מלאה במובייל</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-r-4 border-green-500">
                      <h4 className="text-xl font-bold text-orange mb-3">💬 וואטסאפ דו־כיווני</h4>
                      <ul className="space-y-2">
                        <li>• הודעות חכמות ותזכורות</li>
                        <li>• קבלת הודעות טקסט ותמונות מהמשתמש</li>
                        <li>• ניתוח אוטומטי והוספה למערכת</li>
                        <li>• שיחה עם בוט AI שמעניק תובנות אישיות</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-r-4 border-red-brown">
                      <h4 className="text-xl font-bold text-orange mb-3">🛡️ ממשק אדמין</h4>
                      <ul className="space-y-2">
                        <li>• צפייה בסטטוס משתמשים</li>
                        <li>• ניהול הודעות, מנויים ונתוני מערכת</li>
                        <li>• הפקת דוחות שימוש ופעילות</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* נספח ב׳ - טכנולוגיות */}
              <section className="mb-12">
                <div className="bg-orange text-white p-4 rounded-t-2xl">
                  <h2 className="text-3xl font-bold">נספח ב׳ – טכנולוגיות וכלי פיתוח</h2>
                </div>
                <div className="bg-cream/50 p-8 rounded-b-2xl">
                  <div className="bg-white p-8 rounded-xl text-center">
                    <p className="text-2xl text-navy font-bold mb-4">
                      React + Supabase + GreenAPI + OpenAI + Green Invoice + Vercel
                    </p>
                    <p className="text-lg text-navy/70">
                      עיצוב עם Tailwind / MagicUI, אנימציות Framer Motion
                    </p>
                  </div>
                </div>
              </section>

              {/* נספח ג׳ - עלויות פיתוח */}
              <section className="mb-12">
                <div className="bg-orange text-white p-4 rounded-t-2xl">
                  <h2 className="text-3xl font-bold">נספח ג׳ – פירוט עלויות פיתוח</h2>
                </div>
                <div className="bg-cream/50 p-8 rounded-b-2xl">
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-navy/10">
                    <table className="w-full text-right">
                      <thead className="bg-navy text-white">
                        <tr>
                          <th className="px-4 py-4 text-lg">רכיב</th>
                          <th className="px-4 py-4 text-lg">תיאור</th>
                          <th className="px-4 py-4 text-lg">שעות</th>
                          <th className="px-4 py-4 text-lg">עלות (₪)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy/10">
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">אפיון ו־UX</td>
                          <td className="px-4 py-4">תכנון חוויית משתמש ומסכים</td>
                          <td className="px-4 py-4 font-semibold">12</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">4,200</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">דף שיווקי SaaS</td>
                          <td className="px-4 py-4">Hero, CTA, סליקה</td>
                          <td className="px-4 py-4 font-semibold">10</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">3,500</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">מערכת משתמשים</td>
                          <td className="px-4 py-4">דשבורד, גרפים, תקציב, יעדים</td>
                          <td className="px-4 py-4 font-semibold">20</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">7,000</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">וואטסאפ GreenAPI</td>
                          <td className="px-4 py-4">שליחה, קליטה, webhook</td>
                          <td className="px-4 py-4 font-semibold">10</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">3,500</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">אינטגרציית OpenAI</td>
                          <td className="px-4 py-4">שיחות בוט חכמות</td>
                          <td className="px-4 py-4 font-semibold">8</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">2,800</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">OCR</td>
                          <td className="px-4 py-4">זיהוי קבלות אוטומטי</td>
                          <td className="px-4 py-4 font-semibold">6</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">2,100</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">ממשק אדמין</td>
                          <td className="px-4 py-4">ניהול משתמשים ודוחות</td>
                          <td className="px-4 py-4 font-semibold">8</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">2,800</td>
                        </tr>
                        <tr className="hover:bg-cream/30">
                          <td className="px-4 py-4 font-bold">QA ונגישות</td>
                          <td className="px-4 py-4">בדיקות, תיקונים והשקה</td>
                          <td className="px-4 py-4 font-semibold">6</td>
                          <td className="px-4 py-4 font-bold text-warm-yellow">2,100</td>
                        </tr>
                        <tr className="bg-warm-yellow/20 font-bold text-xl">
                          <td className="px-4 py-5" colSpan="2">סה״כ פיתוח:</td>
                          <td className="px-4 py-5">80 שעות</td>
                          <td className="px-4 py-5 text-orange text-2xl">33,000 ₪</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-center mt-4 text-navy/70">* המחירים אינם כוללים מע"מ</p>
                </div>
              </section>

              {/* נספח ד׳ - עלויות תפעול */}
              <section className="mb-12">
                <div className="bg-orange text-white p-4 rounded-t-2xl">
                  <h2 className="text-3xl font-bold">נספח ד׳ – תרחישים עסקיים ועלויות תפעול</h2>
                </div>
                <div className="bg-cream/50 p-8 rounded-b-2xl space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">תרחישי שימוש משוערים</h3>
                    <div className="bg-white rounded-xl overflow-hidden border-2 border-navy/10">
                      <table className="w-full text-right">
                        <thead className="bg-navy text-white">
                          <tr>
                            <th className="px-4 py-4">משתמשים פעילים</th>
                            <th className="px-4 py-4">הודעות/יום</th>
                            <th className="px-4 py-4">עלות וואטסאפ</th>
                            <th className="px-4 py-4">עלות AI</th>
                            <th className="px-4 py-4">אחסון</th>
                            <th className="px-4 py-4 bg-warm-yellow text-navy">סה"כ חודשי</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                          <tr className="hover:bg-cream/30">
                            <td className="px-4 py-4 font-bold">50</td>
                            <td className="px-4 py-4">200</td>
                            <td className="px-4 py-4">₪40</td>
                            <td className="px-4 py-4">₪20</td>
                            <td className="px-4 py-4">₪10</td>
                            <td className="px-4 py-4 font-bold text-xl text-warm-yellow">₪70</td>
                          </tr>
                          <tr className="hover:bg-cream/30">
                            <td className="px-4 py-4 font-bold">100</td>
                            <td className="px-4 py-4">400</td>
                            <td className="px-4 py-4">₪70</td>
                            <td className="px-4 py-4">₪40</td>
                            <td className="px-4 py-4">₪20</td>
                            <td className="px-4 py-4 font-bold text-xl text-warm-yellow">₪120</td>
                          </tr>
                          <tr className="hover:bg-cream/30">
                            <td className="px-4 py-4 font-bold">500</td>
                            <td className="px-4 py-4">2,000</td>
                            <td className="px-4 py-4">₪250</td>
                            <td className="px-4 py-4">₪100</td>
                            <td className="px-4 py-4">₪50</td>
                            <td className="px-4 py-4 font-bold text-xl text-warm-yellow">₪400</td>
                          </tr>
                          <tr className="hover:bg-cream/30">
                            <td className="px-4 py-4 font-bold">1,000</td>
                            <td className="px-4 py-4">4,000</td>
                            <td className="px-4 py-4">₪500</td>
                            <td className="px-4 py-4">₪200</td>
                            <td className="px-4 py-4">₪100</td>
                            <td className="px-4 py-4 font-bold text-xl text-warm-yellow">₪800</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-center mt-4 text-sm text-navy/60">* העלויות משוערות ותלויות בהיקף שימוש אמיתי</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-4">עלויות נלוות חודשיות</h3>
                    <div className="bg-white rounded-xl overflow-hidden border-2 border-navy/10">
                      <table className="w-full text-right">
                        <thead className="bg-navy text-white">
                          <tr>
                            <th className="px-4 py-4">רכיב</th>
                            <th className="px-4 py-4">עלות חודשית</th>
                            <th className="px-4 py-4">פירוט</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                          <tr><td className="px-4 py-4 font-bold">GreenAPI</td><td className="px-4 py-4 font-semibold text-warm-yellow">₪50–500</td><td className="px-4 py-4">הודעות דו־כיווניות בוואטסאפ</td></tr>
                          <tr><td className="px-4 py-4 font-bold">OpenAI</td><td className="px-4 py-4 font-semibold text-warm-yellow">₪20–200</td><td className="px-4 py-4">שיחות עם הבוט</td></tr>
                          <tr><td className="px-4 py-4 font-bold">Supabase</td><td className="px-4 py-4 font-semibold text-warm-yellow">₪25–100</td><td className="px-4 py-4">אחסון נתונים ואימות</td></tr>
                          <tr><td className="px-4 py-4 font-bold">דומיין ו־SSL</td><td className="px-4 py-4 font-semibold text-warm-yellow">₪15</td><td className="px-4 py-4">תחזוקה בסיסית</td></tr>
                          <tr className="bg-orange/20 font-bold text-xl">
                            <td className="px-4 py-5">סה"כ משוער:</td>
                            <td className="px-4 py-5 text-orange text-2xl">₪100–800</td>
                            <td className="px-4 py-5 text-navy/70">תלוי בכמות המשתמשים</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Signatures Section */}
            <div className="mt-12 pt-8 border-t-2 border-navy/20">
              <h2 className="text-3xl font-bold text-navy text-center mb-8">ולראיה באו הצדדים על החתום:</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Developer Signature */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange">חתימת המפתח</h3>
                  <div>
                    <label className="block text-navy font-bold mb-2">שם: {formData.developerName}</label>
                    <div className="border-3 border-warm-yellow rounded-xl overflow-hidden bg-white p-4 flex items-center justify-center">
                      {developerSignatureBase64 ? (
                        <img 
                          src={developerSignatureBase64}
                          alt="חתימת המפתח" 
                          className="max-h-32 object-contain"
                        />
                      ) : (
                        <div className="text-navy/50">טוען חתימה...</div>
                      )}
                    </div>
                    <p className="text-sm text-green-600 font-medium mt-2">✓ חתימה קבועה</p>
                  </div>
                  <p className="text-sm text-navy/70">תאריך: {formData.contractDate}</p>
                </div>

                {/* Client Signature */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange">חתימת הלקוח</h3>
                  <div>
                    <label className="block text-navy font-bold mb-2">שם: {formData.clientFullName}</label>
                    <div className="border-3 border-warm-yellow rounded-xl overflow-hidden bg-white">
                      <SignatureCanvas
                        ref={clientSigRef}
                        canvasProps={{
                          className: 'w-full h-32 cursor-crosshair',
                        }}
                        backgroundColor="rgb(255, 255, 255)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-orange hover:text-red-brown font-medium text-sm mt-2"
                    >
                      ניקוי חתימה
                    </button>
                  </div>
                  <p className="text-sm text-navy/70">תאריך: {formData.contractDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-12 mb-6 bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-2xl text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="px-12 pb-12 flex gap-4">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSending}
              whileHover={!isSending ? { scale: 1.02 } : {}}
              whileTap={!isSending ? { scale: 0.98 } : {}}
              className={`flex-1 py-4 rounded-2xl text-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                isSending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  חתימה ושליחת ההסכם
                </>
              )}
            </motion.button>

            {onBack && (
              <motion.button
                type="button"
                onClick={onBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl text-xl font-bold bg-gray-200 hover:bg-gray-300 text-navy transition-all"
              >
                חזרה
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contract;

