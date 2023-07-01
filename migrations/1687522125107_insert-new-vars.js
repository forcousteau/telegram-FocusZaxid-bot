exports.up = pgm => {
    pgm.sql(`
    INSERT INTO vars (name, value) 
    VALUES 
    ('pricePerKM', 1),
    ('suspensionPrice', 1),
    ('petrolPrice', 1),
    ('dieselPrice', 1),
    ('gasPrice', 1)
    ON CONFLICT DO NOTHING`);
  };
  
  exports.down = pgm => {
    pgm.sql(`
    DELETE FROM vars
    WHERE name = 'pricePerKM' OR 
    name = 'suspensionPrice' OR 
    name = 'petrolPrice' OR 
    name = 'dieselPrice' OR 
    name = 'gasPrice'`);
  };
  