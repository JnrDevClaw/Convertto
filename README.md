# Convertto

Convertto is a production-grade unit conversion web application with integrated AI chatbot capabilities. It provides real-time conversion across 200+ units while offering intelligent assistance for complex conversions, cryptocurrency pricing, and financial calculations. Built with security, reliability, and scalability as core principles.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (HTML/CSS/JS) │◄──►│   (Express.js)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Real-time UI  │    │ • Auth (JWT)    │    │ • AI Providers  │
│ • Unit Selector │    │ • Rate Limiting │    │ • Crypto APIs   │
│ • Chat Interface│    │ • Cache Layer   │    │ • FX APIs       │
└─────────────────┘    └────────┬────────┘    └─────────────────┘
                                │
                      ┌─────────▼─────────┐
                      │   Database        │
                      │   (MongoDB)       │
                      │                   │
                      │ • Units Catalog   │
                      │ • Conversion Formulas│
                      │ • User Sessions   │
                      │ • Audit Logs      │
                      └───────────────────┘
```

### Data Flow
1. **User Request**: Frontend sends conversion request with source/target units and value
2. **Authentication**: JWT validation for protected routes (admin interface)
3. **Cache Check**: Redis/Memory cache lookup for common conversions
4. **Database Query**: Fetch conversion formula from MongoDB units catalog
5. **Calculation**: Apply bidirectional conversion logic from `/Processes/Convert1.js`
6. **AI Enhancement**: For complex queries, route to configurable AI provider
7. **Response**: Return calculated result with metadata

## ✨ Features

### Core Conversion Engine
*   **200+ Unit Conversions**: Comprehensive coverage across length, weight, temperature, volume, area, time, speed, pressure, energy, power, and digital units
*   **Bidirectional Logic**: Automatic reverse conversion (cm→km and km→cm) via formula generation
*   **Real-time Processing**: Instant results with client-side validation
*   **Category Management**: Dynamic category selection with extensible architecture

### AI-Powered Intelligence
*   **Multi-Provider AI**: Configurable integration with Azure AI, OpenAI, Anthropic, or custom endpoints
*   **Contextual Assistance**: AI chatbot provides conversion guidance, market data, and educational content
*   **Crypto & FX Integration**: Live cryptocurrency prices and foreign exchange rates
*   **Natural Language Processing**: Understand complex conversion requests like "convert 5 miles to kilometers and tell me the history"

### Enterprise Features
*   **Admin Dashboard**: Secure interface for managing units, categories, and conversion formulas
*   **Audit Logging**: Comprehensive activity tracking for compliance and debugging
*   **Rate Limiting**: Protection against abuse with configurable thresholds
*   **Caching Layer**: Optimized performance for frequently requested conversions

## 🔒 Security Architecture

### Threat Model
| Threat Vector | Mitigation Strategy | Implementation |
|---------------|-------------------|----------------|
| **API Key Exposure** | Environment isolation + rotation | `.env` files, vault integration |
| **Injection Attacks** | Input sanitization + validation | Express middleware, schema validation |
| **Brute Force** | Rate limiting + IP blocking | Express-rate-limit, fail2ban |
| **Data Exfiltration** | Role-based access control | JWT claims, admin-only routes |
| **Man-in-Middle** | HTTPS enforcement | TLS termination, HSTS headers |
| **XSS/CSRF** | Content Security Policy | Helmet.js, CSRF tokens |

### Authentication & Authorization
- **JWT Implementation**: HS256 algorithm with 24-hour expiration
- **Secret Management**: Strong random keys (32+ characters) stored in environment
- **Session Isolation**: Admin sessions separate from public conversion sessions
- **Audit Trail**: All admin actions logged with user ID and timestamp

### Data Protection
- **PII Handling**: No personal data collected during public conversions
- **Encryption**: TLS 1.3 for all communications
- **Database Security**: MongoDB authentication, network isolation
- **Compliance**: GDPR-ready with data minimization principles

## 🚀 Getting Started

### Prerequisites
*   **Node.js** 18+ ([Download](https://nodejs.org/))
*   **MongoDB** 5.0+ (local instance or Atlas cluster)
*   **Redis** (optional, for caching layer)
*   **AI Provider Account** (Azure AI, OpenAI, etc.)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/AlphaTechini/Convertto.git
cd Convertto

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your actual values:
# MONGODB_URI=mongodb://localhost:27017/convertto
# PORT=3000
# JWT_KEY=your-32-character-random-secret-key-here
# AI_PROVIDER=azure|openai|anthropic|custom
# AI_KEY=your-ai-provider-api-key

# 4. Initialize database (optional)
# Run conversion formula generator:
node Processes/CodeTransform.js
# Import generated convertedForMongoDB.json to MongoDB

# 5. Start development server
npm run dev
```

### Production Deployment
```bash
# Build optimized version
npm run build

# Start production server
npm start

# Docker deployment
docker build -f Dockerfile.dockerfile -t convertto .
docker run -p 3000:3000 -e MONGODB_URI=your-uri convertto
```

## 🛠️ Development Workflow

### Project Structure
```
Convertto/
├── app.js                 # Express application setup
├── server.js              # Server initialization
├── routes/                # API route handlers
│   ├── publicRoutes.js    # Public conversion endpoints
│   └── adminRoutes.js     # Protected admin endpoints
├── Processes/             # Conversion logic
│   ├── Convert1.js        # Unit conversion definitions
│   ├── CodeTransform.js   # Formula generator script
│   └── convertedForMongoDB.json # Generated database import
├── Connectors/            # External service integrations
├── Services/              # Business logic services
├── DB models/             # MongoDB schemas
├── Views/                 # Frontend templates
└── src/                   # Frontend source (if using build system)
```

### Adding New Units
1. **Define Conversion Logic**: Add formulas to `/Processes/Convert1.js`
2. **Generate Database Schema**: Run `node Processes/CodeTransform.js`
3. **Import to Database**: Load `convertedForMongoDB.json` into MongoDB collection
4. **Update Frontend**: Add new units to HTML unit selector
5. **Test Bidirectional**: Verify both directions work (A→B and B→A)

### AI Integration
Configure multiple AI providers in `.env`:
```bash
# Primary AI provider
AI_PROVIDER=azure
AI_KEY=sk-azure-your-key

# Fallback providers (comma-separated)
AI_FALLBACKS=openai,anthropic

# Custom endpoint (if AI_PROVIDER=custom)
AI_ENDPOINT=https://your-ai-service.com/v1/chat
```

## 📊 Operational Excellence

### Monitoring & Alerting
| Metric | Threshold | Alert Action |
|--------|-----------|--------------|
| **API Latency** | >2s p95 | PagerDuty alert |
| **Error Rate** | >5% | Slack notification |
| **Database CPU** | >80% | Auto-scale trigger |
| **AI Quota** | >90% used | Email warning |
| **Cache Hit Rate** | <70% | Performance review |

### Health Checks
- **/health**: Basic service status (HTTP 200 = healthy)
- **/health/database**: MongoDB connectivity test
- **/health/ai**: AI provider availability check
- **/metrics**: Prometheus-compatible metrics endpoint

### Backup & Recovery
- **Database Backups**: Daily snapshots with 30-day retention
- **Configuration Backup**: Version-controlled `.env` templates
- **Disaster Recovery**: Multi-region deployment capability
- **Rollback Procedure**: Git tag-based deployment rollback

## 📈 Scaling Patterns

### Horizontal Scaling
- **Stateless Backend**: Multiple Express instances behind load balancer
- **Database Sharding**: Shard by conversion category for high-volume units
- **Cache Distribution**: Redis cluster for shared conversion cache
- **Queue Processing**: Offload AI requests to background workers

### Performance Optimization
- **CDN Integration**: Serve static assets via Cloudflare/AWS CloudFront
- **Database Indexing**: Compound indexes on category + unit combinations
- **Connection Pooling**: MongoDB connection pool optimization
- **Compression**: Gzip/Brotli compression for API responses

### Cost Management
- **AI Provider Rotation**: Automatic failover to cheaper providers
- **Caching Strategy**: LRU cache for expensive conversion calculations
- **Batch Processing**: Aggregate crypto price updates to reduce API calls
- **Resource Monitoring**: Real-time cost tracking per feature

## 🔌 Integration Patterns

### CI/CD Pipeline
```yaml
# GitHub Actions example
name: Deploy Convertto
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - name: Deploy to Production
        run: ./deploy.sh
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          AI_KEY: ${{ secrets.AI_KEY }}
```

### Webhook Integration
Receive real-time updates for crypto prices:
```javascript
// POST /webhooks/crypto-prices
app.post('/webhooks/crypto-prices', webhookAuth, (req, res) => {
  const { symbol, price, timestamp } = req.body;
  // Update cached prices
  priceCache.set(symbol, { price, timestamp });
  res.status(200).json({ success: true });
});
```

### API Consumption
Integrate Convertto into other applications:
```javascript
// GET /api/convert?from=USD&to=EUR&amount=100
const response = await fetch('https://convertto.example/api/convert', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer your-api-key' }
});
const result = await response.json();
// { from: 'USD', to: 'EUR', amount: 100, result: 92.45, rate: 0.9245 }
```

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Conversion logic, formula generation (`npm test:unit`)
- **Integration Tests**: API endpoints, database interactions (`npm test:integration`)
- **E2E Tests**: Full user journey, AI chatbot functionality (`npm test:e2e`)
- **Performance Tests**: Load testing, stress testing (`npm test:performance`)

### Test Data Management
- **Isolated Test Database**: Separate MongoDB instance for tests
- **Fixture Generation**: Automated test data creation scripts
- **Mock External Services**: Stub AI providers and crypto APIs
- **Snapshot Testing**: Verify conversion results don't regress

## 🤝 Contributing

### Development Guidelines
1. **Architecture First**: Propose significant changes via issue before implementation
2. **Security Review**: All PRs require security consideration documentation
3. **Performance Impact**: Include benchmarks for performance-sensitive changes
4. **Backward Compatibility**: Maintain API compatibility across minor versions

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature branches (e.g., `feature/crypto-charting`)
- **hotfix/**: Critical bug fixes (e.g., `hotfix/rate-limit-bypass`)

### Code Quality
- **ESLint**: Enforced coding standards
- **Prettier**: Automatic code formatting
- **TypeScript**: Gradual migration path for type safety
- **Documentation**: Update README for all public-facing changes

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support & Maintenance

### Issue Response SLA
- **Critical Security**: 24 hours
- **Major Bugs**: 3 business days  
- **Feature Requests**: 7 business days
- **Questions**: 5 business days

### Version Support
- **Current**: Active development and bug fixes
- **Previous**: Security patches only (6 months)
- **Legacy**: No support (upgrade recommended)

### Contact
For security vulnerabilities: security@cyberpunkinc.xyz
For general inquiries: alpha@cyberpunkinc.xyz

---

**Note**: The units provided in the HTML file and the `/Processes/convertedForMongoDB.json` may not be exhaustive or perfectly synchronized. Users should treat these as templates and refer to the actual units stored in their database for accurate conversions. Always validate critical conversions against authoritative sources before production use.