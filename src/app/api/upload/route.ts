import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExt = path.extname(file.name);
    const filename = `img-${uniqueSuffix}${originalExt}`;
    const filePath = path.join(uploadsDir, filename);

    // Save the file
    fs.writeFileSync(filePath, buffer);

    // Return the public URL path
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
