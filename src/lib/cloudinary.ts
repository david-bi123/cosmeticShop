import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

export async function uploadImage(file: File, folder = 'cosmetic-shop'): Promise<{ url: string; publicId: string }> {
  const cloud = cloudinaryConfig();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    cloud.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, result) => {
        if (err || !result) reject(err ?? new Error('upload failed'));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  const cloud = cloudinaryConfig();
  await cloud.uploader.destroy(publicId);
}
