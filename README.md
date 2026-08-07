# LUMINA · Visuals for Event Halls

דף נחיתה של LUMINA: ויזואלים קולנועיים בתלת ממד למסכי LED באולמות אירועים.

## מה יש כאן
- `index.html` - הדף המלא (עצמאי, כולל כל העיצוב והקוד)
- `videos/` - חמשת קליפי העולמות באיכות מלאה
- `js/` - ספריות Three.js ו-Lenis בארוח עצמי
- `og.jpg`, `favicon.svg` - תמונת שיתוף ואייקון

## פריסה ל-Vercel
1. נכנסים ל-vercel.com ומתחברים עם GitHub
2. Add New > Project > בוחרים את הריפו lumina-site
3. Framework Preset: Other. בלי הגדרות נוספות. Deploy
4. חיבור דומיין: Settings > Domains > מוסיפים את הדומיין ועוקבים אחרי הוראות ה-DNS

## הערות
- סרטוני ההירו נטענים כרגע מ-CDN חיצוני של Higgsfield. להחלפה לקבצים מקומיים: להוריד את 4 הסרטונים, לשים ב-videos/ ולעדכן את הנתיבים ב-index.html
- מספר הוואטסאפ בדף הוא placeholder (972500000000) ויש להחליפו לפני הפצה
