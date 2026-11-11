"use client";

import { useState } from "react";

// Mostra só a miniatura e carrega o player ao clicar — mantém o site rápido.
export function YouTubeLite({ id, title, vertical = false }: { id: string; title: string; vertical?: boolean }) {
  const [play, setPlay] = useState(false);
  const aspect = vertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-zinc-900 ${aspect}`}>
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Assistir: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl text-zinc-950 shadow-xl transition group-hover:scale-110">
              ▶
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left text-sm font-semibold text-white">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
