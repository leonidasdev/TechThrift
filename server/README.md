# Spanish Retailers Price Comparison API

A Node.js backend API for comparing prices across major Spanish retailers including Amazon España, PcComponentes, MediaMarkt, and El Corte Inglés.

## Features

- **Multi-retailer Search**: Search products across multiple Spanish retailers simultaneously
- **Price Comparison**: Get normalized product data with pricing information
- **Retailer Status**: Check the availability status of all supported retailers
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Helmet.js security headers and CORS configuration

## Supported Retailers

- **Amazon España** - Electronics, books, home, fashion, sports
- **PcComponentes** - Electronics, computers, gaming
- **MediaMarkt** - Electronics, appliances, gaming  
- **El Corte Inglés** - Electronics, fashion, home, books, sports

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Search Products
```
GET /api/search?q=<query>&category=<category>&minPrice=<price>&maxPrice=<price>&retailers=<retailer1,retailer2>
```

**Parameters:**
- `q` (required): Search query
- `category` (optional): Product category filter
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `retailers` (optional): Comma-separated list of retailer IDs

**Example:**
```
GET /api/search?q=laptop&minPrice=500&maxPrice=1000&retailers=amazon,pccomponentes
```

### Get Retailers
```
GET /api/retailers
```

Returns list of all supported retailers with their information.

### Get Retailer Status
```
GET /api/retailers/status
```

Returns the current status (online/offline) of all retailers.

### Health Check
```
GET /health
```

Returns server health status and uptime information.

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
- `AMAZON_ACCESS_KEY`: Amazon SP-API access key
- `AMAZON_SECRET_KEY`: Amazon SP-API secret key
- `AMAZON_PARTNER_TAG`: Amazon affiliate partner tag

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Start production server
npm start
```

## Architecture

- **Express.js**: Web framework
- **Modular Services**: Separate service classes for each retailer
- **Product Normalization**: Consistent product data structure across retailers
- **Error Handling**: Centralized error handling middleware
- **Logging**: Structured logging with timestamps
- **Security**: Helmet.js, CORS, and rate limiting

## Adding New Retailers

1. Create a new service file in `src/services/retailers/`
2. Implement the search method following the existing pattern
3. Add the retailer to the `RETAILER_SERVICES` object in `searchService.js`
4. Update the retailers list in `retailersController.js`

## License

MIT License