"use client";

import {
    Button,
    TextField,
    useDocumentInfo,
    useField,
    useFormFields,
} from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { useState } from "react";

type SuggestField = "alt" | "caption";
type Status = "idle" | "loading" | "ai" | "fallback" | "error";

type SuggestionResponse = {
    text: string;
    source: "ai" | "fallback";
    reason?: string;
};

const NOUN: Record<SuggestField, string> = {
    alt: "le texte alternatif",
    caption: "la légende",
};

/** Short French notice shown under the field after a fallback. */
export function fallbackMessage(field: SuggestField, text: string): string {
    if (!text)
        return field === "caption"
            ? "Suggestion IA indisponible et aucun projet associé : aucune proposition."
            : "Suggestion IA indisponible : ajoutez une légende ou un projet pour obtenir une proposition.";
    return field === "caption"
        ? "Suggestion IA indisponible, proposition basée sur le titre du projet."
        : "Suggestion IA indisponible, proposition basée sur la légende et le projet.";
}

const relationId = (value: unknown): string | number | undefined => {
    if (typeof value === "string" || typeof value === "number") return value;
    if (value && typeof value === "object" && "value" in value)
        return relationId((value as { value: unknown }).value);
    if (value && typeof value === "object" && "id" in value)
        return relationId((value as { id: unknown }).id);
    return undefined;
};

const asText = (value: unknown) => (typeof value === "string" ? value : "");

/**
 * Payload's native text field plus a « Suggestion » button that asks the server
 * for an AI proposal. The editor keeps, edits or ignores it; nothing is saved
 * until the document is saved.
 */
export function MediaTextSuggestField(props: TextFieldClientProps) {
    const field: SuggestField =
        props.field?.name === "caption" ? "caption" : "alt";
    const path = props.path ?? field;

    const { id } = useDocumentInfo();
    const { value, setValue } = useField<string>({ path });

    const mediaType = useFormFields(([fields]) => fields.mediaType?.value);
    const mimeType = useFormFields(([fields]) => fields.mimeType?.value);
    const file = useFormFields(([fields]) => fields.file?.value);
    const caption = useFormFields(([fields]) => fields.caption?.value);
    const alt = useFormFields(([fields]) => fields.alt?.value);
    const project = useFormFields(([fields]) => fields.project?.value);

    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    const newFile =
        typeof File !== "undefined" && file instanceof File ? file : null;
    const isVideo =
        mediaType === "video" ||
        asText(newFile?.type ?? mimeType).startsWith("video/");
    const hasImage = Boolean(newFile || id);
    const loading = status === "loading";
    // Suggestions only fill an empty field: to get another one, the editor
    // clears it first. Keeps repeated calls deliberate.
    const hasText = Boolean(asText(value).trim());
    const blockedReason = !hasImage
        ? "Ajoutez d'abord une image"
        : hasText
          ? "Videz le champ pour obtenir une suggestion"
          : undefined;

    async function suggest() {
        setStatus("loading");
        setMessage("");
        const payload = {
            field,
            ...(id ? { id } : {}),
            caption: asText(caption),
            alt: asText(alt),
            projectId: relationId(project),
        };
        try {
            let body: BodyInit;
            const headers: HeadersInit = {};
            if (newFile) {
                const form = new FormData();
                form.append("file", newFile);
                form.append("_payload", JSON.stringify(payload));
                body = form;
            } else {
                body = JSON.stringify(payload);
                headers["Content-Type"] = "application/json";
            }
            const response = await fetch("/api/media/suggest", {
                method: "POST",
                credentials: "include",
                headers,
                body,
            });
            if (!response.ok) throw new Error(String(response.status));
            const result: SuggestionResponse = await response.json();

            if (result.text) setValue(result.text);
            if (result.source === "ai") {
                // The filled field speaks for itself: no message on success.
                setStatus("ai");
            } else {
                setStatus("fallback");
                setMessage(fallbackMessage(field, result.text));
            }
        } catch {
            setStatus("error");
            setMessage(
                "La suggestion n'a pas pu être générée. Réessayez plus tard.",
            );
        }
    }

    return (
        <div className="media-text-suggest">
            <TextField {...props} />
            {!isVideo && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 8,
                        marginBottom: 24,
                    }}
                >
                    <span title={blockedReason}>
                        <Button
                            buttonStyle="secondary"
                            size="small"
                            margin={false}
                            disabled={Boolean(blockedReason) || loading}
                            onClick={() => void suggest()}
                            tooltip={blockedReason}
                            aria-label={`Suggestion pour ${NOUN[field]}`}
                            extraButtonProps={{ "aria-busy": loading }}
                        >
                            {loading ? "Suggestion en cours…" : "Suggestion"}
                        </Button>
                    </span>
                    {message && (
                        <small
                            role="status"
                            style={{
                                color:
                                    status === "ai"
                                        ? "var(--theme-elevation-600)"
                                        : "var(--theme-warning-650, var(--theme-elevation-800))",
                            }}
                        >
                            {message}
                        </small>
                    )}
                </div>
            )}
        </div>
    );
}
