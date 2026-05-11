"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function GalleryMosaic({ images }: { images: StaticImageData[] }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const thumbs = images.filter((_, i) => i !== heroIdx);

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-4/3">
      <motion.div
        layout
        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl bg-neutral-100"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[heroIdx]}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 66vw, 36vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {thumbs.slice(0, 2).map((img) => {
        const realIdx = images.indexOf(img);
        return (
          <button
            key={realIdx}
            onClick={() => setHeroIdx(realIdx)}
            className="relative overflow-hidden rounded-xl bg-neutral-100 ring-2 ring-transparent hover:ring-neutral-300 transition-all"
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 18vw"
            />
          </button>
        );
      })}
    </div>
  );
}

function MosaicSmallCell({ image }: { image: StaticImageData }) {
  return (
    <div className="relative overflow-hidden rounded-md bg-neutral-100 aspect-4/3">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, 18vw"
      />
    </div>
  );
}

export function GalleryMosaicLarge({ images }: { images: StaticImageData[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 my-auto">
      {/* Row 1–2: large left + 2 small right */}
      <div className="col-span-2 row-span-2 relative overflow-hidden rounded-sm bg-neutral-100">
        <Image
          src={images[0]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 66vw, 36vw"
          priority
        />
      </div>
      <MosaicSmallCell image={images[1]} />
      <MosaicSmallCell image={images[2]} />

      {/* Row 3: 3 small */}
      <MosaicSmallCell image={images[3]} />
      <MosaicSmallCell image={images[4]} />
      <MosaicSmallCell image={images[5]} />

      {/* Row 4–5: 2 small left + large right */}
      <MosaicSmallCell image={images[6]} />
      <div className="col-span-2 row-span-2 relative overflow-hidden rounded-sm bg-neutral-100">
        <Image
          src={images[7]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 66vw, 36vw"
        />
      </div>
      <MosaicSmallCell image={images[8]} />
    </div>
  );
}
