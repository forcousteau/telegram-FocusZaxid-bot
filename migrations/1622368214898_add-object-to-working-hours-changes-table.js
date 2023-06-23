exports.up = pgm => {
  pgm.addColumns('workingHoursChanges', {
    objectId: {
      type: 'integer',
      notNull: true,
      references: 'objects',
      default: 1000,
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('workingHoursChanges', ['objectId']);
};
