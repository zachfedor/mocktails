-- CreateTable
CREATE TABLE "Cocktail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "rating" REAL NOT NULL DEFAULT 0,
    "placeId" TEXT NOT NULL,
    CONSTRAINT "Cocktail_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
