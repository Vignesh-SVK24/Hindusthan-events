import { NextResponse } from 'next/server';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

// Maximum allowed image size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    // Security check: Only authenticated Administrators or Developers can upload event media
    if (!user || (user.role !== 'admin' && user.role !== 'developer' && !isDeveloperUser(user))) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Developer privileges required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || (formData.get('field') === 'cover_image_url' ? 'background' : 'poster');
    const slug = (formData.get('slug') as string) || 'event';
    const eventId = (formData.get('eventId') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, JPEG, PNG, and WebP images are supported.' },
        { status: 400 }
      );
    }

    // 2. Validate file size (<= 5MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `File size (${sizeMb} MB) exceeds the maximum allowed 5 MB limit. Please compress or select a smaller image.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Determine clean extension and storage path
    const originalExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const ext = ['jpeg', 'jpg', 'png', 'webp'].includes(originalExt) ? originalExt : 'jpg';
    const sanitizedSlug = slug.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);

    const folder = uploadType === 'background' || uploadType === 'cover' ? 'backgrounds' : 'posters';
    const storagePath = eventId
      ? `events/${eventId}/${folder === 'backgrounds' ? 'background' : 'poster'}/${timestamp}_${randomSuffix}.${ext}`
      : `${folder}/${sanitizedSlug}-${timestamp}-${randomSuffix}.${ext}`;

    // 4. Upload to Supabase Storage (event-media bucket)
    const supabase = getSupabaseServerClient(true);
    if (supabase) {
      try {
        // Upload binary buffer to Supabase Storage
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('event-media')
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: pubData } = supabase.storage
            .from('event-media')
            .getPublicUrl(storagePath);

          return NextResponse.json({
            success: true,
            url: pubData.publicUrl,
            storagePath,
            bucket: 'event-media',
            size: file.size,
            mimeType: file.type,
          });
        }

        console.warn('Supabase storage upload error, using local fallback:', uploadErr?.message);
      } catch (err: any) {
        console.warn('Supabase storage exception, using local fallback:', err?.message);
      }
    }

    // 5. Local Storage Fallback (if Supabase Storage is temporarily unreachable)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${sanitizedSlug}-${timestamp}-${randomSuffix}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${filename}`,
      storagePath: `uploads/${folder}/${filename}`,
      bucket: 'local',
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('File upload fatal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'developer' && !isDeveloperUser(user))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const storagePath = searchParams.get('path');
    const imageUrl = searchParams.get('url');

    if (!storagePath && !imageUrl) {
      return NextResponse.json({ error: 'storagePath or url is required' }, { status: 400 });
    }

    let targetPath = storagePath;
    if (!targetPath && imageUrl) {
      const match = imageUrl.match(/event-media\/(.+)$/);
      if (match) targetPath = match[1];
    }

    if (targetPath) {
      const supabase = getSupabaseServerClient(true);
      if (supabase) {
        await supabase.storage.from('event-media').remove([targetPath]);
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted from storage' });
  } catch (error: any) {
    console.error('File delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
