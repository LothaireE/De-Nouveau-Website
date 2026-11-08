import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { TextFieldClientProps } from "payload";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { state } = vi.hoisted(() => ({
    state: {
        fields: {} as Record<string, { value: unknown }>,
        id: undefined as number | undefined,
        setValue: vi.fn(),
    },
}));

vi.mock("@payloadcms/ui", () => ({
    TextField: ({ path }: { path: string }) => (
        <input
            aria-label={`champ ${path}`}
            readOnly
            value={String(state.fields[path]?.value ?? "")}
        />
    ),
    Button: ({
        children,
        disabled,
        onClick,
        tooltip,
        "aria-label": ariaLabel,
    }: {
        children: ReactNode;
        disabled?: boolean;
        onClick?: () => void;
        tooltip?: string;
        "aria-label"?: string;
    }) => (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            title={tooltip}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    ),
    useDocumentInfo: () => ({ id: state.id }),
    useField: ({ path }: { path: string }) => ({
        value: state.fields[path]?.value,
        setValue: state.setValue,
    }),
    useFormFields: (selector: (context: [typeof state.fields]) => unknown) =>
        selector([state.fields]),
}));

import { MediaTextSuggestField } from "./MediaTextSuggestField";

const props = (name: "alt" | "caption") =>
    ({
        path: name,
        field: { name, label: name, type: "text" },
    }) as unknown as TextFieldClientProps;

const fetchMock = vi.fn();
const suggestButton = () =>
    screen.queryByRole("button", { name: /^Suggestion pour/ });

beforeEach(() => {
    state.fields = { mediaType: { value: "image" }, project: { value: 3 } };
    state.id = 7;
    state.setValue.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("Media text suggestion field", () => {
    it("keeps the native text field", () => {
        render(<MediaTextSuggestField {...props("caption")} />);
        expect(screen.getByLabelText("champ caption")).toBeInTheDocument();
    });

    it("hides the button for a video", () => {
        state.fields.mediaType = { value: "video" };
        render(<MediaTextSuggestField {...props("caption")} />);
        expect(suggestButton()).not.toBeInTheDocument();
        expect(screen.getByLabelText("champ caption")).toBeInTheDocument();
    });

    it("hides the button for a new video file", () => {
        state.id = undefined;
        state.fields = {
            file: { value: new File(["x"], "clip.mp4", { type: "video/mp4" }) },
        };
        render(<MediaTextSuggestField {...props("alt")} />);
        expect(suggestButton()).not.toBeInTheDocument();
    });

    it("is disabled until an image is added", () => {
        state.id = undefined;
        state.fields = {};
        render(<MediaTextSuggestField {...props("alt")} />);
        const button = suggestButton();
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("title", "Ajoutez d'abord une image");
    });

    it("fills the field with the suggestion of a saved media", async () => {
        state.fields.caption = { value: "Toiture en bambou de nuit" };
        fetchMock.mockResolvedValue(
            Response.json({ text: "Charpente éclairée", source: "ai" }),
        );
        render(<MediaTextSuggestField {...props("alt")} />);
        fireEvent.click(suggestButton()!);

        await waitFor(() =>
            expect(state.setValue).toHaveBeenCalledWith("Charpente éclairée"),
        );
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe("/api/media/suggest");
        expect(JSON.parse(init.body)).toEqual({
            field: "alt",
            id: 7,
            caption: "Toiture en bambou de nuit",
            alt: "",
            projectId: 3,
        });
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("sends the selected file of a new media", async () => {
        state.id = undefined;
        const file = new File(["img"], "toiture.jpg", { type: "image/jpeg" });
        state.fields = { file: { value: file } };
        fetchMock.mockResolvedValue(
            Response.json({ text: "Toiture", source: "ai" }),
        );
        render(<MediaTextSuggestField {...props("caption")} />);
        fireEvent.click(suggestButton()!);

        await waitFor(() =>
            expect(state.setValue).toHaveBeenCalledWith("Toiture"),
        );
        const body = fetchMock.mock.calls[0][1].body as FormData;
        expect(body).toBeInstanceOf(FormData);
        expect((body.get("file") as File).name).toBe("toiture.jpg");
        expect(JSON.parse(String(body.get("_payload")))).toMatchObject({
            field: "caption",
        });
    });

    it("only suggests for an empty field", () => {
        state.fields.alt = { value: "Texte déjà saisi" };
        render(<MediaTextSuggestField {...props("alt")} />);
        const button = suggestButton();
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute(
            "title",
            "Videz le champ pour obtenir une suggestion",
        );
        fireEvent.click(button!);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("explains a fallback under the field", async () => {
        fetchMock.mockResolvedValue(
            Response.json({
                text: "Bambou U",
                source: "fallback",
                reason: "quota",
            }),
        );
        render(<MediaTextSuggestField {...props("caption")} />);
        fireEvent.click(suggestButton()!);
        expect(await screen.findByRole("status")).toHaveTextContent(
            "Suggestion IA indisponible",
        );
        expect(state.setValue).toHaveBeenCalledWith("Bambou U");
    });
    it("still fills the field when the media is read-only", async () => {
        fetchMock.mockResolvedValue(
            Response.json({ text: "Toiture en bambou", source: "ai" }),
        );
        render(
            <MediaTextSuggestField
                {...props("caption")}
                {...({ readOnly: true } as object)}
            />,
        );
        const button = suggestButton();
        expect(button).toBeEnabled();
        fireEvent.click(button!);
        await waitFor(() =>
            expect(state.setValue).toHaveBeenCalledWith("Toiture en bambou"),
        );
    });
});
