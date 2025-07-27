const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Performance Optimization: Enable compression for all responses
app.use(compression({
  level: 6, // Balance between compression ratio and CPU usage
  threshold: 1024, // Only compress if response > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS with specific origins for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-react-app.vercel.app', 'https://your-next-app.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Performance Optimization: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging in production only
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Performance Optimization: Efficient body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance Optimization: Cache control middleware
const cacheControl = (duration) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${duration}`);
  next();
};

// API Routes with performance optimizations
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Performance Optimization: Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000, // Limit response size for performance
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Performance Optimization: Add cache headers for static responses
    res.set('Cache-Control', 'private, max-age=300'); // 5 minutes
    res.json(data);
  } catch (error) {
    console.error('Generate endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Mock TTS response - replace with actual TTS service
    // Performance Optimization: Stream response for large audio files
    res.set({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600', // Cache audio for 1 hour
    });
    
    // For now, return a success response
    res.json({ message: 'TTS endpoint ready', audioUrl: '/api/audio/placeholder.mp3' });
  } catch (error) {
    console.error('Voice endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
});

app.post('/api/video', async (req, res) => {
  try {
    const { script } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    // Mock video generation - replace with actual Runway API
    res.json({ 
      message: 'Video generation started',
      jobId: Date.now().toString(),
      estimatedTime: '2-5 minutes'
    });
  } catch (error) {
    console.error('Video endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const { date, content } = req.body;
    
    if (!date || !content) {
      return res.status(400).json({ error: 'Date and content are required' });
    }

    // Mock scheduling logic
    res.json({ 
      message: 'Content scheduled successfully',
      scheduledFor: date,
      id: Date.now().toString()
    });
  } catch (error) {
    console.error('Schedule endpoint error:', error);
    res.status(500).json({ error: 'Failed to schedule content' });
  }
});

app.post('/api/planner', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Mock planner response
    res.json({ 
      reply: `Planner received: ${message}. Here's your content strategy...`,
      suggestions: [
        'Focus on trending topics',
        'Use engaging thumbnails',
        'Optimize for SEO'
      ]
    });
  } catch (error) {
    console.error('Planner endpoint error:', error);
    res.status(500).json({ error: 'Failed to process planner request' });
  }
});

// Performance Optimization: Health check endpoint with caching
app.get('/health', cacheControl(60), (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Performance Optimization: Static file serving with long cache
app.use('/static', express.static('public', {
  maxAge: '1y', // Cache static files for 1 year
  etag: true,
  lastModified: true
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Performance Optimization: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});