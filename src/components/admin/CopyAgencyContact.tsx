"use client";

import { Button, useForm, useFormFields } from "@payloadcms/ui";
import { useState } from "react";

type AgencyContact = {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    socialMedias?: { link?: string | null; label?: string | null }[] | null;
};

/**
 * Fills the page's contact fields with the agency details, as a starting
 * point the editor can then change or clear. Nothing is saved until the
 * editor saves the page.
 */
export function CopyAgencyContact() {
    const { dispatchFields, addFieldRow, removeFieldRow, setModified } =
        useForm();
    const socialRows = useFormFields(
        ([fields]) => fields.socialMedias?.rows?.length ?? 0,
    );
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
        "idle",
    );

    async function copy() {
        setStatus("loading");
        try {
            const response = await fetch("/api/globals/agency-info?depth=0", {
                credentials: "include",
            });
            if (!response.ok) throw new Error(String(response.status));
            const agency: AgencyContact = await response.json();

            for (const path of ["email", "phone", "address"] as const) {
                dispatchFields({
                    type: "UPDATE",
                    path,
                    value: agency[path] ?? "",
                });
            }

            for (let row = socialRows - 1; row >= 0; row--)
                removeFieldRow({ path: "socialMedias", rowIndex: row });
            (agency.socialMedias ?? []).forEach((social, rowIndex) =>
                addFieldRow({
                    path: "socialMedias",
                    schemaPath: "socialMedias",
                    rowIndex,
                    subFieldState: {
                        link: {
                            value: social.link ?? "",
                            initialValue: social.link ?? "",
                            valid: true,
                        },
                        label: {
                            value: social.label ?? "",
                            initialValue: social.label ?? "",
                            valid: true,
                        },
                    },
                }),
            );

            setModified(true);
            setStatus("done");
        } catch {
            setStatus("error");
        }
    }

    return (
        <div style={{ marginBottom: 24 }}>
            <Button
                buttonStyle="secondary"
                size="small"
                onClick={copy}
                disabled={status === "loading"}
            >
                Copier les informations de l’agence
            </Button>
            <p
                style={{
                    margin: "8px 0 0",
                    color: "var(--theme-elevation-500)",
                }}
                role="status"
            >
                {status === "done"
                    ? "Copié. Modifiez ou videz les champs, puis enregistrez."
                    : status === "error"
                      ? "Les informations de l’agence n’ont pas pu être lues. Réessayez."
                      : "Remplit les champs ci-dessous avec les coordonnées de « Informations de l’agence »."}
            </p>
        </div>
    );
}
