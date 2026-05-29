import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const secret = request.headers.get("x-revalidation-secret");

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json(
            { message: "Invalid secret" },
            { status: 401 },
        );
    }

    try {
        const { path } = await request.json();

        if (!path || typeof path !== "string") {
            return NextResponse.json(
                { message: "Path is required" },
                { status: 400 },
            );
        }

        if (!path.startsWith("/")) {
            return NextResponse.json(
                { message: "Path must start with /" },
                { status: 400 },
            );
        }

        revalidatePath(path);

        return NextResponse.json({
            revalidated: true,
            path,
            message: `Path ${path} revalidated`,
        });
    } catch {
        return NextResponse.json(
            { message: "Invalid JSON body" },
            { status: 400 },
        );
    }
}
