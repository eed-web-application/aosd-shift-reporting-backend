const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.24.5.194',
  database: 'reliability',
  password: 'L4gkpRq03JSCn4FxukuiTeKT9q2ogYTOJh0BJVGXfDRWTt8ehKDyhw89RKRyLAFR',
  port: 5432,
});

module.exports = {
  pool,
}