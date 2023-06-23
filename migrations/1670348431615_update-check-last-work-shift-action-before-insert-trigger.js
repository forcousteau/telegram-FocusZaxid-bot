exports.up = pgm => {
  pgm.createFunction(
    'checklastworkshiftaction',
    [],
    {
      replace: true,
      language: 'plpgsql',
      returns: 'trigger',
    },
    `
      BEGIN
        SELECT "typeId", "createdAt" INTO OLD FROM "workShiftsActions" WHERE "employeeId" = NEW."employeeId"
        ORDER BY "createdAt" DESC, "typeId" DESC LIMIT 1;

        IF OLD."typeId" = NEW."typeId" AND OLD."createdAt" <= NEW."createdAt" THEN
          RAISE EXCEPTION 'Work shift is already open / closed';
        END IF;
        RETURN NEW;
      END
    `
  );
};

exports.down = pgm => {
  pgm.createFunction(
    'checklastworkshiftaction',
    [],
    {
      replace: true,
      language: 'plpgsql',
      returns: 'trigger',
    },
    `
      BEGIN
        IF (
          SELECT "typeId" FROM "workShiftsActions" WHERE "employeeId" = NEW."employeeId"
          ORDER BY "createdAt" DESC, "typeId" DESC LIMIT 1
        ) = NEW."typeId" THEN
          RAISE EXCEPTION 'Work shift is already open / closed';
        END IF;
        RETURN NEW;
      END
    `
  );
};
