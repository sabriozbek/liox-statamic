#!/bin/bash
# Clear bootstrap cache to prevent loading disabled dev packages
rm -f /var/www/html/bootstrap/cache/*.php

# Ensure Statamic can write content, resources and form/user metadata at runtime
mkdir -p /var/www/html/content /var/www/html/resources/users /var/www/html/storage/forms /var/www/html/storage/statamic
chown -R www-data:www-data /var/www/html/content /var/www/html/resources /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R ug+rwX /var/www/html/content /var/www/html/resources /var/www/html/storage /var/www/html/bootstrap/cache

# Make content repository writable and optionally configure authenticated Git remote for Statamic automation
if [ -d /var/www/html/.git ]; then
  chown -R www-data:www-data /var/www/html/.git
  chmod -R ug+rwX /var/www/html/.git
fi

if [ -n "${GITHUB_PAT:-}" ]; then
  su -s /bin/sh www-data -c "git -C /var/www/html remote set-url origin https://x-access-token:${GITHUB_PAT}@github.com/sabriozbek/liox-statamic.git" || true
fi

su -s /bin/sh www-data -c "git -C /var/www/html config user.name '${STATAMIC_GIT_USER_NAME:-Liox Statamic Bot}'" || true
su -s /bin/sh www-data -c "git -C /var/www/html config user.email '${STATAMIC_GIT_USER_EMAIL:-bot@liox.uyumsoft.com}'" || true

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisord.conf
