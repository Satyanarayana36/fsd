const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// ✅ Updated CORS for Vercel + Local
const allowedOrigins = [
    'https://fsd-ecgeq8j0m-satyanarayana36s-projects.vercel.app/',
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS blocked: ' + origin));
        }
    },
    credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ✅ Render root route
app.get('/', (req, res) => {
    res.send('✅ Backend is running...');
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
🚀 Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API: http://localhost:${PORT}
📊 Health: http://localhost:${PORT}/health
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

// ✅ Export app (useful for deployment/testing)
module.exports = app;
