exports.up = pgm => {
    pgm.addColumns('objects', {
      isDriveCompensated: {
        type: 'boolean',
        default: false,
        notNull: true
      },
      distanceInKM: {
        type: 'real',
        default: 0,
        notNull: true
      }
    });
  };
  
  exports.down = pgm => {
    pgm.dropColumns('objects', ['isDriveCompensated', 'distanceInKM']);
  };
  