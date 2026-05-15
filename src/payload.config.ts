import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Categories } from "./collections/Categories";
import { Projects } from "./collections/Projects";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config = buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Media, Pages, Categories, Projects],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URL || "",
        },
    }),
    sharp,
    plugins: [
        s3Storage({
            collections: {
                media: true,
                //   media: {
                //     prefix: 'media',
                //   },
            },
            bucket: process.env.NEXT_PUBLIC_S3_BUCKET || "",
            config: {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
                },
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
                forcePathStyle: true,
            },
            clientUploads: true,
        }),
    ],
});

export default config;
