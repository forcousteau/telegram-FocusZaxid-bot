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

  pgm.createTrigger(
    'workShiftsActions',
    'checklastworkshiftactionbeforeinsert',
    {
      when: 'BEFORE',
      operation: 'INSERT',
      level: 'ROW',
      function: 'checklastworkshiftaction'
    },
  );
};

exports.down = pgm => {
  pgm.dropTrigger(
    'workShiftsActions',
    'checklastworkshiftactionbeforeinsert',
    {
      ifExists: true,
    }
  );

  pgm.dropFunction(
    'checklastworkshiftaction',
    [],
    {
      ifExists: true,
    }
  );
};
