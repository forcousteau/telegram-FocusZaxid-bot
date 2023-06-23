exports.up = pgm => {
  pgm.addColumns('employees', {
    shoeSize: {
      type: 'integer',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('employees', ['objectId']);
};
