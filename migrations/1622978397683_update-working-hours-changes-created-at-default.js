exports.up = pgm => {
  pgm.alterColumn('workingHoursChanges', 'createdAt', {
    default: pgm.func('current_timestamp'),
  });
};

exports.down = pgm => {
  pgm.alterColumn('workingHoursChanges', 'createdAt', {
    default: 'now()',
  });
};
