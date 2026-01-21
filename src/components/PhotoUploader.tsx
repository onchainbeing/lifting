import { useRef } from 'react';
import './PhotoUploader.css';

interface Props {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export default function PhotoUploader({ photos, onPhotosChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        newPhotos.push(base64);
      }
    }

    onPhotosChange([...photos, ...newPhotos]);

    // 清空 input 以便可以重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="photo-uploader">
      <h3>训练照片</h3>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`训练照片 ${index + 1}`} />
            <button
              className="btn-remove-photo"
              onClick={() => handleRemovePhoto(index)}
              title="删除照片"
            >
              ×
            </button>
          </div>
        ))}

        <label className="photo-add-btn">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            hidden
          />
          <span className="add-icon">+</span>
          <span>添加照片</span>
        </label>
      </div>
    </div>
  );
}
