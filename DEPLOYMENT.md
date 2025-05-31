# Deployment Guide

## Quick GitHub Repository Setup

1. **Create a new repository on GitHub**:
   - Go to GitHub.com and click "New repository"
   - Name it: `dataflow-studio`
   - Description: "A no-code ETL framework with visual pipeline designer"
   - Make it public
   - Don't initialize with README (we already have one)

2. **Connect your local project**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DataFlow Studio ETL Framework"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dataflow-studio.git
   git push -u origin main
   ```

## Production Deployment Options

### Option 1: Replit Deployment
- Use the built-in Replit deployment feature
- Your app will be available at `your-repl-name.replit.app`

### Option 2: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Option 3: Railway
1. Connect your GitHub repository
2. Railway will auto-detect the Node.js project
3. Environment variables can be set in the Railway dashboard

### Option 4: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t dataflow-studio .
docker run -p 5000:5000 dataflow-studio
```

## Environment Variables

For production deployment, set these environment variables:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_connection_string
```

## Database Setup

The application currently uses in-memory storage. For production:

1. **PostgreSQL Setup** (recommended):
   - Install PostgreSQL
   - Create a database
   - Update the connection string in environment variables

2. **Migration** (when using real database):
   - Implement Drizzle migrations
   - Run database initialization scripts

## Performance Considerations

- Enable compression middleware
- Use a CDN for static assets
- Configure database connection pooling
- Implement proper error logging
- Set up health checks

## Security

- Use HTTPS in production
- Implement proper authentication
- Validate all inputs
- Use environment variables for secrets
- Enable CORS protection