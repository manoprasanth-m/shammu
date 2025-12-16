import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  mainImage: string;
  images?: Array<{ src: string }>;
  productName: string;
}

export default function ImageGallery({ mainImage, images = [], productName }: ImageGalleryProps) {
  const allImages = [mainImage, ...images.map(img => img.src)].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={allImages[selectedImage] || '/uploads/placeholder.svg'}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-accent' : 'ring-1 ring-gray-200'
              }`}
            >
              <Image
                src={image || '/uploads/placeholder.svg'}
                alt={`${productName} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
