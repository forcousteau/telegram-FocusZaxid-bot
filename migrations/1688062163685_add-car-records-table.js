exports.up = async (pgm) => {
    pgm.createTable("carRecords", {
      id: {
        type: "serial",
        primaryKey: true,
      },
      carId: {
        type: 'integer',
        notNull: true,
        references: 'cars'
      },
      objectId: {
        type: 'integer',
        notNull: true,
        references: 'objects'
      },
      employeeId: {
        type: 'integer',
        notNull: true,
        references: 'employees'
      },
      fuelPrice: {
        type: "real",
      },
      suspensionPrice: {
        type: "real",
      },
      fuelConsumption: {
        type: "real"
      },
      distance: {
        type: "real",
      },
      travelDate: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable("carRecords");
  };
  