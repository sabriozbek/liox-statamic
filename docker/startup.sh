#!/bin/bash
# Clear bootstrap cache to prevent loading disabled dev packages
rm -f /var/www/html/bootstrap/cache/*.php

# Start supervisord (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisord.conf
