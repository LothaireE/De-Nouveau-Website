type JsonLdProps = {
    data: Record<string, unknown>;
};

export function serializeJsonLd(data: JsonLdProps["data"]) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
    );
}
