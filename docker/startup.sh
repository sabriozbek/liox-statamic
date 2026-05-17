#!/bin/bash
# Clear bootstrap cache to prevent loading disabled dev packages
rm -f /var/www/html/bootstrap/cache/*.php

# Ensure Statamic can write content, resources and form/user metadata at runtime
mkdir -p /var/www/html/content /var/www/html/resources/users /var/www/html/storage/forms /var/www/html/storage/statamic
chown -R www-data:www-data /var/www/html/content /var/www/html/resources /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R ug+rwX /var/www/html/content /var/www/html/resources /var/www/html/storage /var/www/html/bootstrap/cache

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisord.conf
