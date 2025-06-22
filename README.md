# TechThrift - Spanish Price Comparison Platform

A full-stack application that compares product prices across major Spanish retailers: Amazon.es, MediaMarkt, PCComponentes, and El Corte Inglés.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern React Architecture**: Functional components with hooks, lazy loading, and code splitting
- **Responsive Design**: Desktop-first layout optimized for all screen sizes
- **Advanced Search**: Text and image-based product search with intelligent suggestions
- **Real-time Comparison**: Side-by-side product comparison with best deal highlighting
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance Optimized**: Memoization, debounced inputs, and optimized bundle size

### Backend (Node.js + Express)
- **Web Scraping**: Automated data collection from 4 major Spanish retailers
- **RESTful API**: Clean, documented endpoints with proper error handling
- **Data Persistence**: Local JSON storage with duplicate prevention
- **Security**: Rate limiting, input validation, CORS, and security headers
- **Monitoring**: Comprehensive logging, health checks, and error tracking
- **Production Ready**: Graceful shutdown, environment configuration, and deployment scripts

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd spanish-price-comparison
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

### 4. Environment Configuration

#### Frontend (.env)
```bash
# Create .env file in root directory
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=TechThrift
VITE_APP_VERSION=1.0.0
```

#### Backend (server/.env)
```bash
# Copy example environment file
cp server/.env.example server/.env

# Edit server/.env with your configuration
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:5173
```

## 🚀 Development

### Start the development servers

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

## 🏗️ Production Build

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm start
```

## 📚 API Documentation

### Core Endpoints

#### Products
- `GET /api/products?q=<query>` - Search products from scraped data
- `GET /api/products/stats` - Get scraping statistics

#### Search
- `GET /api/search?q=<query>` - Search across all retailers
- `GET /api/search?q=laptop&minPrice=500&maxPrice=1000` - Search with filters

#### Retailers
- `GET /api/retailers` - Get supported retailers
- `GET /api/retailers/status` - Check retailer availability

#### Scraper
- `GET /api/scraper/status` - Get scraping status
- `POST /api/scraper/trigger` - Manually trigger scraping

#### Health & Monitoring
- `GET /api/health` - System health check
- `GET /api` - API documentation

### Rate Limits
- General: 100 requests per 15 minutes
- Search: 50 requests per 5 minutes

## 🧪 Testing

### Frontend
```bash
npm run test
npm run test:coverage
```

### Backend
```bash
cd server
npm run test
npm run test:watch
```

## 🔒 Security Features

- **Input Validation**: Joi schema validation for all inputs
- **Rate Limiting**: Configurable rate limits per endpoint
- **CORS Protection**: Whitelist-based origin control
- **Security Headers**: Helmet.js for secure HTTP headers
- **Input Sanitization**: XSS and injection prevention
- **Error Handling**: Secure error responses without data leakage

## 📊 Monitoring & Logging

- **Winston Logging**: Structured logging with multiple transports
- **Health Checks**: Comprehensive system status monitoring
- **Error Tracking**: Detailed error logging and reporting
- **Performance Metrics**: Request timing and system resource monitoring

## 🏪 Supported Retailers

| Retailer | Integration Type | Status |
|----------|------------------|--------|
| Amazon.es | Web Scraping | ✅ Active |
| MediaMarkt | Web Scraping | ✅ Active |
| PCComponentes | Web Scraping | ✅ Active |
| El Corte Inglés | Web Scraping | ✅ Active |

## 📁 Project Structure

```
spanish-price-comparison/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── common/              # Reusable components
│   │   ├── Layout/              # Layout components
│   │   ├── Products/            # Product-related components
│   │   └── Search/              # Search components
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── server/                      # Backend source code
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── scraper/             # Web scraping logic
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utility functions
│   ├── data/                    # Scraped data storage
│   └── logs/                    # Application logs
└── docs/                        # Documentation
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/VPS)
```bash
cd server
npm start
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-domain.com
LOG_LEVEL=warn
```

## 🔧 Configuration

### Scraping Configuration
- **Interval**: Every 6 hours (configurable)
- **Delay**: 2 seconds between requests
- **Timeout**: 30 seconds per request
- **Retries**: 3 attempts per failed request

### Performance Optimization
- **Code Splitting**: Lazy-loaded routes
- **Memoization**: React.memo and useMemo
- **Debouncing**: 300ms search input delay
- **Compression**: Gzip compression enabled
- **Caching**: Browser and API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cool-feature`)
3. Commit your changes (`git commit -m 'feat: cool feature'`)
4. Push to the branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/api`
- Review the health check at `/api/health`

## 🔄 Changelog

### v0.0.1
- Initial prototype
- Full-stack price comparison platform
- Web scraping for 4 Spanish retailers
- Real-time search and comparison
- Working progress security and monitoring