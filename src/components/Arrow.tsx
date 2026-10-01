/** Degrees, clockwise: 0 points right, 90 down, 180 left, 270 up. */
export type ArrowRotation = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

type ArrowProps = {
    rotation?: ArrowRotation;
    className?: string;
};

/** Decorative arrow icon; the surrounding link or button carries the label. */
export default function Arrow({
    rotation = 0,
    className = "h-5 w-5",
}: ArrowProps) {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            // `rotate` is independent of `translate`, so hover nudges still compose.
            style={rotation ? { rotate: `${rotation}deg` } : undefined}
            className={className}
        >
            <path d="M3 12h17M14 6l6 6-6 6" />
        </svg>
    );
}
