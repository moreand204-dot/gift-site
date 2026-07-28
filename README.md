# A Gift To My Future Wife — موقع تفاعلي

موقع هدية رومانسية مبني بالكامل بـ **HTML5 + CSS3 + Vanilla JavaScript**، بأسلوب Dark Luxury وتجربة أشبه بفيلم تفاعلي.

## 🚀 كيف تُشغّل الموقع

المتصفحات تمنع تحميل الملفات عبر `fetch()` عند فتح `index.html` مباشرة (بروتوكول `file://`). لهذا شغّل خادماً محلياً بسيطاً من داخل مجلد المشروع:

```bash
# باستخدام Python (مثبت غالباً على كل جهاز)
python3 -m http.server 8080

# أو باستخدام Node
npx serve .
```

ثم افتح `http://localhost:8080` في المتصفح.

## 📁 هيكل المشروع

```
index.html            → الصفحة الرئيسية + شاشة التحميل (Preloader)
assets/
  images/              → صورك (استبدل placeholders)
  videos/              → أي فيديوهات اختيارية
  music/               → موسيقى الخلفية
  fonts/               → خطوط إضافية إن أردت
  icons/               → أيقونات مخصصة
css/
  main.css             → المتغيرات، الأساسيات، Glassmorphism
  animations.css        → كل الـ keyframes المشتركة
  responsive.css        → التجاوب مع الشاشات
  pages/
    intro.css           → شاشة التحميل + القسم الأول
    timeline.css         → قسم "رحلتنا"
    gallery.css          → قسم "المعرض" + Lightbox
    poems.css            → قسم "الشعر" (الكتاب ثلاثي الأبعاد)
    future.css           → قسم "المستقبل" + "النهاية"
js/
  loader.js            → يجلب أقسام الموقع من sections/ ويشغّل حركة القلم
  particles.js         → خلفية النجوم + الغبار الذهبي (Canvas مخصص)
  cursor.js            → المؤشر المخصص المتوهج
  effects.js           → القلم الذهبي، القلوب العائمة، العاصفة، الورود المتساقطة
  scroll.js            → Lenis للتمرير الناعم + شريط التقدم
  timeline.js          → ظهور محطات الـ Timeline عند التمرير
  book.js              → منطق تقليب صفحات الكتاب
  gallery.js           → منطق الـ Lightbox
  music.js             → تشغيل/إيقاف موسيقى الخلفية
  main.js              → المنسّق الرئيسي — يربط كل شيء معاً
sections/
  intro.html … ending.html   → محتوى كل قسم (8 ملفات HTML منفصلة)
```

## ✍️ الـ Placeholders التي يجب استبدالها

ابحث عن `{{...}}` في ملفات `sections/*.html` و `index.html` واستبدلها بمحتواك الحقيقي:

| Placeholder | الوصف |
|---|---|
| `{{HER_NAME}}` / `{{NICKNAME}}` | اسمها واسم دلعها |
| `{{FIRST_MESSAGE}}` … `{{FIRST_CONFESSION}}` | قصة البداية |
| `{{DATE_0X}}`, `{{PHOTO_0X}}`, `{{MILESTONE_0X_TITLE}}`, `{{MEMORY_0X}}` | محطات الـ Timeline (كرر البطاقة لإضافة محطات جديدة) |
| `{{FUNNY_MOMENT_0X}}` | اللحظات الجميلة |
| `{{PROBLEM_01}}` / `{{RESOLUTION_01}}` | قصة تخطي المشاكل |
| `{{POEM_01}}`, `{{POEM_LINE_01}}`, `{{LETTER_01}}`, `{{PRAYER_01}}`, `{{THOUGHTS_01}}` | صفحات كتاب الشعر |
| `{{GALLERY_PHOTO_0X}}` / `{{GALLERY_CAPTION_0X}}` | صور المعرض |
| `{{FUTURE_DREAM_*}}` | أحلام المستقبل |
| `{{MEMORY_PHOTO_A..H}}` | الصور داخل القلب في الختام |
| `{{BACKGROUND_MUSIC}}` | اسم ملف الموسيقى داخل `assets/music/` |

## 🎨 المكتبات المستخدمة (عبر CDN)

- **GSAP + ScrollTrigger** — جاهزة للاستخدام في أي حركة إضافية تريدها.
- **Lenis** — تمرير سينمائي ناعم.
- خلفية النجوم/الغبار الذهبي/المطر/الورود مبنية بـ Canvas و DOM مباشرة (بدون مكتبات خارجية) لتقليل الحجم وتحسين الأداء — يمكنك استبدالها بـ Particles.js أو Three.js إذا أردت مؤثرات أعمق.

## 📱 التجاوب والأداء

- الصور تستخدم `loading="lazy"`.
- المؤشر المخصص يُعطَّل تلقائياً على الأجهزة اللمسية.
- كل الحركات تحترم `prefers-reduced-motion`.
- التصميم مبني بنظام `clamp()` لمقاسات الخط، فهو يتجاوب مع كل الشاشات دون كسر.

## 🔧 لإضافة المزيد

- لإضافة محطة جديدة للـ Timeline: انسخ عنصر `.timeline__item` كاملاً داخل `sections/story.html`.
- لإضافة صفحة جديدة للكتاب: انسخ `.book__page` داخل `sections/poems.html`.
- لإضافة صورة جديدة للمعرض: انسخ `.gallery-item` داخل `sections/gallery.html`.
