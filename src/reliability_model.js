const moment = require('moment');

const pg_pool = require('./pg_connection.js')

const getShiftCal = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT shift_id, start_time, end_time FROM reliability.accel_shift_dates ORDER BY start_time ASC', (error, results) => {
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
    pg_pool.pool.query('INSERT INTO reliability.accel_shift_dates (start_time, end_time) VALUES ($1, $2) RETURNING *', [start_time, end_time], (error, results) => {
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
    pg_pool.pool.query('DELETE FROM reliability.accel_shift_dates WHERE shift_id = $1', [id], (error, results) => {
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
    pg_pool.pool.query('SELECT beam_source,beam_destination,program_name,program_type,start_time,end_time FROM reliability.accel_programs ORDER BY start_time ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getBeamDest = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT beam_dest_id,beam_destination FROM reliability.accel_beam_destination ORDER BY beam_destination ASC', (error, results) => {
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
    pg_pool.pool.query('INSERT INTO reliability.accel_beam_destination (beam_destination) VALUES ($1) RETURNING *', [beam_destination], (error, results) => {
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
    pg_pool.pool.query('DELETE FROM reliability.accel_beam_destination WHERE beam_dest_id = $1', [id], (error, results) => {
      if (error) {
        console.log("Got an error while deleting:");
        console.log(error);
        reject(error)
      }
      resolve(`beam destination deleted with beam_dest_id: ${id}`)
    })
  })
}

const getAccelSystem = () => {
  return new Promise(function(resolve, reject) {
    pg_pool.pool.query('SELECT system_id, system_name, active_flag FROM reliability.accel_systems ORDER BY system_name ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const createAccelSystem = (body) => {
  return new Promise(function(resolve, reject) {
    const { system_name } = body
    pg_pool.pool.query('INSERT INTO reliability.accel_systems (system_name) VALUES ($1) RETURNING *', [system_name], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new system name has been added added: ${results.rows[0]}`)
    })
  })
}
const deleteAccelSystem = (id_string) => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(id_string);
    pg_pool.pool.query('DELETE FROM reliability.accel_systems WHERE system_id = $1', [id], (error, results) => {
      if (error) {
        console.log("Got an error while deleting:");
        console.log(error);
        reject(error)
      }
      resolve(`Accel Systems deleted for system_id: ${id}`)
    })
  })
}
const createShiftInfo = async (body) => {
  console.log("In reliability_model createShiftInfo new Shift Info.");
// Poonam - put this inside or outside try ??
    const { shiftDates, commentsData, downtimeData } = body;
    let client; // Declare client variable outside the try-catch block
//    try {
      // Start a transaction to ensure atomicity (all or nothing)
      client = await pg_pool.pool.connect();
      await client.query('BEGIN');
      const shiftDatesQuery = `
        INSERT INTO reliability.accel_shift_dates (start_time, end_time) 
        VALUES ($1, $2) 
        RETURNING shift_id;
        `;      
      const shiftDatesValues = [shiftDates.startTime, shiftDates.endTime];
      const shiftDatesResult = await client.query(shiftDatesQuery, shiftDatesValues);
      const shiftId = shiftDatesResult.rows[0].shift_id;
      
      const commentsQuery = `
        INSERT INTO reliability.accel_comments (comments, parent_id, parent_table) 
        VALUES ($1, $2, $3);
        `;
      for (const comments of commentsData) {
        const commentsValues = [comments.comments, shiftId, 'ACCEL_SHIFT_DATES'];
        await client.query(commentsQuery, commentsValues);
      }

      const downtimeQuery = `
        INSERT INTO reliability.accel_downtime_entry (downtime_description, downtime_category, system_id, 
                                                   downtime_start, downtime_end, cater_id, elog_url, shift_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `;
    for (const downtime of downtimeData) {
      const downtimeValues = [
        downtime.description,
        downtime.category,
        downtime.system || null,
        moment(downtime.start).format('YYYY-MM-DDTHH:mm:ss'),
        moment(downtime.end).format('YYYY-MM-DDTHH:mm:ss'),
        downtime.caterId || null, // Use null if caterId is not provided
        downtime.elogUrl || null, // Use null if elogUrl is not provided
        shiftId,
      ];
      await client.query(downtimeQuery, downtimeValues);
    }
     
      // Commit the transaction
      await client.query('COMMIT');
//      res.json({ success: true });
//    } catch (error) {
      // Rollback the transaction in case of an error
//      if (client) {
//        await client.query('ROLLBACK');
//      }
//      console.error('Error creating Shift data and comments:', error.message);
//      res.status(500).json({ error: 'Internal Server Error' });
//    } finally {
      // Release the client back to the pool in the finally block
//      if (client) {
//        client.release();
//      }
//    }
}

module.exports = {
  getShiftCal,
  createShiftCal,
  deleteShiftCal,
  getProgram,
  getBeamDest,
  createBeamDest,
  deleteBeamDest,
  getAccelSystem,
  createAccelSystem,
  deleteAccelSystem,
  createShiftInfo
}