// ============================================================
// چت‌بات هوشمند
// ============================================================
const CHAT_RESPONSES = {
    'سلام': '🌱 سلام! چطور می‌توانم کمک کنم؟',
    'خوبی': '🌱 من خوبم! شما چطورید؟',
    'بیماری': '📚 لطفاً نام بیماری را بگویید.',
    'سفید پودری': '🍄 سفیدک پودری با قارچ‌کش گوگردی درمان می‌شود.',
    'زنگ برگ': '🍂 زنگ برگ با تریازول درمان می‌شود.',
    'فوزاریوم': '🥀 فوزاریوم با بنومیل و ضدعفونی خاک کنترل می‌شود.',
    'شته': '🐜 شته با ایمیداکلوپرید کنترل می‌شود.',
    'کنه': '🕷️ کنه با آبامکتین درمان می‌شود.',
    'درمان': '💊 برای درمان، تصویر برگ را آپلود کنید.',
    'تشخیص': '🤖 تصویر برگ را در بخش AI آپلود کنید.',
    'مشاور': '📞 شماره مشاور: ۰۹۳۸۱۴۹۱۰۵۸',
    'قارچی': '🍄 بیماری‌های قارچی با قارچ‌کش‌های مناسب درمان می‌شوند.',
    'باکتریایی': '🦠 بیماری‌های باکتریایی با سموم مسی درمان می‌شوند.',
    'ویروسی': '🧬 بیماری‌های ویروسی با کنترل ناقلین مدیریت می‌شوند.',
    'آفت': '🐛 آفات با سموم مخصوص کنترل می‌شوند.',
    'default': '🌱 سوال دقیق‌تری بپرسید یا با مشاور تماس بگیرید.\n📞 ۰۹۳۸۱۴۹۱۰۵۸'
};

function getChatResponse(input) {
    const lower = input.toLowerCase();
    for (const [key, value] of Object.entries(CHAT_RESPONSES)) {
        if (lower.includes(key)) return value;
    }
    return CHAT_RESPONSES['default'];
}

function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    window.classList.toggle('open');
    if (window.classList.contains('open')) {
        document.getElementById('chatInput').focus();
    }
}

function openChatbot() {
    const window = document.getElementById('chatbotWindow');
    if (!window.classList.contains('open')) toggleChatbot();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const messages = document.getElementById('chatMessages');
    const typing = document.getElementById('typingIndicator');

    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.innerHTML = msg + `<span class="time">همین الان</span>`;
    messages.appendChild(userMsg);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    addAdminMessage('کاربر', msg);

    typing.classList.add('show');
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        typing.classList.remove('show');
        const response = getChatResponse(msg);
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot';
        botMsg.innerHTML = response + `<span class="time">همین الان</span>`;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 800 + Math.random() * 600);
}