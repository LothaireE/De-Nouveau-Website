CREATE TYPE "public"."enum_contact_page_contact_details" AS ENUM('agency', 'custom');
ALTER TABLE "contact_page" ADD COLUMN "contact_details" "enum_contact_page_contact_details" DEFAULT 'agency';
