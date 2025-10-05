import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import Contract from './Contract';
import { 
  Sparkles, 
  Target, 
  Building2, 
  Smartphone, 
  MessageSquare, 
  Brain,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Check,
  Award,
  X,
  FileSignature,
  Send,
  Loader2
} from 'lucide-react';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const signatureRef = useRef(null);

  const scrollToContent = () => {
    document.getElementById('goals').scrollIntoView({ behavior: 'smooth' });
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!clientName.trim()) {
      setError('נא להזין שם מלא');
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setError('נא להזין אימייל תקין');
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      setError('נא לחתום בשדה החתימה');
      return;
    }

    setIsSending(true);

    try {
      const signatureDataUrl = signatureRef.current.toDataURL();

      const response = await fetch('http://localhost:3001/api/send-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          signatureDataUrl
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setShowSuccess(false);
          setShowContract(true);
        }, 2000);
      } else {
        setError(data.message || 'שגיאה בשליחת האישור');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('שגיאה בשליחת האישור. נא לנסות שוב.');
    } finally {
      setIsSending(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Show contract page if approved
  if (showContract) {
    return (
      <Contract 
        clientName={clientName} 
        clientEmail={clientEmail}
        onBack={() => {
          setShowContract(false);
          setClientName('');
          setClientEmail('');
          signatureRef.current?.clear();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream font-heebo">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy to-[#2a4a65] text-white overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-warm-yellow/10 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div 
            variants={fadeInUp}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Sparkles className="w-20 h-20 mx-auto text-warm-yellow" />
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              תוכנית ההבראה הפיננסית<br />
              <span className="text-warm-yellow">הדיגיטלית</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 text-cream/90 max-w-3xl mx-auto leading-relaxed"
            >
              מערכת SaaS חדשנית שמנהלת תקציב אישי,<br />
              מלווה את המשתמשים דרך וואטסאפ,<br />
              ומאפשרת בוט AI שמדבר איתם בשפה אנושית
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                variants={fadeInUp}
                onClick={scrollToContent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-warm-yellow hover:bg-orange text-navy px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 hover:shadow-warm-yellow/50"
              >
                לקריאה מלאה
              </motion.button>
              
              <motion.button
                variants={fadeInUp}
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 hover:shadow-green-500/50 flex items-center gap-3"
              >
                <FileSignature className="w-6 h-6" />
                אישור הצעת מחיר
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cream/50 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* Goals Section */}
      <motion.section
        id="goals"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Target className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h2 className="text-5xl font-bold text-navy mb-4">מטרות המערכת</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Users, text: "להנגיש ניהול תקציב לכל אדם" },
              { icon: MessageSquare, text: "לספק ליווי פיננסי שוטף בצורה פשוטה, קלילה ואנושית" },
              { icon: TrendingUp, text: "להפוך נתונים פיננסיים לתהליך מובן ומעורר מוטיבציה" },
              { icon: Sparkles, text: "ליצור חוויית שימוש צעירה וזורמת בשפה מדוברת" }
            ].map((goal, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-gradient-to-br from-cream to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-r-4 border-orange"
              >
                <goal.icon className="w-12 h-12 text-warm-yellow mb-4" />
                <p className="text-xl text-navy font-medium leading-relaxed">{goal.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* System Structure Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-gradient-to-br from-navy to-[#2a4a65] text-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-warm-yellow" />
            <h2 className="text-5xl font-bold mb-4">מבנה המערכת</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Public Website */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-warm-yellow/20 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-warm-yellow" />
                </div>
                <h3 className="text-2xl font-bold">אתר ציבורי (SaaS)</h3>
              </div>
              <ul className="space-y-3 text-cream/90">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-warm-yellow mt-1 flex-shrink-0" />
                  <span>דף בית שיווקי שמעביר את הערך בשלוש שניות</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-warm-yellow mt-1 flex-shrink-0" />
                  <span>הרשמה ותשלום בהוראת קבע דרך חשבונית ירוקה</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-warm-yellow mt-1 flex-shrink-0" />
                  <span>סרטון הסבר קצר / אנימציה על התהליך</span>
                </li>
              </ul>
            </motion.div>

            {/* User Area */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-orange/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-orange" />
                </div>
                <h3 className="text-2xl font-bold">אזור משתמש</h3>
              </div>
              <ul className="space-y-3 text-cream/90">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>דשבורד עם מד בריאות פיננסית</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>גרפים של הכנסות והוצאות</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>הזנה ידנית או דרך וואטסאפ</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>ניתוח OCR של קבלות</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>יעדים וחיסכון</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                  <span>תמיכה מלאה במובייל</span>
                </li>
              </ul>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-400/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold">וואטסאפ דו־כיווני</h3>
              </div>
              <ul className="space-y-3 text-cream/90">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>הודעות חכמות ותזכורות</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>קבלת הודעות טקסט ותמונות מהמשתמש</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>ניתוח אוטומטי והוספה למערכת</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>שיחה עם בוט AI שמעניק תובנות אישיות</span>
                </li>
              </ul>
            </motion.div>

            {/* Admin Interface */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-brown/30 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-2xl font-bold">ממשק אדמין</h3>
              </div>
              <ul className="space-y-3 text-cream/90">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-300 mt-1 flex-shrink-0" />
                  <span>צפייה בסטטוס משתמשים</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-300 mt-1 flex-shrink-0" />
                  <span>ניהול הודעות, מנויים ונתוני מערכת</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-300 mt-1 flex-shrink-0" />
                  <span>הפקת דוחות שימוש ופעילות</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Technologies Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Brain className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h2 className="text-5xl font-bold text-navy mb-4">טכנולוגיות</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-br from-cream to-warm-yellow/20 p-12 rounded-3xl shadow-xl text-center"
          >
            <p className="text-2xl text-navy font-medium leading-relaxed">
              React + Supabase + GreenAPI + OpenAI + Green Invoice + Vercel
            </p>
            <p className="text-lg text-navy/70 mt-4">
              עיצוב עם Tailwind / MagicUI, אנימציות Framer Motion
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Business Scenarios Table */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-gradient-to-br from-cream to-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-warm-yellow" />
            <h2 className="text-5xl font-bold text-navy mb-4">תרחישים עסקיים</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-navy/10">
              <table className="w-full text-right">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-6 py-5 text-lg font-bold">משתמשים פעילים</th>
                    <th className="px-6 py-5 text-lg font-bold">הודעות/יום</th>
                    <th className="px-6 py-5 text-lg font-bold">עלות וואטסאפ</th>
                    <th className="px-6 py-5 text-lg font-bold">עלות AI</th>
                    <th className="px-6 py-5 text-lg font-bold">אחסון Supabase</th>
                    <th className="px-6 py-5 text-lg font-bold bg-warm-yellow text-navy">סה"כ חודשי</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {[
                    { users: 50, messages: 200, whatsapp: 40, ai: 20, storage: 10, total: 70 },
                    { users: 100, messages: 400, whatsapp: 70, ai: 40, storage: 20, total: 120 },
                    { users: 500, messages: 2000, whatsapp: 250, ai: 100, storage: 50, total: 400 },
                    { users: 1000, messages: 4000, whatsapp: 500, ai: 200, storage: 100, total: 800 }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeInUp}
                      className="hover:bg-cream/50 transition-colors"
                    >
                      <td className="px-6 py-5 font-semibold text-navy">{row.users}</td>
                      <td className="px-6 py-5 text-navy/70">{row.messages.toLocaleString()}</td>
                      <td className="px-6 py-5 text-navy/70">₪{row.whatsapp}</td>
                      <td className="px-6 py-5 text-navy/70">₪{row.ai}</td>
                      <td className="px-6 py-5 text-navy/70">₪{row.storage}</td>
                      <td className="px-6 py-5 font-bold text-xl text-warm-yellow">₪{row.total}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-center mt-8 text-navy/60 text-lg">
            * העלויות החודשיות משוערות ותלויות בהיקף שימוש אמיתי
          </motion.p>
        </div>
      </motion.section>

      {/* Development Costs Table */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <DollarSign className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h2 className="text-5xl font-bold text-navy mb-4">פירוט עלויות פיתוח</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-navy/10">
              <table className="w-full text-right">
                <thead className="bg-gradient-to-l from-navy to-[#2a4a65] text-white">
                  <tr>
                    <th className="px-6 py-5 text-lg font-bold">רכיב</th>
                    <th className="px-6 py-5 text-lg font-bold">תיאור</th>
                    <th className="px-6 py-5 text-lg font-bold">שעות</th>
                    <th className="px-6 py-5 text-lg font-bold bg-warm-yellow text-navy">עלות (₪)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {[
                    { component: "אפיון ו־UX", description: "תכנון חוויית משתמש ומסכים", hours: 12, cost: 4200 },
                    { component: "דף שיווקי SaaS", description: "Hero, CTA, סליקה", hours: 10, cost: 3500 },
                    { component: "מערכת משתמשים", description: "דשבורד, גרפים, תקציב, יעדים", hours: 20, cost: 7000 },
                    { component: "וואטסאפ GreenAPI", description: "שליחה, קליטה, webhook", hours: 10, cost: 3500 },
                    { component: "אינטגרציית OpenAI", description: "שיחות בוט חכמות", hours: 8, cost: 2800 },
                    { component: "OCR", description: "זיהוי קבלות אוטומטי", hours: 6, cost: 2100 },
                    { component: "ממשק אדמין", description: "ניהול משתמשים ודוחות", hours: 8, cost: 2800 },
                    { component: "QA ונגישות", description: "בדיקות, תיקונים והשקה", hours: 6, cost: 2100 }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeInUp}
                      className="hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-navy">{row.component}</td>
                      <td className="px-6 py-5 text-navy/70">{row.description}</td>
                      <td className="px-6 py-5 font-semibold text-navy">{row.hours}</td>
                      <td className="px-6 py-5 font-bold text-warm-yellow text-lg">{row.cost.toLocaleString()}</td>
                    </motion.tr>
                  ))}
                  <tr className="bg-gradient-to-l from-warm-yellow/20 to-orange/10 font-bold text-xl">
                    <td className="px-6 py-6 text-navy" colSpan="2">סה״כ פיתוח:</td>
                    <td className="px-6 py-6 text-navy">80 שעות</td>
                    <td className="px-6 py-6 text-orange text-2xl">33,000 ₪ + מע״מ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Monthly Costs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-gradient-to-br from-cream to-warm-yellow/20"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h2 className="text-5xl font-bold text-navy mb-4">עלויות נלוות חודשיות</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-navy/10">
              <table className="w-full text-right">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-6 py-5 text-lg font-bold">רכיב</th>
                    <th className="px-6 py-5 text-lg font-bold">עלות חודשית</th>
                    <th className="px-6 py-5 text-lg font-bold">פירוט</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {[
                    { component: "GreenAPI", cost: "₪50–500", details: "הודעות דו־כיווניות בוואטסאפ" },
                    { component: "OpenAI", cost: "₪20–200", details: "שיחות עם הבוט" },
                    { component: "Supabase", cost: "₪25–100", details: "אחסון נתונים ואימות" },
                    { component: "דומיין ו־SSL", cost: "₪15", details: "תחזוקה בסיסית" }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeInUp}
                      className="hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-navy">{row.component}</td>
                      <td className="px-6 py-5 font-semibold text-warm-yellow text-lg">{row.cost}</td>
                      <td className="px-6 py-5 text-navy/70">{row.details}</td>
                    </motion.tr>
                  ))}
                  <tr className="bg-gradient-to-l from-orange/20 to-warm-yellow/20 font-bold text-xl">
                    <td className="px-6 py-6 text-navy">סה"כ חודשי משוער:</td>
                    <td className="px-6 py-6 text-orange text-2xl">₪100–800</td>
                    <td className="px-6 py-6 text-navy/70">תלוי בכמות המשתמשים</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Maintenance */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Award className="w-16 h-16 mx-auto mb-6 text-warm-yellow" />
            <h2 className="text-5xl font-bold text-navy mb-4">תחזוקה חודשית</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-br from-navy to-[#2a4a65] text-white rounded-3xl p-12 shadow-2xl"
          >
            <div className="text-center mb-10">
              <p className="text-6xl font-bold text-warm-yellow mb-4">₪1,000</p>
              <p className="text-2xl text-cream/80">לחודש (כולל מע״מ)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "ניטור וואטסאפ ו־AI",
                "עדכוני גרסאות ובאגים",
                "גיבויים וניהול תקשורת",
                "תמיכה טכנית (עד 5 שעות)"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                  <Check className="w-6 h-6 text-warm-yellow flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-gradient-to-br from-cream to-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Clock className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h2 className="text-5xl font-bold text-navy mb-4">לוח זמנים</h2>
            <p className="text-2xl text-navy/70 mt-4">סה״כ פרויקט: חודשיים (8 שבועות)</p>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full mt-6" />
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-navy/10">
              <table className="w-full text-right">
                <thead className="bg-gradient-to-l from-orange to-warm-yellow text-white">
                  <tr>
                    <th className="px-6 py-5 text-lg font-bold">שלב</th>
                    <th className="px-6 py-5 text-lg font-bold">משך</th>
                    <th className="px-6 py-5 text-lg font-bold">תוצר</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {[
                    { stage: "אפיון סופי ועיצוב UX", duration: "שבועיים", deliverable: "מסכים מאושרים" },
                    { stage: "פיתוח האתר והמערכת", duration: "שלושה שבועות", deliverable: "גרסה עובדת" },
                    { stage: "אינטגרציות וואטסאפ ו־AI", duration: "שבועיים", deliverable: "בוט פעיל" },
                    { stage: "בדיקות, תיקונים והשקה", duration: "שבוע", deliverable: "גרסה סופית" }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeInUp}
                      className="hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-navy">{row.stage}</td>
                      <td className="px-6 py-5 font-semibold text-warm-yellow text-lg">{row.duration}</td>
                      <td className="px-6 py-5 text-navy/70">{row.deliverable}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Payment Schedule */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <DollarSign className="w-16 h-16 mx-auto mb-6 text-warm-yellow" />
            <h2 className="text-5xl font-bold text-navy mb-4">מועדי תשלום</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-navy/10">
              <table className="w-full text-right">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-6 py-5 text-lg font-bold">שלב</th>
                    <th className="px-6 py-5 text-lg font-bold">אחוז</th>
                    <th className="px-6 py-5 text-lg font-bold">סכום (₪)</th>
                    <th className="px-6 py-5 text-lg font-bold">מועד</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {[
                    { stage: "חתימת הסכם והתחלת עבודה", percent: "30%", amount: "9,900 ₪ + מע״מ", timing: "עם תחילת העבודה" },
                    { stage: "לאחר סיום שלב הפיתוח הראשי", percent: "40%", amount: "13,200 ₪ + מע״מ", timing: "לאחר מסירה ראשונה" },
                    { stage: "עם סיום אינטגרציות ובדיקות", percent: "20%", amount: "6,600 ₪ + מע״מ", timing: "לפני ההשקה" },
                    { stage: "מסירה סופית והשקה לציבור", percent: "10%", amount: "3,300 ₪ + מע״מ", timing: "ביום העלייה לאוויר" }
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      variants={fadeInUp}
                      className="hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-5 font-bold text-navy">{row.stage}</td>
                      <td className="px-6 py-5 font-semibold text-orange text-lg">{row.percent}</td>
                      <td className="px-6 py-5 font-bold text-warm-yellow text-lg">{row.amount}</td>
                      <td className="px-6 py-5 text-navy/70">{row.timing}</td>
                    </motion.tr>
                  ))}
                  <tr className="bg-gradient-to-l from-warm-yellow/30 to-orange/20 font-bold text-xl">
                    <td className="px-6 py-6 text-navy">סה״כ כולל:</td>
                    <td className="px-6 py-6 text-orange">100%</td>
                    <td className="px-6 py-6 text-navy text-2xl" colSpan="2">33,000 ₪ + מע״מ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Summary & CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 bg-gradient-to-br from-navy via-[#2a4a65] to-navy text-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-warm-yellow rounded-full"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Sparkles className="w-20 h-20 mx-auto mb-8 text-warm-yellow" />
            <h2 className="text-5xl font-bold mb-8">סיכום</h2>
            <div className="w-24 h-1 bg-warm-yellow mx-auto rounded-full mb-12" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white/10 backdrop-blur-md p-12 rounded-3xl border border-white/20 mb-12"
          >
            <p className="text-xl md:text-2xl leading-relaxed text-cream/95 text-center">
              "תוכנית ההבראה הפיננסית הדיגיטלית" היא מערכת חדשנית שמחברת בין טכנולוגיה לבינה אנושית,
              ומאפשרת לכל משתמש לנהל את כספו בצורה פשוטה, אינטואיטיבית וחכמה.
              <br /><br />
              השפה, העיצוב והבינה המלאכותית יוצרים חוויית מוצר צעירה, אמינה ומרגשת.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-block bg-gradient-to-r from-warm-yellow via-orange to-red-brown p-1 rounded-3xl">
              <div className="bg-navy px-12 py-8 rounded-3xl">
                <p className="text-3xl font-bold mb-2">Triroars 🦁</p>
                <p className="text-xl text-cream/80">עיצוב ופיתוח חוויות דיגיטליות</p>
                <p className="text-lg text-cream/60 mt-2">בעולמות הבינה המלאכותית</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 left-8 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 z-40 group"
        aria-label="אישור הצעת מחיר"
      >
        <div className="relative">
          <FileSignature className="w-8 h-8" />
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-navy text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl">
            אישור הצעת מחיר
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-8 border-transparent border-t-navy" />
            </div>
          </div>
        </div>
      </motion.button>

      {/* Footer */}
      <footer className="bg-navy text-cream py-8 text-center border-t border-warm-yellow/20">
        <p className="text-sm">© 2025 Triroars - כל הזכויות שמורות</p>
      </footer>

      {/* Approval Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSending && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {!showSuccess ? (
                <>
                  {/* Modal Header */}
                  <div className="bg-gradient-to-l from-navy to-[#2a4a65] text-white p-8 rounded-t-3xl relative">
                    <button
                      onClick={() => !isSending && setShowModal(false)}
                      className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
                      disabled={isSending}
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                      <FileSignature className="w-16 h-16 mx-auto mb-4 text-warm-yellow" />
                      <h2 className="text-3xl font-bold mb-2">אישור הצעת מחיר</h2>
                      <p className="text-cream/80">תוכנית ההבראה הפיננסית הדיגיטלית</p>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-6">
                      {/* Name Input */}
                      <div>
                        <label className="block text-navy font-bold mb-2 text-lg">
                          שם מלא *
                        </label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="הזן את שמך המלא"
                          className="w-full px-4 py-3 border-2 border-cream rounded-2xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                          disabled={isSending}
                          required
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block text-navy font-bold mb-2 text-lg">
                          אימייל *
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border-2 border-cream rounded-2xl focus:border-warm-yellow focus:outline-none text-lg transition-colors"
                          disabled={isSending}
                          required
                        />
                      </div>

                      {/* Signature Pad */}
                      <div>
                        <label className="block text-navy font-bold mb-2 text-lg">
                          חתימה דיגיטלית *
                        </label>
                        <div className="border-3 border-warm-yellow rounded-2xl overflow-hidden bg-white">
                          <SignatureCanvas
                            ref={signatureRef}
                            canvasProps={{
                              className: 'w-full h-48 cursor-crosshair',
                            }}
                            backgroundColor="rgb(255, 255, 255)"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="text-orange hover:text-red-brown font-medium text-sm transition-colors"
                            disabled={isSending}
                          >
                            ניקוי חתימה
                          </button>
                          <p className="text-sm text-navy/60">חתום באצבע או בעכבר</p>
                        </div>
                      </div>

                      {/* Project Summary */}
                      <div className="bg-gradient-to-br from-cream to-warm-yellow/20 p-6 rounded-2xl">
                        <h3 className="text-navy font-bold text-xl mb-4 text-center">
                          📋 סיכום הפרויקט
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-navy/70">עלות כוללת:</span>
                            <span className="font-bold text-orange text-lg">33,000 ₪ + מע"מ</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-navy/70">משך פרויקט:</span>
                            <span className="font-bold text-navy">8 שבועות</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-navy/70">תחזוקה חודשית:</span>
                            <span className="font-bold text-navy">1,000 ₪</span>
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-2xl text-center"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSending}
                        whileHover={!isSending ? { scale: 1.02 } : {}}
                        whileTap={!isSending ? { scale: 0.98 } : {}}
                        className={`w-full py-4 rounded-2xl text-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
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
                            אישור ושליחה
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-sm text-navy/60 leading-relaxed">
                        בלחיצה על "אישור ושליחה" אני מאשר/ת את תנאי הצעת המחיר<br />
                        ומסכים/ה לתנאי העבודה המפורטים
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                // Success Message
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-14 h-14 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-navy mb-4">
                    האישור נשלח בהצלחה! 🎉
                  </h3>
                  <p className="text-xl text-navy/70 mb-2">
                    תודה על אישור הצעת המחיר
                  </p>
                  <p className="text-lg text-navy/60">
                    נחזור אליך תוך 24 שעות
                  </p>
                  <div className="mt-8 flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-3 h-3 bg-warm-yellow rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

