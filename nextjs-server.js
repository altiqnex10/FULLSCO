const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');

// استيراد الإعدادات والطرق من السيرفر الحالي
const { AppConfig } = require('./server/config/app-config');
const setupSessionMiddleware = require('./server/middlewares/session-middleware').setupSessionMiddleware;

// إعداد بيئة التطوير
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || AppConfig.server.port || 3000;

nextApp.prepare().then(() => {
  // إنشاء تطبيق Express
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // إعداد جلسات المستخدم
  setupSessionMiddleware(app);

  // تخديم مجلد التحميلات كمجلد ساكن
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // وسيط تسجيل الطلبات
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        console.log(logLine);
      }
    });

    next();
  });

  // تسجيل مسارات واجهة برمجة التطبيق
  // هنا نقوم بتسجيل مسارات API مباشرة
  app.use('/api', require('./server/routes/index').router);

  // معالجة الأخطاء العامة
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // توجيه باقي الطلبات إلى Next.js
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  // إنشاء خادم HTTP وبدء الاستماع
  createServer(app).listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> الخادم جاهز على http://localhost:${port}`);
  });
});