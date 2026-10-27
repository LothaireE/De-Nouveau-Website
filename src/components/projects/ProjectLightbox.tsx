"use client";

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * Lightbox for the project gallery: a white room, the photo whole, text-only
 * controls. The clicked thumbnail grows into place (FLIP + clip-path) and the
 * photo goes back onto it on close; photos cross-fade in between.
 *
 * The layouts stay server components: every image they render is a
 * `[data-lightbox-src]` button (ProjectMedia), read here in document order.
 */

type Slide = {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
};

const EASE = "cubic-bezier(0.2, 0.75, 0.1, 1)";
const SWIPE_THRESHOLD = 50;

const pad = (value: number) => String(value).padStart(2, "0");
const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function readSlide(button: HTMLElement): Slide {
    const data = button.dataset;
    return {
        src: data.lightboxSrc ?? "",
        width: Number(data.lightboxWidth) || 1600,
        height: Number(data.lightboxHeight) || 1067,
        alt: data.lightboxAlt ?? "",
        caption: data.lightboxCaption ?? "",
    };
}

// jsdom and old browsers have no Web Animations: skip straight to the end.
function play(
    element: Element | null,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
) {
    if (!element || typeof element.animate !== "function") {
        return Promise.resolve();
    }
    return element.animate(keyframes, options).finished.then(() => undefined);
}

function cancelAnimations(...elements: (Element | null)[]) {
    elements.forEach((element) =>
        element?.getAnimations?.().forEach((animation) => animation.cancel()),
    );
}

async function decoded(image: HTMLImageElement | null) {
    await image?.decode?.().catch(() => undefined);
}

/** Transform and clip that lay the whole photo exactly over its cropped thumbnail. */
function onThumbnail(thumbnail: Element, image: Element): Keyframe | null {
    const from = thumbnail.getBoundingClientRect();
    const to = image.getBoundingClientRect();

    if (!to.width || from.bottom < 0 || from.top > innerHeight) return null;

    const scale = Math.max(from.width / to.width, from.height / to.height);
    const clipX = (to.width - from.width / scale) / 2;
    const clipY = (to.height - from.height / scale) / 2;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);

    return {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        clipPath: `inset(${clipY}px ${clipX}px)`,
    };
}

const AT_REST: Keyframe = { transform: "none", clipPath: "inset(0px 0px)" };

export default function ProjectLightbox({ children }: { children: ReactNode }) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const triggers = useRef<HTMLElement[]>([]);
    const current = useRef(0);
    const busy = useRef(false);
    const swipeStart = useRef<number | null>(null);
    const swiped = useRef(false);

    const [slides, setSlides] = useState<Slide[]>([]);
    const [index, setIndex] = useState(0);
    const [ready, setReady] = useState(false);

    const slide = slides[index];
    const several = slides.length > 1;

    function show(next: number) {
        current.current = next;
        flushSync(() => setIndex(next));
        // The thumbnail under the open photo stays hidden, so the photo can
        // land back on an empty frame.
        triggers.current.forEach((button, i) =>
            button.toggleAttribute("data-active", i === next),
        );
    }

    async function open(trigger: HTMLElement) {
        const dialog = dialogRef.current;
        const gallery = galleryRef.current;
        if (busy.current || !dialog || !gallery) return;
        busy.current = true;

        triggers.current = [
            ...gallery.querySelectorAll<HTMLElement>("[data-lightbox-src]"),
        ];
        flushSync(() => setSlides(triggers.current.map(readSlide)));
        show(triggers.current.indexOf(trigger));
        await decoded(imageRef.current);

        document.documentElement.style.overflow = "hidden";
        dialog.showModal();
        dialog.focus();

        const from =
            !calm() &&
            imageRef.current &&
            onThumbnail(trigger, imageRef.current);
        await Promise.all([
            play(backdropRef.current, [{ opacity: 0 }, { opacity: 1 }], {
                duration: 450,
                easing: "ease",
                fill: "forwards",
            }),
            from
                ? play(imageRef.current, [from, AT_REST], {
                      duration: 650,
                      easing: EASE,
                  })
                : play(imageRef.current, [{ opacity: 0 }, { opacity: 1 }], {
                      duration: 350,
                      easing: "ease",
                  }),
        ]);

        setReady(true);
        busy.current = false;
    }

    async function close() {
        const dialog = dialogRef.current;
        if (busy.current || !dialog?.open) return;
        busy.current = true;
        setReady(false);

        const trigger = triggers.current[current.current];
        const to =
            !calm() &&
            trigger &&
            imageRef.current &&
            onThumbnail(trigger, imageRef.current);
        await Promise.all([
            play(backdropRef.current, [{ opacity: 1 }, { opacity: 0 }], {
                duration: 450,
                easing: "ease",
                fill: "forwards",
            }),
            to
                ? play(imageRef.current, [AT_REST, to], {
                      duration: 520,
                      easing: EASE,
                      fill: "forwards",
                  })
                : play(imageRef.current, [{ opacity: 1 }, { opacity: 0 }], {
                      duration: 280,
                      easing: "ease",
                      fill: "forwards",
                  }),
        ]);

        triggers.current.forEach((button) =>
            button.removeAttribute("data-active"),
        );
        dialog.close();
        cancelAnimations(backdropRef.current, imageRef.current);
        document.documentElement.style.overflow = "";
        trigger?.focus({ preventScroll: true });
        busy.current = false;
    }

    async function step(direction: 1 | -1) {
        const count = triggers.current.length;
        if (busy.current || count < 2) return;
        busy.current = true;

        const shift = calm() ? 0 : 24 * direction;
        await play(
            imageRef.current,
            [
                { opacity: 1, transform: "none" },
                { opacity: 0, transform: `translateX(${-shift}px)` },
            ],
            { duration: 200, easing: "ease-in", fill: "forwards" },
        );
        show((current.current + direction + count) % count);
        await decoded(imageRef.current);
        cancelAnimations(imageRef.current);
        await play(
            imageRef.current,
            [
                { opacity: 0, transform: `translateX(${shift}px)` },
                { opacity: 1, transform: "none" },
            ],
            { duration: 420, easing: EASE },
        );
        busy.current = false;
    }

    // On the photo, the left half goes back and the right half forward.
    const isLeftHalf = (event: React.MouseEvent<HTMLElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        return event.clientX < box.left + box.width / 2;
    };

    const controls = `transition-opacity duration-350 ${ready ? "opacity-100 delay-100" : "opacity-0"}`;
    const link = "fill-text cursor-pointer";

    return (
        <>
            <div
                ref={galleryRef}
                onClick={(event) => {
                    const trigger = (
                        event.target as Element
                    ).closest<HTMLElement>("[data-lightbox-src]");
                    if (trigger) void open(trigger);
                }}
            >
                {children}
            </div>

            <dialog
                ref={dialogRef}
                tabIndex={-1}
                aria-label="Images du projet"
                className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-studio-black outline-none backdrop:bg-transparent"
                onCancel={(event) => {
                    event.preventDefault();
                    void close();
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowRight") void step(1);
                    if (event.key === "ArrowLeft") void step(-1);
                }}
                onPointerDown={(event) => {
                    if (event.pointerType !== "mouse") {
                        swipeStart.current = event.clientX;
                    }
                }}
                onPointerUp={(event) => {
                    if (swipeStart.current === null) return;
                    const distance = event.clientX - swipeStart.current;
                    swipeStart.current = null;
                    if (Math.abs(distance) > SWIPE_THRESHOLD) {
                        swiped.current = true;
                        void step(distance < 0 ? 1 : -1);
                    }
                }}
                onClickCapture={(event) => {
                    // A swipe ends with a click: it must not close or step again.
                    if (swiped.current) {
                        swiped.current = false;
                        event.stopPropagation();
                    }
                }}
            >
                <div
                    ref={backdropRef}
                    aria-hidden="true"
                    className="absolute inset-0 bg-studio-white opacity-0"
                />

                <div
                    className="absolute inset-x-0 top-14 bottom-16 flex touch-pan-y items-center justify-center md:inset-x-6 md:top-16 md:bottom-18 lg:inset-x-10"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) void close();
                    }}
                >
                    {slide && (
                        <Image
                            ref={imageRef}
                            src={slide.src}
                            alt={slide.alt}
                            width={slide.width}
                            height={slide.height}
                            sizes="100vw"
                            quality={90}
                            loading="eager"
                            draggable={false}
                            className={`h-auto max-h-[calc(100svh-7.5rem)] w-auto max-w-full select-none will-change-transform md:max-h-[calc(100svh-8.5rem)] ${several ? "" : "cursor-pointer"}`}
                            onClick={(event) => {
                                if (several)
                                    void step(isLeftHalf(event) ? -1 : 1);
                                else void close();
                            }}
                            onMouseMove={(event) => {
                                if (!several) return;
                                event.currentTarget.style.cursor = isLeftHalf(
                                    event,
                                )
                                    ? "w-resize"
                                    : "e-resize";
                            }}
                        />
                    )}
                </div>

                <button
                    type="button"
                    className={`absolute top-5 right-4 text-small sm:right-6 lg:right-10 ${link} ${controls}`}
                    onClick={() => void close()}
                >
                    Fermer
                </button>

                <div
                    className={`absolute inset-x-4 bottom-5 flex items-baseline justify-between gap-6 text-small sm:inset-x-6 md:grid md:grid-cols-[8ch_minmax(0,1fr)_auto] lg:inset-x-10 ${controls}`}
                >
                    <span
                        aria-live="polite"
                        className="text-studio-black/60 tabular-nums"
                    >
                        {pad(index + 1)} / {pad(slides.length)}
                    </span>
                    <span className="hidden truncate font-light text-studio-black/60 md:block">
                        {slide?.caption}
                    </span>
                    {several && (
                        <span className="flex gap-5">
                            <button
                                type="button"
                                className={link}
                                onClick={() => void step(-1)}
                            >
                                Précédent
                            </button>
                            <button
                                type="button"
                                className={link}
                                onClick={() => void step(1)}
                            >
                                Suivant
                            </button>
                        </span>
                    )}
                </div>
            </dialog>
        </>
    );
}
