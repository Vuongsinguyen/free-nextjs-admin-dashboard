# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### 2. Configure Environment Variables
Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Setup Database Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy and run the contents of `supabase-schema.sql`

### 4. Test Connection
Visit `http://localhost:3000/supabase-test` to verify setup

### 5. Migrate Data
Run the migration API:
```bash
curl -X POST http://localhost:3000/api/migrate-data
```

## 📋 What's Included

### Database Tables
- **users**: User profiles (extends Supabase auth)
- **facilities**: Facility management
- **bookings**: Facility bookings
- **events**: Event management

### Features
- ✅ Row Level Security (RLS)
- ✅ Real-time subscriptions
- ✅ Authentication integration
- ✅ Multi-tenancy ready
- ✅ TypeScript support

### Security Policies
- Users can only access their own data
- Admins have full access
- Facilities are publicly readable (active only)
- Bookings are user-specific

## 🔧 Development

### Testing Authentication
```typescript
import { useAuth } from '@/context/AuthContext'

const { login, logout, user, isAuthenticated } = useAuth()
```

### Database Queries
```typescript
import { supabase } from '@/lib/supabase'

// Fetch users
const { data: users } = await supabase.from('users').select('*')

// Create booking
const { data: booking } = await supabase
  .from('bookings')
  .insert({ facility_id, user_id, start_time, end_time })
```

## 🚀 Production Deployment

### Environment Variables
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database Backups
Supabase automatically handles backups. For custom backups:
```sql
-- Export data
pg_dump your_database_url > backup.sql
```

## 🆘 Troubleshooting

### Common Issues

**Connection Error**
- Check `.env.local` values
- Verify Supabase project is active
- Check network connectivity

**Auth Not Working**
- Ensure middleware.ts is configured
- Check RLS policies
- Verify user exists in both auth.users and public.users

**Data Not Showing**
- Run migration API: `POST /api/migrate-data`
- Check SQL schema was executed
- Verify RLS policies allow access

### Support
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Auth Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Discord Community](https://supabase.com/discord)