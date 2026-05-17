#!/bin/bash
set -e

APP_DIR="/var/www/html"
DEFAULT_REPO="https://github.com/sabriozbek/liox-statamic.git"
REPO_URL="${GITHUB_REPOSITORY_URL:-$DEFAULT_REPO}"
SYNC_BRANCH="${GITHUB_SYNC_BRANCH:-main}"
CONTENT_PATHS="content resources/users resources/forms"
RUNTIME_GIT_EXCLUDES="/tmp/liox-runtime-git-excludes"

if [ -n "${GITHUB_PAT:-}" ]; then
  AUTH_REPO_URL="${REPO_URL/https:\/\/github.com\//https:\/\/x-access-token:${GITHUB_PAT}@github.com\/}"
else
  AUTH_REPO_URL="$REPO_URL"
fi

echo "[startup] clearing Laravel bootstrap cache"
rm -f "$APP_DIR"/bootstrap/cache/*.php

echo "[startup] preparing writable Statamic directories"
mkdir -p "$APP_DIR/content" "$APP_DIR/resources/users" "$APP_DIR/storage/forms" "$APP_DIR/storage/statamic"
chown -R www-data:www-data "$APP_DIR/content" "$APP_DIR/resources" "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
chmod -R ug+rwX "$APP_DIR/content" "$APP_DIR/resources" "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

if [ -d "$APP_DIR/.git" ]; then
  echo "[startup] preparing git repository"
  chown -R www-data:www-data "$APP_DIR/.git"
  chmod -R ug+rwX "$APP_DIR/.git"

  su -s /bin/sh www-data -c "git config --global --add safe.directory $APP_DIR" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR remote set-url origin '$AUTH_REPO_URL'" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR config user.name '${STATAMIC_GIT_USER_NAME:-Liox Statamic Bot}'" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR config user.email '${STATAMIC_GIT_USER_EMAIL:-bot@liox.uyumsoft.com}'" || true
  cat > "$RUNTIME_GIT_EXCLUDES" <<'EOF'
storage/*.key
storage/logs/**
storage/framework/**
storage/forms/**
storage/redirect/**
storage/statamic/**
storage/app/**
public/vendor/**
public/cp/**
public/build/**
EOF
  chown www-data:www-data "$RUNTIME_GIT_EXCLUDES"
  su -s /bin/sh www-data -c "git -C $APP_DIR config core.excludesFile '$RUNTIME_GIT_EXCLUDES'" || true

  echo "[startup] syncing tracked content from GitHub branch $SYNC_BRANCH"
  su -s /bin/sh www-data -c "git -C $APP_DIR fetch origin $SYNC_BRANCH --prune" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR checkout $SYNC_BRANCH || git -C $APP_DIR checkout -b $SYNC_BRANCH origin/$SYNC_BRANCH" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR branch --set-upstream-to=origin/$SYNC_BRANCH $SYNC_BRANCH" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR reset --hard HEAD" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR checkout origin/$SYNC_BRANCH -- $CONTENT_PATHS" || true
  su -s /bin/sh www-data -c "git -C $APP_DIR clean -fd -- $CONTENT_PATHS" || true
fi

echo "[startup] starting supervisord"
exec /usr/bin/supervisord -c /etc/supervisord.conf
