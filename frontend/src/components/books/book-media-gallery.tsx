"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type BookMediaGalleryProps = {
  title: string;
  coverImage: string;
  gallery: string[];
};

export function BookMediaGallery({ title, coverImage, gallery }: BookMediaGalleryProps) {
  const images = useMemo(() => {
    const items = [coverImage, ...gallery].filter(Boolean);
    return [...new Set(items)];
  }, [coverImage, gallery]);

  const [selectedImage, setSelectedImage] = useState(images[0] ?? coverImage);

  return (
    <div className="card-surface soft-panel mx-auto w-full max-w-[28rem] overflow-hidden p-4 lg:sticky lg:top-32">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)-0.25rem)] bg-[var(--secondary)]">
        <Image
          src={selectedImage}
          alt={title}
          fill
          className="object-cover transition duration-500"
          sizes="(max-width: 1024px) min(92vw, 28rem), 28rem"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => {
            const isActive = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1} for ${title}`}
                aria-pressed={isActive}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-[0.85rem] border bg-white/70 ${
                  isActive ? "border-[var(--accent)] shadow-[0_0_0_3px_rgba(212,175,55,0.18)]" : "hover:border-[var(--primary)]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="7rem"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
