#!/bin/bash

# AutoCreator AI - Production Deployment Script
# This script optimizes and deploys the application with performance best practices

set -e  # Exit on any error

echo "🚀 Starting AutoCreator AI deployment..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "NODE_ENV"
        "OPENROUTER_KEY"
        "PORT"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            print_error "Environment variable $var is not set"
            exit 1
        fi
    done
    
    print_success "Environment variables validated"
}

# Install dependencies with optimization
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend dependencies
    npm ci --only=production --silent
    
    # Frontend dependencies
    cd frontend/react-app
    npm ci --silent
    cd ../..
    
    print_success "Dependencies installed"
}

# Build optimized frontend
build_frontend() {
    print_status "Building optimized frontend..."
    
    cd frontend/react-app
    
    # Set production environment
    export NODE_ENV=production
    
    # Build with optimizations
    npm run build
    
    # Analyze bundle size
    print_status "Analyzing bundle size..."
    npm run build:analyze
    
    # Check bundle size limits
    BUNDLE_SIZE=$(du -sk dist | cut -f1)
    MAX_SIZE=500  # 500KB limit
    
    if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
        print_warning "Bundle size (${BUNDLE_SIZE}KB) exceeds limit (${MAX_SIZE}KB)"
    else
        print_success "Bundle size (${BUNDLE_SIZE}KB) within limits"
    fi
    
    cd ../..
    
    print_success "Frontend build completed"
}

# Optimize images and assets
optimize_assets() {
    print_status "Optimizing assets..."
    
    cd frontend/react-app/dist
    
    # Compress images if imagemin is available
    if command -v imagemin &> /dev/null; then
        find . -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs imagemin --out-dir=.
        print_success "Images optimized"
    else
        print_warning "imagemin not found, skipping image optimization"
    fi
    
    # Generate service worker
    if command -v workbox &> /dev/null; then
        workbox generateSW workbox-config.js
        print_success "Service worker generated"
    fi
    
    cd ../../..
}

# Run security checks
security_checks() {
    print_status "Running security checks..."
    
    # Check for vulnerabilities
    npm audit --audit-level high
    
    # Check frontend dependencies
    cd frontend/react-app
    npm audit --audit-level high
    cd ../..
    
    print_success "Security checks completed"
}

# Performance tests
performance_tests() {
    print_status "Running performance tests..."
    
    # Start server in background for testing
    NODE_ENV=production npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Run Lighthouse CI if available
    if command -v lhci &> /dev/null; then
        cd frontend/react-app
        lhci autorun --upload.target=temporary-public-storage
        cd ../..
        print_success "Lighthouse CI tests completed"
    else
        print_warning "Lighthouse CI not found, skipping performance tests"
    fi
    
    # Stop test server
    kill $SERVER_PID
}

# Deploy to production
deploy_to_production() {
    print_status "Deploying to production..."
    
    # Copy built assets to server directory
    if [ -d "frontend/react-app/dist" ]; then
        cp -r frontend/react-app/dist/* public/
        print_success "Frontend assets copied"
    fi
    
    # Set production environment
    export NODE_ENV=production
    
    # Start server with PM2 if available
    if command -v pm2 &> /dev/null; then
        pm2 delete autocreator-api || true
        pm2 start server.js --name autocreator-api --instances max
        pm2 save
        print_success "Server started with PM2"
    else
        print_warning "PM2 not found, starting server directly"
        npm start
    fi
}

# Health check
health_check() {
    print_status "Running health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:${PORT:-3001}/health &> /dev/null; then
            print_success "Health check passed"
            return 0
        fi
        
        print_status "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Health check failed after $max_attempts attempts"
    return 1
}

# Cleanup function
cleanup() {
    print_status "Cleaning up temporary files..."
    
    # Remove build artifacts
    rm -rf frontend/react-app/dist/stats.html
    rm -rf node_modules/.cache
    
    print_success "Cleanup completed"
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_env_vars
    
    # Install and build
    install_dependencies
    build_frontend
    optimize_assets
    
    # Quality checks
    security_checks
    
    # Deploy
    deploy_to_production
    
    # Verify deployment
    health_check
    
    # Cleanup
    cleanup
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Application is running at http://localhost:${PORT:-3001}"
    
    # Display performance metrics
    echo ""
    echo "📊 Performance Metrics:"
    echo "- Bundle Size: $(du -sh frontend/react-app/dist 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "- Server Memory: $(ps -o pid,vsz,rss,pcpu,comm -p $(pgrep -f server.js) | tail -n +2 || echo 'N/A')"
    echo "- Health Status: $(curl -s http://localhost:${PORT:-3001}/health | jq -r '.status' 2>/dev/null || echo 'Unknown')"
}

# Handle script interruption
trap cleanup EXIT

# Run deployment if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi