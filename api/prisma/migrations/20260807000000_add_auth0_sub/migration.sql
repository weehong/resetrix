-- AlterTable
ALTER TABLE "users" ADD COLUMN "auth0Sub" TEXT;

-- Backfill: existing sample rows get their email as a stand-in subject.
UPDATE "users" SET "auth0Sub" = 'pending:' || "id" WHERE "auth0Sub" IS NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "auth0Sub" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0Sub_key" ON "users"("auth0Sub");
