# Supabase Storage Setup cho Events

## Tạo Storage Bucket trong Supabase Dashboard

1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Vào **Storage** (menu bên trái)
4. Click **New bucket**
5. Điền thông tin:
   - **Name**: `events`
   - **Public bucket**: ✅ Check (để files có thể access được)
   - **File size limit**: 50 MB (hoặc tùy ý)
   - **Allowed MIME types**: Leave empty (accept all) hoặc specify:
     - `application/pdf`
     - `image/jpeg`
     - `image/png`
     - `image/gif`
     - `image/webp`
6. Click **Create bucket**

## Hoặc chạy SQL sau trong SQL Editor:

```sql
-- Create storage bucket for events
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true);

-- Set bucket policies to allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to events bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Allow public read access to events bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'events');

CREATE POLICY "Allow authenticated users to delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'events');
```

## Folder Structure

Bucket sẽ tự động tạo folders khi upload:
- `/events/pdfs/` - PDF documents
- `/events/images/` - Event images

## Test Upload

Sau khi tạo bucket, test bằng cách:
1. Vào /events page
2. Click "Create Event"
3. Upload PDF hoặc image
4. Check trong Storage → events bucket

## Note

- Files sẽ có URLs dạng: `https://[project].supabase.co/storage/v1/object/public/events/pdfs/filename.pdf`
- Public bucket nghĩa là anyone có URL có thể download
- Nếu cần private, uncheck "Public bucket" và thêm signed URLs
