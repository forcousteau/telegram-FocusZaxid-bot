const DEFAULT_POSITION_ID = 1021;

exports.up = pgm => {
  pgm.alterColumn('employees', 'positionId', {
    default: DEFAULT_POSITION_ID,
  });
};

exports.down = pgm => {
  pgm.alterColumn('employees', 'positionId', {
    default: null,
  });
};
