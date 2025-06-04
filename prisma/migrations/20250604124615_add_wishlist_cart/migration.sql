/*
  Warnings:

  - You are about to drop the `_Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Cart" DROP CONSTRAINT "_Cart_A_fkey";

-- DropForeignKey
ALTER TABLE "_Cart" DROP CONSTRAINT "_Cart_B_fkey";

-- DropForeignKey
ALTER TABLE "_Wishlist" DROP CONSTRAINT "_Wishlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_Wishlist" DROP CONSTRAINT "_Wishlist_B_fkey";

-- DropTable
DROP TABLE "_Cart";

-- DropTable
DROP TABLE "_Wishlist";

-- CreateTable
CREATE TABLE "UserWishlist" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWishlist_pkey" PRIMARY KEY ("userId","productId")
);

-- CreateTable
CREATE TABLE "UserCart" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "UserCart_pkey" PRIMARY KEY ("userId","productId")
);

-- AddForeignKey
ALTER TABLE "UserWishlist" ADD CONSTRAINT "UserWishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWishlist" ADD CONSTRAINT "UserWishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
