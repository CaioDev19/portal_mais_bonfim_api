-- AlterTable
ALTER TABLE "post" ALTER COLUMN "summary" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "post_category_id_idx" ON "post"("category_id");
