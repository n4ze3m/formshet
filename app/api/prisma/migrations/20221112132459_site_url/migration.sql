-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicationSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disableReg" BOOLEAN NOT NULL DEFAULT false,
    "maxUsers" INTEGER NOT NULL DEFAULT 100,
    "siteUrl" TEXT NOT NULL DEFAULT 'localhost:3000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ApplicationSetting" ("createdAt", "disableReg", "id", "maxUsers", "updatedAt") SELECT "createdAt", "disableReg", "id", "maxUsers", "updatedAt" FROM "ApplicationSetting";
DROP TABLE "ApplicationSetting";
ALTER TABLE "new_ApplicationSetting" RENAME TO "ApplicationSetting";
CREATE UNIQUE INDEX "ApplicationSetting_id_key" ON "ApplicationSetting"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
