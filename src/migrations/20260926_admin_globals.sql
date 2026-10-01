CREATE TABLE "home_page_social_medias" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link" varchar,
	"label" varchar
);

CREATE TABLE "home_page_awards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"year" varchar
);

CREATE TABLE "home_page_studio_team" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"role" varchar
);

CREATE TABLE "home_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"intro" varchar,
	"content" jsonb,
	"portrait_id" integer,
	"hero_media_id" integer,
	"email" varchar,
	"phone" varchar,
	"address" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE "about_page_social_medias" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link" varchar,
	"label" varchar
);

CREATE TABLE "about_page_awards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"year" varchar
);

CREATE TABLE "about_page_studio_team" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"role" varchar
);

CREATE TABLE "about_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"intro" varchar,
	"content" jsonb,
	"portrait_id" integer,
	"hero_media_id" integer,
	"email" varchar,
	"phone" varchar,
	"address" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE "contact_page_social_medias" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"link" varchar,
	"label" varchar
);

CREATE TABLE "contact_page_awards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"year" varchar
);

CREATE TABLE "contact_page_studio_team" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"role" varchar
);

CREATE TABLE "contact_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"intro" varchar,
	"content" jsonb,
	"portrait_id" integer,
	"hero_media_id" integer,
	"email" varchar,
	"phone" varchar,
	"address" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

ALTER TABLE "home_page_social_medias" ADD CONSTRAINT "home_page_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "home_page_awards" ADD CONSTRAINT "home_page_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "home_page_studio_team" ADD CONSTRAINT "home_page_studio_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "home_page" ADD CONSTRAINT "home_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "about_page_social_medias" ADD CONSTRAINT "about_page_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "about_page_awards" ADD CONSTRAINT "about_page_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "about_page_studio_team" ADD CONSTRAINT "about_page_studio_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "contact_page_social_medias" ADD CONSTRAINT "contact_page_social_medias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_page_awards" ADD CONSTRAINT "contact_page_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_page_studio_team" ADD CONSTRAINT "contact_page_studio_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX "home_page_social_medias_order_idx" ON "home_page_social_medias" USING btree ("_order");
CREATE INDEX "home_page_social_medias_parent_id_idx" ON "home_page_social_medias" USING btree ("_parent_id");
CREATE INDEX "home_page_awards_order_idx" ON "home_page_awards" USING btree ("_order");
CREATE INDEX "home_page_awards_parent_id_idx" ON "home_page_awards" USING btree ("_parent_id");
CREATE INDEX "home_page_studio_team_order_idx" ON "home_page_studio_team" USING btree ("_order");
CREATE INDEX "home_page_studio_team_parent_id_idx" ON "home_page_studio_team" USING btree ("_parent_id");
CREATE INDEX "home_page_portrait_idx" ON "home_page" USING btree ("portrait_id");
CREATE INDEX "home_page_hero_media_idx" ON "home_page" USING btree ("hero_media_id");
CREATE INDEX "about_page_social_medias_order_idx" ON "about_page_social_medias" USING btree ("_order");
CREATE INDEX "about_page_social_medias_parent_id_idx" ON "about_page_social_medias" USING btree ("_parent_id");
CREATE INDEX "about_page_awards_order_idx" ON "about_page_awards" USING btree ("_order");
CREATE INDEX "about_page_awards_parent_id_idx" ON "about_page_awards" USING btree ("_parent_id");
CREATE INDEX "about_page_studio_team_order_idx" ON "about_page_studio_team" USING btree ("_order");
CREATE INDEX "about_page_studio_team_parent_id_idx" ON "about_page_studio_team" USING btree ("_parent_id");
CREATE INDEX "about_page_portrait_idx" ON "about_page" USING btree ("portrait_id");
CREATE INDEX "about_page_hero_media_idx" ON "about_page" USING btree ("hero_media_id");
CREATE INDEX "contact_page_social_medias_order_idx" ON "contact_page_social_medias" USING btree ("_order");
CREATE INDEX "contact_page_social_medias_parent_id_idx" ON "contact_page_social_medias" USING btree ("_parent_id");
CREATE INDEX "contact_page_awards_order_idx" ON "contact_page_awards" USING btree ("_order");
CREATE INDEX "contact_page_awards_parent_id_idx" ON "contact_page_awards" USING btree ("_parent_id");
CREATE INDEX "contact_page_studio_team_order_idx" ON "contact_page_studio_team" USING btree ("_order");
CREATE INDEX "contact_page_studio_team_parent_id_idx" ON "contact_page_studio_team" USING btree ("_parent_id");
CREATE INDEX "contact_page_portrait_idx" ON "contact_page" USING btree ("portrait_id");
CREATE INDEX "contact_page_hero_media_idx" ON "contact_page" USING btree ("hero_media_id");
