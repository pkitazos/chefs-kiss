"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

function MosaicSmallCell({
  image,
  onClick,
}: {
  image: StaticImageData;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-md bg-neutral-100 aspect-4/3 cursor-pointer"
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, 18vw"
      />
    </button>
  );
}

export function GalleryMosaicLarge({ images }: { images: StaticImageData[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const prev = () =>
    setLightboxIdx((i) =>
      i !== null ? (i - 1 + images.length) % images.length : null,
    );
  const next = () =>
    setLightboxIdx((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <>
      <div className="grid grid-cols-3 gap-2 my-auto">
        {/* Row 1–2: large left + 2 small right */}
        <button
          onClick={() => setLightboxIdx(0)}
          className="col-span-2 row-span-2 relative overflow-hidden rounded-sm bg-neutral-100 cursor-pointer"
        >
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 66vw, 36vw"
            priority
          />
        </button>
        <MosaicSmallCell image={images[1]} onClick={() => setLightboxIdx(1)} />
        <MosaicSmallCell image={images[2]} onClick={() => setLightboxIdx(2)} />

        {/* Row 3: 3 small */}
        <MosaicSmallCell image={images[3]} onClick={() => setLightboxIdx(3)} />
        <MosaicSmallCell image={images[4]} onClick={() => setLightboxIdx(4)} />
        <MosaicSmallCell image={images[5]} onClick={() => setLightboxIdx(5)} />

        {/* Row 4–5: 2 small left + large right */}
        <MosaicSmallCell image={images[6]} onClick={() => setLightboxIdx(6)} />
        <button
          onClick={() => setLightboxIdx(7)}
          className="col-span-2 row-span-2 relative overflow-hidden rounded-sm bg-neutral-100 cursor-pointer"
        >
          <Image
            src={images[7]}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 66vw, 36vw"
          />
        </button>
        <MosaicSmallCell image={images[8]} onClick={() => setLightboxIdx(8)} />
      </div>

      <Dialog
        open={lightboxIdx !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxIdx(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="bg-transparent p-0 ring-0 max-w-[90vw] sm:max-w-[90vw] rounded-none gap-0"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            else if (e.key === "ArrowRight") next();
          }}
        >
          <DialogTitle className="sr-only">Photo gallery</DialogTitle>

          {lightboxIdx !== null && (
            <div className="relative w-full h-[85vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[lightboxIdx]}
                    alt=""
                    fill
                    className="object-contain select-none rounded-sm"
                    sizes="90vw"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous photo"
              >
                <IconChevronLeft className="size-5" />
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                aria-label="Next photo"
              >
                <IconChevronRight className="size-5" />
              </button>

              <button
                onClick={() => setLightboxIdx(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <IconX className="size-4" />
              </button>

              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
                {lightboxIdx + 1} / {images.length}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
