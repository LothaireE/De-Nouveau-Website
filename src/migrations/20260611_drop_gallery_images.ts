import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(
        sql`DROP TABLE IF EXISTS "projects_gallery_images" CASCADE;`,
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`CREATE TABLE "projects_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer
    );`);
}
