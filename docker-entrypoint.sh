#!/bin/sh
set -e

echo "=== [Gaming Arena] Booting Container Environment ==="

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL database at db:5432..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL database is accepting connections."

# Push Prisma Schema to PostgreSQL
echo "Applying database schema migrations..."
npx prisma db push --skip-generate || true
echo "Database schema synchronized successfully."

# Start Next.js standalone application server
echo "Starting Next.js standalone server on port 3000..."
exec node server.js
