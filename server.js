const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// تنظیمات آپلود
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// روت آپلود
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'هیچ فایلی آپلود نشد' });
    }
    res.json({
        success: true,
        file: req.file.filename,
        message: 'فایل با موفقیت آپلود شد'
    });
});

// روت دریافت بیماری‌ها
app.get('/api/diseases', (req, res) => {
    res.json({
        diseases: DISEASE_DATA,
        total: DISEASE_DATA.length
    });
});

// روت اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 سرور در پورت ${PORT} راه‌اندازی شد`);
});
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ===== روت اصلی =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== شروع سرور =====
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});