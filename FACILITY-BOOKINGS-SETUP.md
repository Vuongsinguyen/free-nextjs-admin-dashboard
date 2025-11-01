# Facility Bookings Database Setup

## 📋 Prerequisites
- Supabase project setup
- Facilities table already exists
- Users table already exists

## 🗄️ Step 1: Create Database Schema

Run the SQL script in your Supabase SQL Editor:

```bash
# Execute the schema file
cat facility-bookings-schema.sql
```

Or copy and paste the contents of `facility-bookings-schema.sql` into Supabase SQL Editor.

## ✅ Step 2: Verify Tables Created

After running the schema, verify in Supabase:
- Table `facility_bookings` exists
- Indexes are created
- RLS policies are enabled
- Sample data is inserted

## 🔄 Step 3: Update Frontend Code

The `src/app/(admin)/facilities/bookings/page.tsx` file has been updated to:
- ✅ Import Supabase client
- ✅ Fetch real data from database
- ✅ Implement CRUD operations (Create, Read, Update, Delete)
- ✅ Handle loading and error states
- ✅ Filter and search with database queries

## 📊 Features Implemented

### Database Operations
- **Fetch Bookings**: Load all bookings with facility details
- **Create Booking**: Add new bookings to database
- **Update Booking**: Edit existing booking information
- **Delete Booking**: Remove bookings from database
- **Search & Filter**: Real-time filtering by date, facility, status

### Data Relationships
- `facility_bookings.facility_id` → `facilities.id`
- `facility_bookings.user_id` → `users.id` (optional)

## 🔐 Row Level Security (RLS)

Policies created:
- ✅ Read access for all users
- ✅ Insert/Update/Delete for authenticated users only

## 📝 Sample Data

The schema includes 3 sample bookings for testing:
1. Swimming pool booking
2. Gym booking  
3. Tennis court booking

## 🚀 Usage

After setup, the bookings page will:
1. Automatically fetch data from Supabase on load
2. Display bookings in both table and calendar views
3. Allow creating/editing/deleting bookings
4. Sync all changes with database in real-time

## 🧪 Testing

Test the following:
1. ✅ View bookings list
2. ✅ Create new booking
3. ✅ Edit existing booking
4. ✅ Delete booking
5. ✅ Search by facility name
6. ✅ Filter by date
7. ✅ Calendar view with events

## 📌 Notes

- Booking codes are generated automatically with format: `BK2025XXXXXX`
- All timestamps are in UTC
- Prices are stored in VND (Vietnamese Dong)
- Duration is calculated in hours
