// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: "dqzp7wjn7",
  uploadPreset: "tvoitransfer_preset",
  apiKey: "717771172552872",
  folder: "tvoitransfer",
};

// Upload image to Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", CLOUDINARY_CONFIG.folder);
  formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url; // Returns HTTPS URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

// Delete image from Cloudinary (optional, requires API secret on backend)
// For now, we'll just remove from localStorage, images stay in Cloudinary

window.CloudinaryUploader = {
  upload: uploadToCloudinary,
  config: CLOUDINARY_CONFIG,
};
