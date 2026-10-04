ALTER TABLE "order_items" ADD COLUMN "product_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_snapshot" jsonb;