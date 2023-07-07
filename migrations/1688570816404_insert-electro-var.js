exports.up = pgm => {
    pgm.sql(`
    INSERT INTO vars (name, value) 
    VALUES 
    ('electroPrice', 1)
    ON CONFLICT DO NOTHING`);
  };
  
  exports.down = pgm => {
    pgm.sql(`
    DELETE FROM vars
    WHERE name = 'electroPrice'`);
  };
  