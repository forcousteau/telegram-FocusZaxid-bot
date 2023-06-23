exports.up = pgm => {
  pgm.createTable('workingHoursChanges', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    date: {
      type: 'date',
      notNull: true,
    },
    workingHoursBefore: {
      type: 'double',
      notNull: true,
    },
    workingHoursAfter: {
      type: 'double',
      notNull: true,
    },
    employeeId: {
      type: 'integer',
      notNull: true,
      references: 'employees'
    },
    createdAt: {
      type: 'timestamptz',
      notNull: true,
      default: 'now()'
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('workingHoursChanges');
};
