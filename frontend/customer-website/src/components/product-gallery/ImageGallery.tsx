'use client';

import { useState, type ReactNode } from 'react';
import type { Tone } from '@/types/common';
import Media, { type MediaKind } from '@/components/common/Media';
import './ImageGallery.css';

export interface GalleryItem {
  id: string;
  label: string; // accessible name, e.g. "View front"
  src?: string;
  kind?: MediaKind;
  placeholderLabel?: string; // picks the placeholder drawing when there is no src
}

interface ImageGalleryProps {
  items: GalleryItem[];
  tone: Tone;
  alt: string;
  /** Extra content over the main image (e.g. a badge). */
  overlay?: ReactNode;
}

/** Thumbnail strip + large image. Generic: knows nothing about products. */
export default function ImageGallery({ items, tone, alt, overlay }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="pdp__gallery">
      <div className="pdp__thumbs">
        {items.map((item, i) => (
          <button key={item.id} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)} aria-label={item.label}>
            <Media src={item.src} alt="" tone={tone} kind={item.kind} label={item.placeholderLabel} />
          </button>
        ))}
      </div>
      <div className="pdp__main">
        {current && <Media src={current.src} alt={alt} tone={tone} kind={current.kind} label={current.placeholderLabel} ratio="1 / 1" eager />}
        {overlay}
      </div>
    </div>
  );
}
