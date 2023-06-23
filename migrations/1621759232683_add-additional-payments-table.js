exports.up = pgm => {
  pgm.createTable('additionalPayments', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    employeeId: {
      type: 'integer',
      notNull: true,
      references: 'employees'
    },
    type: {
      type: 'integer',
      notNull: true,
    },
    month: {
      type: 'integer',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    sum: {
      type: 'real',
      notNull: true,
    },
  });

  pgm.addConstraint('additionalPayments', 'additionalPayments_type_month_year_unique', {
    unique: ['employeeId', 'type', 'month', 'year'],
  });
};

exports.down = pgm => {
  pgm.dropTable('additionalPayments');
};
