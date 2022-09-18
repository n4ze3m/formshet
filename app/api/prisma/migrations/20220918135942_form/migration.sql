-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "sheetUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicAccess" BOOLEAN NOT NULL DEFAULT false,
    "accessKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_id_key" ON "Form"("id");
