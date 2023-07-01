exports.up = async (pgm) => {
  pgm.createTable("cars", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
      default: "",
    },
    fuelType: {
      type: "varchar(100)",
      notNull: true,
      default: "petrol",
    },
    fuelConsumption: {
      type: "real",
      notNull: true,
      default: 1,
    },
    isCompanyProperty: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    isActive: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updatedAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("cars");
  pgm.dropType("fuel_type");
};
