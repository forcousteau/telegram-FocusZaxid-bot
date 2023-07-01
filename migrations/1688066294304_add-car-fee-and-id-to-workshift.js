exports.up = pgm => {
    pgm.sql(`
    ALTER TABLE "workShiftsActions" ADD COLUMN IF NOT EXISTS "carFee" REAL;
    ALTER TABLE "workShiftsActions" ADD COLUMN IF NOT EXISTS "carId" INTEGER;
    UPDATE "workShiftsActions"
    SET "carFee" = (SELECT value
    FROM vars
    WHERE name LIKE 'carDayPayment' LIMIT 1)::INT
    WHERE car = true;
    `);
  };
  
  exports.down = pgm => {
    pgm.dropColumns('workShiftsActions', ['carFee', 'carId']);
  };
  