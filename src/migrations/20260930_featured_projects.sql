CREATE TABLE "home_page_featured_projects" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"project_id" integer
);

ALTER TABLE "home_page_featured_projects" ADD CONSTRAINT "home_page_featured_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "home_page_featured_projects" ADD CONSTRAINT "home_page_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "home_page_featured_projects_order_idx" ON "home_page_featured_projects" USING btree ("_order");
CREATE INDEX "home_page_featured_projects_parent_id_idx" ON "home_page_featured_projects" USING btree ("_parent_id");
CREATE INDEX "home_page_featured_projects_project_idx" ON "home_page_featured_projects" USING btree ("project_id");
