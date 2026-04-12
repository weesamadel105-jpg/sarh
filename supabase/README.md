# Supabase Database Schema for Sarh

This directory contains the complete database schema for the Sarh educational platform.

## Tables Overview

### Core Tables
- **profiles** - Extended user profiles (extends auth.users)
- **teachers** - Teacher-specific information and profiles
- **orders** - Academic orders/assignments between students and teachers
- **messages** - Chat messages and conversations
- **subscriptions** - User subscription management
- **payments** - Payment processing and transaction history

### Supporting Tables
- **teacher_subjects** - Teacher subject specializations
- **conversations** - Conversation metadata
- **order_history** - Order status change tracking
- **subscription_history** - Subscription change tracking
- **payment_logs** - Payment audit trail
- **refunds** - Refund management

## Setup Instructions

### Option 1: Run Individual Migrations
Execute the SQL files in order in your Supabase SQL editor:

1. `001_users_profiles.sql`
2. `002_teachers.sql`
3. `003_orders.sql`
4. `004_messages.sql`
5. `005_subscriptions.sql`
6. `006_payments.sql`

### Option 2: Run Combined Migration
Use the `init.sql` file which combines all migrations in the correct order.

## Key Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies to ensure data security.

### Automatic Timestamps
All tables include `created_at` and `updated_at` fields with automatic triggers.

### Audit Trails
- Order status changes are tracked in `order_history`
- Subscription changes are tracked in `subscription_history`
- Payment changes are logged in `payment_logs`

### Relationships
- Users can be students, teachers, or admins
- Orders connect students with teachers
- Messages are grouped by conversations
- Payments can be for orders or subscriptions

## Default Data

The subscriptions migration includes default subscription plans:
- Free plan (5 orders/month)
- Pro Monthly (49.99 SAR/month)
- Pro Yearly (39.99 SAR/month, billed annually)

## Environment Variables Required

Make sure your Next.js app has these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Notes

- All monetary values are in SAR (Saudi Riyal)
- Timestamps are stored in UTC
- File URLs should be stored in a cloud storage service (AWS S3, Supabase Storage, etc.)
- The schema supports Arabic text fields throughout