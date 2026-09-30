import { assertIsolatedDatabase } from "./lib/payload/isolation";
import { AgencyInfo } from "./globals/AgencyInfo";
import { HomePage } from "./globals/HomePage";
import { AboutPage } from "./globals/AboutPage";
import { ContactPage } from "./globals/ContactPage";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { fr } from "@payloadcms/translations/languages/fr";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Categories } from "./collections/Categories";
import { Projects } from "./collections/Projects";

assertIsolatedDatabase();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config = buildConfig({
    cookiePrefix: "payload-admin-refactor",
    admin: {
        user: Users.slug,
        meta: { titleSuffix: "— Refactor isolé" },
        // date-fns pattern, rendered with the French locale: 28 septembre 2026, 11:39
        dateFormat: "d MMMM yyyy, HH:mm",
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    // Nav groups follow the first visible collection of each group.
    collections: [Projects, Media, Users, Pages, Categories],
    globals: [HomePage, AboutPage, ContactPage, AgencyInfo],
    // French only: the client never sees an English admin.
    i18n: {
        fallbackLanguage: "fr",
        supportedLanguages: { fr },
        // Payload's generic "Créer un(e) nouveau ou nouvelle" reads awkwardly.
        translations: {
            fr: {
                general: {
                    createNew: "Ajouter",
                    createNewLabel: "Ajouter : {{label}}",
                },
                fields: { newLabel: "Ajouter : {{label}}" },
            },
        },
    },
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter({
        push: false,
        disableCreateDatabase: true,
        pool: {
            connectionString: process.env.DATABASE_URL || "",
        },
    }),
    graphQL: {
        disable: true,
    },
    sharp,
    plugins: [
        s3Storage({
            collections: {
                media: {
                    prefix: "media",
                },
            },
            bucket: process.env.S3_BUCKET || "",
            config: {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
                },
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
                forcePathStyle: true,
                requestChecksumCalculation: "WHEN_REQUIRED",
                responseChecksumValidation: "WHEN_REQUIRED",
            },
            clientUploads: false,
        }),
    ],
});

export default config;
