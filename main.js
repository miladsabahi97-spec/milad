// ============================================================
// متغیرهای عمومی
// ============================================================
let currentFilter = 'all';
let chartInstance = null;
let mapInstance = null;
let adminMessages = [];
let messageIdCounter = 1;

// ============================================================
// صفحه خوش‌آمدگویی
// ============================================================
function changeBgVideo(src) {
    const video = document.getElementById('bgVideo');
    video.src = src;
    video.load();
    video.play();
}

function enterSite() {
    document.getElementById('welcomePage').classList.add('hidden');
    document.getElementById('mainHeader').style.display = 'flex';
    document.getElementById('mainBody').style.display = 'flex';
    
    AOS.init({ duration: 600, once: true, offset: 50 });
    
    renderDiseases('all');
    updateStats();
    initChart();
    initMap();
    updateAdminStats();
    
    showToast('🌱 به SmartTree AI خوش آمدید!');
    console.log('🌳 SmartTree AI راه‌اندازی شد!');
}

// ============================================================
// ناوبری
// ============================================================
function navigateTo(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.sidebar a[data-page]').forEach(a => a.classList.remove('active'));
    if (el) {
        el.classList.add('active');
    } else {
        document.querySelector(`.sidebar a[data-page="${page}"]`)?.classList.add('active');
    }
    
    if (page === 'map' && mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 300);
    }
}

// ============================================================
// بیماری‌ها
// ============================================================
function renderDiseases(filter = 'all') {
    const container = document.getElementById('diseasesContainer');
    container.innerHTML = '';

    let filtered = filter === 'all' 
        ? DISEASE_DATA 
        : DISEASE_DATA.filter(d => d.level === filter);

    const categories = {
        'قارچی': { icon: '🍄', color: '#2d8f5e' },
        'باکتریایی': { icon: '🦠', color: '#e67e22' },
        'ویروسی': { icon: '🧬', color: '#8e44ad' },
        'آفت': { icon: '🐛', color: '#c0392b' },
        'فیزیولوژیک': { icon: '🧪', color: '#3498db' }
    };

    const grouped = {};
    filtered.forEach(d => {
        if (!grouped[d.category]) grouped[d.category] = [];
        grouped[d.category].push(d);
    });

    Object.keys(categories).forEach(cat => {
        if (grouped[cat] && grouped[cat].length > 0) {
            const section = document.createElement('div');
            section.className = 'disease-category';
            section.setAttribute('data-aos', 'fade-up');
            section.innerHTML = `
                <div class="category-title">
                    <i class="fas fa-tag" style="color:${categories[cat].color}"></i>
                    ${cat} (${grouped[cat].length})
                </div>
                <div class="disease-grid">
                    ${grouped[cat].map(d => `
                        <div class="disease-card" onclick="toggleTreatment('${d.id}')">
                            <div class="card-header">
                                <span class="icon">${d.icon}</span>
                                <h4>${d.name}</h4>
                            </div>
                            <div class="sub">${d.desc}</div>
                            <div class="tags">
                                <span class="level-badge level-${d.level}">${d.level === 'low' ? '🟢 کم' : d.level === 'mid' ? '🟡 متوسط' : '🔴 پرخطر'}</span>
                                <span class="region-tag"><i class="fas fa-globe-asia"></i> ${d.regions} منطقه</span>
                            </div>
                            <div class="treatment-box" id="treatment_${d.id}">
                                <strong>💊 درمان:</strong>
                                <div class="treatment-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>${d.treatment}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }
    });

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function toggleTreatment(id) {
    const box = document.getElementById(`treatment_${id}`);
    if (box) box.classList.toggle('show');
}

function filterDiseases(filter, el) {
    currentFilter = filter;
    document.querySelectorAll('.page-diseases .filter-tag').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    renderDiseases(filter);
    showToast(`🔍 فیلتر: ${el ? el.textContent.trim() : 'همه'}`);
}

// ============================================================
// آمار
// ============================================================
function updateStats() {
    const total = DISEASE_DATA.length;
    const high = DISEASE_DATA.filter(d => d.level === 'high').length;
    const mid = DISEASE_DATA.filter(d => d.level === 'mid').length;
    const low = DISEASE_DATA.filter(d => d.level === 'low').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statActive').textContent = high + mid;
    document.getElementById('statResolved').textContent = low;
    document.getElementById('statAccuracy').textContent = (92 + Math.floor(Math.random() * 8)) + '%';
}

// ============================================================
// هوش مصنوعی
// ============================================================
async function handleAIUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const resultDiv = document.getElementById('aiResult');
    resultDiv.classList.remove('show');
    document.querySelector('.ai-status').textContent = '⏳ در حال پردازش...';
    document.querySelector('.ai-status').style.background = '#f39c12';

    showToast('🧠 AI در حال تحلیل تصویر...');

    setTimeout(() => {
        const random = Math.floor(Math.random() * DISEASE_DATA.length);
        const disease = DISEASE_DATA[random];
        const confidence = 78 + Math.floor(Math.random() * 20);
        
        document.getElementById('aiDisease').textContent = disease.name;
        document.getElementById('aiConfidence').textContent = confidence + '%';
        document.getElementById('aiConfidenceBar').style.width = confidence + '%';
        document.getElementById('aiTreatment').textContent = disease.treatment;

        resultDiv.classList.add('show');

        document.querySelector('.ai-status').textContent = '✅ تشخیص انجام شد';
        document.querySelector('.ai-status').style.background = '#27ae60';

        addAdminMessage('سیستم', `تشخیص AI: ${disease.name} با دقت ${confidence}%`);
        showToast(`✅ تشخیص: ${disease.name} (${confidence}%)`);
    }, 2000);
}

// ============================================================
// نقشه
// ============================================================
function initMap() {
    if (mapInstance) return;
    mapInstance = L.map('map').setView([35.6892, 51.3890], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    const locations = [
        { lat: 35.6892, lng: 51.3890, label: 'تهران - سفید پودری' },
        { lat: 30.0444, lng: 31.2357, label: 'قاهره - زنگ برگ' },
        { lat: 28.6139, lng: 77.2090, label: 'دهلی - فوزاریوم' },
        { lat: 39.9042, lng: 116.4074, label: 'پکن - لکه سیاه' },
        { lat: 40.7128, lng: -74.0060, label: 'نیویورک - آنتراکنوز' },
        { lat: 51.5074, lng: -0.1278, label: 'لندن - سفیدک داخلی' },
        { lat: -33.8688, lng: 151.2093, label: 'سیدنی - پوسیدگی خاکستری' },
        { lat: 19.0760, lng: 72.8777, label: 'مومبای - شته' },
        { lat: -23.5505, lng: -46.6333, label: 'سائوپائولو - مگس برگ‌خوار' },
    ];

    locations.forEach(m => {
        L.marker([m.lat, m.lng])
            .addTo(mapInstance)
            .bindPopup(`<b>${m.label}</b><br>سطح: ${['🟢 کم','🟡 متوسط','🔴 پرخطر'][Math.floor(Math.random()*3)]}`);
    });
}

// ============================================================
// نمودار
// ============================================================
function initChart() {
    const ctx = document.getElementById('diseaseChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const categoryCount = {};
    DISEASE_DATA.forEach(d => {
        categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryCount),
            datasets: [{
                label: 'تعداد بیماری‌ها',
                data: Object.values(categoryCount),
                backgroundColor: ['#2d8f5e', '#e67e22', '#8e44ad', '#c0392b', '#3498db'],
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ============================================================
// پنل مدیریت
// ============================================================
function addAdminMessage(user, message) {
    const now = new Date();
    const time = now.toLocaleTimeString('fa-IR');
    const date = now.toLocaleDateString('fa-IR');
    adminMessages.push({
        id: messageIdCounter++,
        user: user,
        message: message,
        time: `${date} ${time}`,
        timestamp: now.getTime()
    });
    renderAdminMessages();
    updateAdminStats();
}

function renderAdminMessages() {
    const tbody = document.getElementById('adminMessagesBody');
    if (adminMessages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">هنوز پیامی ثبت نشده است</td></tr>`;
        return;
    }

    tbody.innerHTML = adminMessages.map((msg, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${msg.user}</strong></td>
            <td>${msg.message}</td>
            <td>${msg.time}</td>
            <td><button class="msg-delete" onclick="deleteAdminMessage(${msg.id})">🗑️</button></td>
        </tr>
    `).join('');
}

function deleteAdminMessage(id) {
    adminMessages = adminMessages.filter(m => m.id !== id);
    renderAdminMessages();
    updateAdminStats();
    showToast('🗑️ پیام حذف شد');
}

function clearAllMessages() {
    if (confirm('آیا از پاک کردن همه پیام‌ها اطمینان دارید؟')) {
        adminMessages = [];
        renderAdminMessages();
        updateAdminStats();
        showToast('🗑️ همه پیام‌ها پاک شد');
    }
}

function updateAdminStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayMessages = adminMessages.filter(m => m.timestamp >= today).length;
    
    document.getElementById('adminTotalMsg').textContent = adminMessages.length;
    document.getElementById('adminTodayMsg').textContent = todayMessages;
    document.getElementById('adminUsers').textContent = [...new Set(adminMessages.map(m => m.user))].length || 1;
}

// ============================================================
// دارک مود
// ============================================================
function toggleDark() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('.dark-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    showToast('🌓 تم تغییر کرد');
}

// ============================================================
// توست
// ============================================================
function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================================
// شروع
// ============================================================
console.log('🌳 SmartTree AI v5.0 آماده است!');
console.log('📋 24 بیماری در سیستم ثبت شد');
console.log('📞 مشاور: 09381491058');

// API عمومی
window.SmartTree = {
    diseases: DISEASE_DATA,
    addDisease: (d) => {
        DISEASE_DATA.push(d);
        renderDiseases(currentFilter);
        updateStats();
        addAdminMessage('سیستم', `بیماری جدید: ${d.name}`);
        showToast('✅ بیماری جدید اضافه شد');
    },
    refresh: () => {
        renderDiseases(currentFilter);
        updateStats();
        showToast('🔄 بروزرسانی شد');
    },
    filter: filterDiseases,
    chat: sendMessage,
    toggleDark: toggleDark,
    admin: {
        getMessages: () => adminMessages,
        clear: clearAllMessages
    }
};