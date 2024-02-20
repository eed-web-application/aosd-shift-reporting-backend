const pg_pool = require('./pg_connection.js')

const getShiftCal = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT shift_id, start_time, end_time FROM reliability_new.accel_shift_dates ORDER BY start_time ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}
const createShiftCal = (body) => {
  return new Promise(function(resolve, reject) {
    const { start_time, end_time } = body
    pg_pool.pool.query('INSERT INTO reliability_new.accel_shift_dates (start_time, end_time) VALUES ($1, $2) RETURNING *', [start_time, end_time], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new Shift Calendar has been added added: ${results.rows[0]}`)
    })
  })
}
const deleteShiftCal = (id_string) => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(id_string);
    pg_pool.pool.query('DELETE FROM reliability_new.accel_shift_dates WHERE shift_id = $1', [id], (error, results) => {
      if (error) {
        console.log("Got an error while deleting:");
        console.log(error);
        reject(error)
      }
      resolve(`Shift calendar deleted with SHIFT_ID: ${id}`)
    })
  })
}

const getProgram = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT beam_source,beam_destination,program_name,program_type,start_time,end_time FROM reliability_new.accel_programs ORDER BY start_time ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getBeamDest = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT beam_dest_id,beam_destination FROM reliability_new.accel_beam_destination ORDER BY beam_destination ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const createBeamDest = (body) => {
  return new Promise(function(resolve, reject) {
    const { beam_destination } = body
    pg_pool.pool.query('INSERT INTO reliability_new.accel_beam_destination (beam_destination) VALUES ($1) RETURNING *', [beam_destination], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new beam destination has been added added: ${results.rows[0]}`)
    })
  })
}
const deleteBeamDest = (id_string) => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(id_string);
    pg_pool.pool.query('DELETE FROM reliability_new.accel_beam_destination WHERE beam_dest_id = $1', [id], (error, results) => {
      if (error) {
        console.log("Got an error while deleting:");
        console.log(error);
        reject(error)
      }
      resolve(`beam destination deleted with beam_dest_id: ${id}`)
    })
  })
}

module.exports = {
  getShiftCal,
  createShiftCal,
  deleteShiftCal,
  getProgram,
  getBeamDest,
  createBeamDest,
  deleteBeamDest
}