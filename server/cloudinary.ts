import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: string | Buffer, folder: string = "singhlab", resourceType: "image" | "raw" | "auto" = "auto"): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType as any,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary stream upload success:", result!.secure_url);
          resolve(result!.secure_url);
        }
      }
    );

    if (typeof file === "string") {
      cloudinary.uploader.upload(file, options)
        .then(res => {
          console.log("Cloudinary file upload success:", res.secure_url);
          resolve(res.secure_url);
        })
        .catch(err => {
          console.error("Cloudinary file upload error:", err);
          reject(err);
        });
    } else {
      uploadStream.end(file);
    }
  });
}

export const uploadImage = (file: string | Buffer, folder: string = "singhlab") => 
  uploadFile(file, folder, "image");

export const uploadPdf = (file: string | Buffer, folder: string = "singhlab") => 
  uploadFile(file, folder, "auto");
