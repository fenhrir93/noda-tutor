const path = require('path');
const express = require('express');
const expressHb = require('express-handlebars');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin/admin');
const shopRoutes = require('./routes/shop/shop');
const { pageNotFoundController } = require('./controllers/404');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.engine(
  'hbs',
  expressHb.engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// 404 handler
app.use(pageNotFoundController);

// Global error handler
// app.use((err, req, res, next) => {
//     console.error('🔥 Error:', err.stack);
//     res.status(500).render('error', {
//         pageTitle: 'Error',
//         message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
//     });
// });

app.listen(port, (e) => {
  if (e) {
    console.error('🔥 Failed to start server:', e.message);
    process.exit(1);
  }

  console.info('🚀 Initializing server...');
  console.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.info(`🔌 Listening on port: ${port}`);
  console.info(`🌐 Server URL: http://localhost:${port}`);
  console.info('✅ Server is ready to handle requests\n');

  process.on('SIGTERM', () => {
    console.info('👋 SIGTERM received. Performing graceful shutdown...');
    server.close(() => {
      console.info('🔄 Server closed');
      process.exit(0);
    });
  });
});
