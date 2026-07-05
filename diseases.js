// ============================================================
// داده‌های ۲۴ بیماری
// ============================================================
const DISEASE_DATA = [
    // قارچی
    { id: 'powdery', name: 'سفید پودری', category: 'قارچی', icon: '🍄', level: 'low', regions: 28, desc: 'لکه‌های سفید پودری روی برگ', treatment: '✅ قارچ‌کش‌های گوگردی هر ۷-۱۰ روز' },
    { id: 'rust', name: 'زنگ برگ', category: 'قارچی', icon: '🍂', level: 'mid', regions: 35, desc: 'لکه‌های نارنجی یا قهوه‌ای روی برگ', treatment: '✅ قارچ‌کش‌های تریازول هر ۱۰ روز' },
    { id: 'fusarium', name: 'پژمردگی فوزاریوم', category: 'قارچی', icon: '🥀', level: 'high', regions: 22, desc: 'پژمردگی عروقی و زردی برگ‌ها', treatment: '✅ قارچ‌کش بنومیل + ضدعفونی خاک' },
    { id: 'gray_mold', name: 'کیک خاکستری', category: 'قارچی', icon: '🌫️', level: 'mid', regions: 18, desc: 'پوسیدگی خاکستری روی میوه و برگ', treatment: '✅ قارچ‌کش ایپرودیون + کاهش رطوبت' },
    { id: 'black_spot', name: 'لکه سیاه', category: 'قارچی', icon: '⚫', level: 'high', regions: 31, desc: 'لکه‌های گرد سیاه روی برگ', treatment: '✅ قارچ‌کش مانکوزب هر ۷-۱۰ روز' },
    { id: 'anthracnose', name: 'آنتراکنوز', category: 'قارچی', icon: '🍃', level: 'mid', regions: 16, desc: 'لکه‌های قهوه‌ای روی برگ و میوه', treatment: '✅ قارچ‌کش آزوکسی‌استروبین' },
    { id: 'downy_mildew', name: 'سفیدک داخلی', category: 'قارچی', icon: '🌿', level: 'mid', regions: 14, desc: 'لکه‌های زرد روی برگ', treatment: '✅ قارچ‌کش متالاکسیل هر ۷ روز' },
    { id: 'verticillium', name: 'پژمردگی ورتیسیلیوم', category: 'قارچی', icon: '🌾', level: 'high', regions: 12, desc: 'پژمردگی یک طرفه برگ‌ها', treatment: '✅ ضدعفونی خاک + تناوب زراعی' },
    { id: 'sclerotinia', name: 'پوسیدگی اسکلروتینیایی', category: 'قارچی', icon: '🧫', level: 'high', regions: 9, desc: 'پوسیدگی نرم ساقه و میوه', treatment: '✅ قارچ‌کش تیوفانات‌متیل' },
    // باکتریایی
    { id: 'bacterial_leaf_spot', name: 'لکه باکتریایی برگ', category: 'باکتریایی', icon: '🦠', level: 'high', regions: 13, desc: 'لکه‌های آب‌سوخته با هاله زرد', treatment: '✅ سموم مسی هر ۱۰ روز' },
    { id: 'fire_blight', name: 'آتشک درختان میوه', category: 'باکتریایی', icon: '🔥', level: 'high', regions: 8, desc: 'خشکیدگی شاخه‌ها با ترشح شیرابه', treatment: '✅ حذف شاخه‌های آلوده + سموم مسی' },
    { id: 'crown_gall', name: 'گال تاجی', category: 'باکتریایی', icon: '🌳', level: 'mid', regions: 7, desc: 'غده‌های توموری روی ریشه', treatment: '✅ حذف غده‌ها + ضدعفونی' },
    // ویروسی
    { id: 'mosaic', name: 'موزاییک ویروسی', category: 'ویروسی', icon: '🧩', level: 'mid', regions: 11, desc: 'لکه‌های زرد و سبز موزاییکی', treatment: '✅ کنترل ناقلین + حذف گیاهان آلوده' },
    { id: 'leaf_curl', name: 'پیچیدگی برگ', category: 'ویروسی', icon: '🌀', level: 'high', regions: 9, desc: 'پیچیدگی و بدشکلی برگ‌ها', treatment: '✅ مبارزه با ناقل + حذف گیاهان آلوده' },
    { id: 'yellow_dwarf', name: 'زردی کوتولگی', category: 'ویروسی', icon: '💛', level: 'high', regions: 6, desc: 'زردی و کوتولگی گیاه', treatment: '✅ ارقام مقاوم + کنترل ناقلین' },
    // آفات
    { id: 'aphid', name: 'شته گیاهی', category: 'آفت', icon: '🐜', level: 'low', regions: 42, desc: 'حشرات مکنده شیره گیاهی', treatment: '✅ ایمیداکلوپرید هر ۱۴ روز' },
    { id: 'spider_mite', name: 'کنه تارعنکبوتی', category: 'آفت', icon: '🕷️', level: 'mid', regions: 25, desc: 'لکه‌های سفید و تار زیر برگ', treatment: '✅ کنه‌کش آبامکتین + افزایش رطوبت' },
    { id: 'whitefly', name: 'مگس سفید', category: 'آفت', icon: '🪰', level: 'mid', regions: 19, desc: 'حشرات سفید زیر برگ با عسلک', treatment: '✅ پیریپروکسی‌فن + کارت‌های زرد' },
    { id: 'thrips', name: 'تریپس', category: 'آفت', icon: '🐛', level: 'low', regions: 15, desc: 'نقره‌ای شدن برگ و گل', treatment: '✅ اسپینوساد هر ۱۰ روز' },
    { id: 'leaf_miner', name: 'مگس برگ‌خوار', category: 'آفت', icon: '🪰', level: 'mid', regions: 12, desc: 'تونل‌های سفید داخل برگ', treatment: '✅ سایرمازین + حذف برگ‌های آلوده' },
    { id: 'codling_moth', name: 'کرم سیب', category: 'آفت', icon: '🍎', level: 'high', regions: 10, desc: 'کرم داخل میوه با فضولات', treatment: '✅ متوکسی‌فنوزاید + تله‌های فرمونی' },
    // فیزیولوژیک
    { id: 'chlorosis', name: 'زردی (کلروز)', category: 'فیزیولوژیک', icon: '💛', level: 'low', regions: 20, desc: 'زردی برگ به دلیل کمبود عناصر', treatment: '✅ کودهای کلات آهن و روی' },
    { id: 'blossom_end_rot', name: 'پوسیدگی گلگاه', category: 'فیزیولوژیک', icon: '🍅', level: 'mid', regions: 13, desc: 'لکه‌های قهوه‌ای انتهای میوه', treatment: '✅ محلول‌پاشی نیترات کلسیم' },
    { id: 'sun_scorch', name: 'سوختگی آفتاب', category: 'فیزیولوژیک', icon: '☀️', level: 'low', regions: 8, desc: 'سوختگی برگ در آفتاب مستقیم', treatment: '✅ سایه‌دهی + آبیاری منظم' }
];