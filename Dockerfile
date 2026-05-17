# LioXERP Docker Configuration
# Multi-stage build for optimized production image

# ============== PHP Builder Stage ==============
FROM php:8.3-fpm-alpine AS builder

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    libxml2-dev \
    icu-dev \
    openldap-dev \
    imagemagick-dev \
    autoconf \
    gcc \
    g++ \
    make

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    pcntl \
    bcmath \
    gd \
    intl \
    opcache \
    xml

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY composer.json composer.lock* ./

# Install dependencies (no-dev because we're in production, skip scripts to avoid Breeze provider error)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --optimize-autoloader \
    --ignore-platform-reqs

# Copy application source
COPY . .

# Clear bootstrap cache BEFORE autoload dump
RUN rm -rf bootstrap/cache/*.php

# Remove require-dev only packages that cause issues in production
RUN rm -rf vendor/nunomaduro/collision vendor/nunomaduro/termwind && \
    rm -rf vendor/laravel/breeze vendor/pestphp/pest-plugin-laravel && \
    rm -f vendor/composer/autoload_classmap.php vendor/composer/autoload_static.php && \
    composer dump-autoload --optimize --no-dev --no-scripts --ignore-platform-reqs

# Publish package assets for CP/vendor resources
RUN cp .env.example .env && \
    php artisan vendor:publish --tag=laravel-assets --force || true

# ============== Production Stage ==============
FROM php:8.3-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng \
    libzip \
    oniguruma \
    icu \
    openldap \
    imagemagick \
    supervisor \
    nginx \
    openssl \
    bash

# Copy PHP extensions from builder
COPY --from=builder /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=builder /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d

# Create directories
RUN mkdir -p /var/www/html /var/log/supervisor /var/run

# Copy application from builder
COPY --from=builder /var/www/html /var/www/html

# Copy startup script
COPY docker/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Configure PHP
RUN echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "upload_max_filesize=20M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "max_execution_time=120" >> /usr/local/etc/php/conf.d/custom.ini

# Nginx configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 8080

# Start supervisor (nginx + php-fpm) with cache clearing
CMD ["/usr/local/bin/startup.sh"]
