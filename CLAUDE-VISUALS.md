# CLAUDE.md — LUMINA VISUAL

הנחיות עבודה ליצירת ויז'ואלים לדמויות. תקף לכל יצירה בקלינג, היגספילד או כל מנוע אחר.

---

## עקרון על

**תנועה אחת גדולה ואיטית מנצחת עשר תנועות קטנות.**

הטעות הנפוצה היא לבקש "הרבה תנועה" ולקבל דמות עצבנית שנראית זולה. מה שעובד על קיר LED מול קהל הוא נוכחות: מחווה אחת רחבה שנפרשת לאורך שניות ארוכות, בלי לעצור ובלי למהר.

---

## חמשת הכללים

### 1. מסגור צמוד

פלג גוף עליון ופנים ממלאים את הפריים. **לא גוף מלא.**

דמות בגוף מלא נראית קטנה על מסך, ומרחוק ברחבת ריקודים היא הופכת לכתם. הפנים, הידיים והכתפיים הם מה שנקרא ממרחק.

בפרומפט: `tight framing on upper body and face, head and shoulders fill the frame, waist-up composition`

### 2. מבט ישיר

הדמות מסתכלת אל המצלמה, לא הצידה ולא למעלה. קשר עין עם הקהל הוא חצי מהאפקט.

בפרומפט: `eyes locked directly on the camera, steady unwavering gaze`

### 3. מחווה אחת מתמשכת

לא רצף של תנועות. **מחווה אחת שנפרשת לאורך כל הקליפ.**

הדפוס שעובד הכי טוב: ידיים שלובות על החזה, נפתחות לאט החוצה לצדדים, האצבעות נפרשות, הכתפיים נפתחות אחריהן.

בפרומפט: `arms begin crossed low over the chest, then unfold outward to the sides across the entire shot, fingers slowly spreading, shoulders opening with the movement, one single continuous gesture`

### 4. מצלמה שנכנסת פנימה לאורך כל הקליפ

בלי עצירה, בלי חזרה. דחיפה איטית ורציפה קדימה, או הקפה איטית סביב הדמות.

בפרומפט: `camera slowly and continuously pushing in toward the figure throughout the entire shot, never stopping`

לגיוון בין קליפים: להחליף בין דחיפה פנימה, הקפה, והתרחקות. שני קליפים ברצף עם אותה תנועת מצלמה מרגישים כמו אותו קליף.

### 5. עומק בשכבות

ערפל בחזית, דמות באמצע, אור מאחור. זה מה שיוצר תלת מימד אמיתי במקום תמונה שזזה.

בפרומפט: `layered volumetric fog at multiple depths, thin laser beams cutting between layers, strong rim lighting separating the figure from the background`

---

## מה לא לכתוב בפרומפט

| לא | למה |
|---|---|
| `slow hypnotic motion` | המנוע מפרש את זה כ"כמעט בלי תנועה" |
| `full body` | הדמות יוצאת קטנה ולא נקראת מרחוק |
| `camera locked off` | מבטל את כל תחושת העומק |
| `dancing`, `energetic` | יוצא מקוטע ורועד |
| `translucent glowing skin` | מפעיל את מסנן התוכן ונחסם |

## מה כן

תמיד לתאר את הדמות כ**לבושה** — שריון, בד, לוחות. זה גם מונע חסימות וגם נראה יקר יותר.

---

## תבנית פרומפט מוכנה

```
Tight waist-up composition of a [FIGURE], head and shoulders filling the frame,
eyes locked directly on the camera with a steady unwavering gaze.
She wears [ARMOR / GARMENT DESCRIPTION] with [GLOW DETAIL].
Elaborate [HEADDRESS] crowning her head.

Choreography: arms begin crossed low over the chest, then unfold outward to the
sides across the entire shot, fingers slowly spreading, shoulders opening with
the movement, torso rising slightly. One single continuous gesture, no cuts.

Camera slowly and continuously pushing in toward her throughout the entire shot.
Layered volumetric fog at multiple depths, thin laser beams cutting between the
layers, strong [COLOR] rim lighting separating her from the background.

Pure deep black background, [PALETTE] only, extreme contrast, cinematic
anamorphic lens with shallow depth of field, high-end 3D render, festival LED
video wall aesthetic. No text.
```

---

## פלטות שעובדות

| פלטה | שימוש |
|---|---|
| טורקיז וציאן | ברירת מחדל של המותג, הכי חזק על LED |
| זהב וענבר | דרופ, רגעי שיא |
| לבן־סגול אירידיסנטי | רגעים רומנטיים, כניסת חתן וכלה |
| שחור עם גחלים כתומות | קטעים כהים, אחרי חצות |

תמיד רקע שחור עמוק. שחור אמיתי הוא מה שגורם לזוהר לקפוץ קדימה על קיר LED.

---

## פרמטרים טכניים

**יצירה:** 16:9, 1080p, 10 שניות כשהתקציב מאפשר. עשר שניות נותנות למחווה להיפרש; חמש כמעט תמיד קצר מדי.

**עלות בקלינג:** 50 קרדיטים ל-5 שניות, 100 ל-10 שניות. המחיר לפי אורך.

**פלט לאולם:** 1920x1080, 24fps, H.264, CRF 17-19.

---

## עיבוד אחרי היצירה

כל קליפ עובר את הרצף הזה לפני שהוא נכנס ללופ:

1. **לופ הלוך־חזור** — הקליפ קדימה ואז אחורה, כדי שהתנועה לא תקפוץ חזרה להתחלה
2. **האטה ל-0.8** — נותן למחווה מקום לנשום
3. **דולי** — תנועת מצלמה נוספת בעיבוד, כיוון מתחלף בין קליפ לקליפ
4. **Bloom על אזורי אור בלבד** — סף בהירות 190 ומעלה, אחרת השחורים עולים והתמונה מתלכלכת
5. **גרייד** — קונטרסט 1.14, גמא 0.94. שחורים עמוקים
6. **וינייטה** — מכהה פינות, דוחף את העין למרכז
7. **מעברים** — התמוססות של 2.5 שניות בין דמות לדמות, אף פעם לא דרך שחור
8. **מיתוג** — הבלוק בפינה ימין למטה, שוליים 46 פיקסלים, שקיפות 0.88

**אורך מחזור:** 20 עד 25 שניות לדמות. פחות מזה והצופה לא מספיק להתחבר.

---

## פרטי מותג

```
LUMINA VISUAL
054-2216690
LuminaVisual.co.il
wa.me/972542216690
```

לוגו: Playfair Display, LUMINA בלבן, VISUAL בתכלת מתחת עם ריווח אותיות רחב, קו מפריד, ואז המספר והדומיין.
