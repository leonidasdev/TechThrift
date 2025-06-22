# TechThrift - Spanish Price Comparison Platform

TechThrift is a comprehensive price comparison platform that helps Spanish consumers find the best deals across major retailers including Amazon.es, MediaMarkt, PCComponentes, and El Corte Inglés.

## 🚀 Features

- **Multi-Store Price Comparison**: Compare prices across major Spanish retailers
- **Real-time Search**: Instant product search with live results
- **Smart Filtering**: Filter by price range, store, and product categories
- **Responsive Design**: Optimized for desktop and mobile devices
- **Fast Performance**: Built with modern web technologies for optimal speed

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend (Server)
- **Node.js** with Express
- **JavaScript** with ES modules
- **Web Scraping** with Puppeteer and Cheerio
- **SQLite** database
- **Winston** for logging

## 📁 Project Structure

```
techthrift/
├── .gitignore                  # Git ignore rules
├── package.json                # Workspace configuration
├── README.md                   # Project documentation
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.node.json          # Node.js TypeScript configuration
│
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── App.tsx             # Main App component
│   │   ├── main.tsx            # Application entry point
│   │   ├── index.css           # Global styles
│   │   ├── vite-env.d.ts       # Vite environment types
│   │   ├── components/         # UI components
│   │   │   ├── common/         # Shared components
│   │   │   ├── Comparison/     # Price comparison components
│   │   │   ├── Filters/        # Filter components
│   │   │   ├── Layout/         # Layout components
│   │   │   ├── Products/       # Product-related components
│   │   │   └── Search/         # Search components
│   │   ├── data/               # Static data and configurations
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Route-based page components
│   │   ├── services/           # API service handlers
│   │   ├── tests/              # Frontend test files
│   │   └── types/              # TypeScript type definitions
│   ├── index.html              # HTML template
│   ├── package.json            # Client dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── tsconfig.json           # TypeScript project references
│   ├── tsconfig.app.json       # App-specific TypeScript config
│   └── tsconfig.node.json      # Build tools TypeScript config
│
└── server/                     # Backend Node.js application
    ├── src/
    │   ├── server.js           # Main server entry point
    │   ├── controllers/        # Route controllers
    │   │   └── alertsController.js
    │   ├── database/           # Database configuration
    │   ├── middleware/         # Express middleware
    │   ├── routes/             # API route definitions
    │   ├── scraper/            # Web scraping logic
    │   ├── services/           # Business logic services
    │   ├── tests/              # Server test files
    │   └── utils/              # Backend utility functions
    ├── .env.example            # Environment variables template
    ├── package.json            # Server dependencies
    └── README.md               # Server-specific documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/techthrift.git
   cd techthrift
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   This command will install dependencies for the root workspace, client, and server.

### Development

#### Start Both Frontend and Backend
```bash
npm run dev
```
This starts both the client and server concurrently:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

#### Start Individual Services

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

**Or navigate to specific directories:**
```bash
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev
```

### Building for Production

#### Build Both Applications
```bash
npm run build
```

#### Build Individual Applications
```bash
# Build frontend only
npm run build:client

# Build backend only
npm run build:server
```

### Other Commands

#### Linting
```bash
# Lint client code
npm run lint

# Auto-fix linting issues
cd client
npm run lint:fix
```

#### Testing
```bash
# Run all tests
npm run test

# Run client tests only
cd client
npm run test

# Run tests with UI
cd client
npm run test:ui

# Run tests with coverage
cd client
npm run test:coverage
```

#### Type Checking
```bash
# Check TypeScript types
cd client
npm run type-check
```

## 🏪 Supported Stores

- **Amazon.es** - Spain's largest online marketplace
- **MediaMarkt** - Electronics and technology retailer
- **PCComponentes** - Computer components and electronics
- **El Corte Inglés** - Premium department store chain

## 🔧 Configuration

### Environment Variables

Create `.env` files in the appropriate directories:

**Client (.env)**
```env
VITE_API_URL=http://localhost:3001/api
```

**Server (.env)**
```env
PORT=3001
NODE_ENV=development
```

### Vite Configuration

The Vite configuration includes:
- Path aliases for clean imports
- Proxy setup for API calls
- Optimized build settings
- Development server configuration

### API Proxy

The frontend is configured to proxy API calls to the backend:
- Development: `http://localhost:3001/api`
- All `/api` requests

## 🚀 Deployment

### Frontend Deployment
The client builds to a `dist` folder that can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
The server can be deployed to:
- Railway
- Heroku
- DigitalOcean
- AWS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Search existing [GitHub Issues](https://github.com/leonidasdev/techthrift/issues)
3. Create a new issue if needed

## 🏗️ Development Workflow

1. **Start development servers**: `npm run dev`
2. **Make changes** to client or server code
3. **Hot reload** automatically updates the application
4. **Test your changes**: `npm run test`
5. **Lint your code**: `npm run lint`
6. **Build for production**: `npm run build`
