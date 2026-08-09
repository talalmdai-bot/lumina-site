# LUMINA · Visuals for Event Halls

דף נחיתה של LUMINA: ויזואלים קולנועיים בתלת ממד למסכי LED באולמות אירועים.

## מה יש כאן
- `index.html` - הדף המלא (עצמאי, כולל כל העיצוב והקוד)
- `legal.html` - תקנון, מדיניות פרטיות והצהרת נגישות
- `a11y.js` - סרגל נגישות ובאנר עוגיות
- `api/lead.mjs` - פונקציית Vercel שמעבירה לידים לטלגרם
- `videos/` - ארבעה קליפי עולמות באיכות מלאה
- `js/three.min.js` - Three.js בארוח עצמי
- `vercel.json` - כותרות אבטחה
- `og-syncopate.jpg`, `favicon.svg` - תמונת שיתוף ואייקון

## פריסה ל-Vercel
1. נכנסים ל-vercel.com ומתחברים עם GitHub
2. Add New > Project > בוחרים את הריפו lumina-site
3. Framework Preset: Other. בלי הגדרות נוספות. Deploy
4. חיבור דומיין: Settings > Domains > מוסיפים את הדומיין ועוקבים אחרי הוראות ה-DNS

משתני הסביבה `TELEGRAM_BOT_TOKEN` ו-`TELEGRAM_CHAT_ID` מוגדרים בממשק Vercel בלבד. שינוי שלהם דורש Redeploy.

## הערות
- ששת סרטוני ההירו ו"על הרחבה" נטענים מ-CDN חיצוני של Higgsfield (53MB בסך הכול). זו נקודת כשל יחידה: אם החשבון שם ייסגר, ההירו ייפול. להחלפה לקבצים מקומיים צריך קודם לדחוס אותם עם ffmpeg, אחרת הריפו מתנפח ל-75MB. הנושא פתוח.
- אין `package.json` בשורש בכוונה: הוספתו תגרום ל-Vercel לפרש את `api/lead.mjs` אחרת ותשבור את הפונקציה.
