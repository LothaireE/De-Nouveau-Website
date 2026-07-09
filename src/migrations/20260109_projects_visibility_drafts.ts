import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "projects"
    ADD COLUMN IF NOT EXISTS "_status" "public"."enum_projects_status" DEFAULT 'published';

    ALTER TABLE "projects"
    ADD COLUMN IF NOT EXISTS "visibility" varchar DEFAULT 'show';

    UPDATE "projects"
    SET "_status" = 'published'
    WHERE "_status" IS NULL;

    UPDATE "projects"
    SET "visibility" = 'show'
    WHERE "visibility" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "projects"
    DROP COLUMN IF EXISTS "visibility";

    ALTER TABLE "projects"
    DROP COLUMN IF EXISTS "_status";
  `);
}
