import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({
  value,
  onChange,
  label = 'Upload Image',
  multiple = false,
  maxSize = 5 // MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSize}MB limit`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
    }

    try {
      setUploading(true);
      setProgress(0);

      if (multiple) {
        // Upload multiple images
        const uploadedImages = [];
        for (let i = 0; i < files.length; i++) {
          const response = await uploadAPI.uploadImage(files[i]);
          if (response.data) {
            const imageUrl = response.data?.file?.url || response.data?.url;
            const imageKey = response.data?.file?.key || response.data?.key || response.data?.public_id;

            if (imageUrl) {
              uploadedImages.push({
                url: imageUrl,
                public_id: imageKey
              });
            }
          }
          setProgress(((i + 1) / files.length) * 100);
        }

        const currentImages = Array.isArray(value) ? value : [];
        const newImages = [...currentImages, ...uploadedImages];
        console.log('Calling onChange with images:', newImages);
        onChange(newImages);
        toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
      } else {
        // Upload single image
        const response = await uploadAPI.uploadImage(files[0]);
        if (response.data) {
          const imageUrl = response.data?.file?.url || response.data?.url;
          const imageKey = response.data?.file?.key || response.data?.key || response.data?.public_id;

          if (imageUrl) {
            onChange({
              url: imageUrl,
              public_id: imageKey
            });
            toast.success('Image uploaded successfully');
          }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexOrNull = null) => {
    if (multiple && indexOrNull !== null) {
      const newImages = [...value];
      newImages.splice(indexOrNull, 1);
      onChange(newImages);
    } else {
      onChange(multiple ? [] : null);
    }
  };

  const renderSingleImage = () => {
    if (!value || !value.url) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div onClick={() => fileInputRef.current?.click()}>
            <FiImage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">{label}</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to {maxSize}MB</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative border rounded-lg overflow-hidden group">
        <img
          src={value.url}
          alt="Uploaded"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleRemove()}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderMultipleImages = () => {
    const images = Array.isArray(value) ? value : [];
    console.log('Rendering gallery, value:', value, 'images:', images);

    return (
      <div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative border rounded-lg overflow-hidden group">
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div onClick={() => fileInputRef.current?.click()}>
            <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {images.length > 0 ? 'Add more images' : 'Upload gallery images'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to {maxSize}MB</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="image-upload">
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">Uploading... {Math.round(progress)}%</p>
        </div>
      )}

      {multiple ? renderMultipleImages() : renderSingleImage()}
    </div>
  );
};

export default ImageUpload;
