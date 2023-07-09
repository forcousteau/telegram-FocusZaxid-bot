exports.up = pgm => {
    pgm.sql(`
    INSERT INTO vars (name, value) 
    VALUES 
    ('lastFuelUpdate', '')
    ON CONFLICT DO NOTHING`);
  };
  
  exports.down = pgm => {
    pgm.sql(`
    DELETE FROM vars
    WHERE name = 'lastFuelUpdate'`);
  };
  