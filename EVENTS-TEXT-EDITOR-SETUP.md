# Events Management với Text Editor, PDF & Image Upload

## ✅ Đã Hoàn Thành

### 1. Database Schema (events-schema.sql)
- ✅ `text_content TEXT NOT NULL` - Lưu nội dung chi tiết event
- ✅ `pdf_files TEXT[]` - Mảng URLs của PDF documents  
- ✅ `image_files TEXT[]` - Mảng URLs của images
- ✅ Indexes, triggers, RLS policies đã được setup

### 2. EventModal Component
**File**: `/src/components/events/EventModal.tsx`

#### Features:
- ✅ **Text Editor Area**: Textarea với placeholder hướng dẫn người dùng
- ✅ **PDF Upload**: 
  - Multiple file upload
  - File type validation (chỉ PDF)
  - Preview uploaded files với size
  - Xóa files trước khi upload
  - Hiển thị existing PDFs với option xóa
- ✅ **Image Upload**:
  - Multiple image upload
  - File type validation (image/*)
  - Image preview với thumbnail
  - Xóa images trước khi upload
  - Hiển thị existing images với preview và option xóa
- ✅ **Upload Progress Indicator**
- ✅ **Snake_case fields** (target_audience, start_date, text_content, etc.)
- ✅ **Form Validation**
- ✅ **Supabase Integration**

#### Upload Flow:
1. User chọn PDF/images từ device
2. Files được preview local (chưa upload)
3. User click "Create Event" hoặc "Update Event"
4. Files upload lên Supabase Storage bucket "events"
5. URLs được lưu vào database
6. Event được save với all data

### 3. Events Page Update
**File**: `/src/app/(admin)/events/page.tsx`

- ✅ Import EventModal (đã uncomment)
- ✅ Enable modal state management
- ✅ `handleAddEvent()` - Mở modal tạo event mới
- ✅ `handleEditEvent()` - Mở modal edit event  
- ✅ `handleSaveEvent()` - Refresh list sau khi save
- ✅ Connect Edit button với modal

### 4. Supabase Storage Setup
**File**: `create-events-storage-bucket.md`

#### Cần làm manually:
1. Vào Supabase Dashboard
2. Storage → New bucket
3. Name: `events`
4. Public: ✅ Checked
5. Create bucket

**Hoặc chạy SQL**:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true);
```

## 🎯 Cách Sử Dụng

### Tạo Event Mới:
1. Vào `/events` page
2. Click "+ Create Event"
3. Điền thông tin:
   - Title, Description
   - Target Audience
   - Start Date, End Date
   - **Event Content** (text area lớn cho nội dung chi tiết)
4. **Upload PDFs** (optional):
   - Click "Choose Files"
   - Chọn 1 hoặc nhiều PDF files
   - Preview sẽ hiển thị tên file và size
5. **Upload Images** (optional):
   - Click "Choose Files"  
   - Chọn 1 hoặc nhiều images
   - Thumbnail preview hiển thị ngay
6. Select Status (Draft/Scheduled/Active)
7. Click "Create Event"
8. **Upload Progress** sẽ hiển thị:
   - "Uploading PDFs..."
   - "Uploading images..."
   - "Saving event..."
9. Event được tạo và redirect về list

### Edit Event:
1. Click Edit icon (✏️) trên event
2. Modal mở với data đã fill sẵn
3. **Existing Files** sẽ hiển thị:
   - PDFs: List với tên file + button xóa
   - Images: Grid thumbnails + button xóa hover
4. Có thể:
   - Edit text content
   - Xóa files cũ
   - Upload files mới
   - Edit các fields khác
5. Click "Update Event"

## 📁 File Structure

```
/events
  /pdfs
    /{timestamp}-{random}.pdf
    /{timestamp}-{random}.pdf
  /images
    /{timestamp}-{random}.jpg
    /{timestamp}-{random}.png
```

## 🔒 Security & Permissions

- ✅ **Authenticated users only** có thể create/edit events
- ✅ **Public read** cho storage bucket (anyone có URL có thể view)
- ✅ **Files auto-named** với timestamp + random string (tránh duplicate)
- ✅ **File type validation** client-side

## 🎨 UI/UX Features

### Text Content Area:
- Large textarea (8 rows)
- Placeholder with helpful hints:
  ```
  Enter detailed event content here...
  
  You can include:
  • Location details
  • Time information
  • Registration requirements
  • Contact information
  • Any other relevant details
  ```

### PDF Upload Section:
- Styled file input with brand colors
- Two sections:
  1. **Existing PDFs**: Gray background, file icon 📄
  2. **New PDFs**: Blue background, shows file size
- Remove button (✕) for each file

### Image Upload Section:
- Grid layout (3 columns)
- Two sections:
  1. **Existing Images**: Thumbnails với hover delete button
  2. **New Images**: Thumbnails với border xanh, filename overlay
- Hover effects: Delete button appears on hover

### Upload Progress:
- Blue background notification
- Spinning loader icon
- Clear status messages

## 🚀 Next Steps (Optional Enhancements)

1. **Rich Text Editor**:
   - Install compatible editor (khi React 19 support)
   - Bold, Italic, Lists, Links
   - Image embed inline

2. **Drag & Drop Upload**:
   - Thêm dropzone area
   - Drag multiple files

3. **File Size Limits**:
   - Client-side validation
   - Server-side limits in bucket settings

4. **Image Optimization**:
   - Auto-resize large images
   - WebP conversion
   - Compression

5. **PDF Preview**:
   - Inline PDF viewer
   - Thumbnail generation

## 📝 Notes

- **Storage Bucket**: Must be created manually trong Supabase Dashboard
- **Public URLs**: Files accessible via direct URL (good cho events)
- **File Naming**: Auto-generated để avoid conflicts
- **No Rich Text**: Hiện tại dùng plain textarea (React 19 incompatible với react-quill)
- **Multiple Files**: Unlimited (có thể set limit nếu cần)

## ✅ Testing Checklist

- [ ] Create event với text content only
- [ ] Create event với 1 PDF
- [ ] Create event với multiple PDFs
- [ ] Create event với 1 image
- [ ] Create event với multiple images
- [ ] Create event với both PDFs và images
- [ ] Edit event - keep existing files
- [ ] Edit event - remove existing PDF
- [ ] Edit event - remove existing image  
- [ ] Edit event - add new files
- [ ] Check files in Supabase Storage
- [ ] Check URLs accessible
- [ ] Verify database has correct file URLs
