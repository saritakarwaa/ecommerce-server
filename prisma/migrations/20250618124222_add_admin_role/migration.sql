-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPERADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
