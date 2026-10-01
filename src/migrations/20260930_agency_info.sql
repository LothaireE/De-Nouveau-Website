CREATE TABLE "agency_info_social_medias" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link" varchar,
	"label" varchar
);

CREATE TABLE "agency_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
	"phone" varchar,
	"address" varchar,
	"initialized" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

ALTER TABLE "agency_info_social_medias" ADD CONSTRAINT "agency_info_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agency_info"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "agency_info_social_medias_order_idx" ON "agency_info_social_medias" USING btree ("_order");
CREATE INDEX "agency_info_social_medias_parent_id_idx" ON "agency_info_social_medias" USING btree ("_parent_id");
