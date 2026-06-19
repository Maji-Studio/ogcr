DROP INDEX "items_project_id_idx";--> statement-breakpoint
CREATE INDEX "items_project_id_status_created_at_idx" ON "items" USING btree ("project_id","status","created_at" DESC NULLS LAST);