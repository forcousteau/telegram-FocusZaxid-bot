import DB from '../db/index';
import Queries from '../queries/queries';
import Daemons from '../daemons';
import LocationCheckStatus from '../enums/LocationCheckStatus';
import { sendLocationRequests } from '../telegram/helpers/functions';
import axios from 'axios';
import config from 'config';

const FINISH_LOCATION_CHECK_TIMEOUT = 30 * 60 * 1e3; // 30 min
const GEOCODING_REQUEST_SEND_INTERVAL = 2 * 1e3; // 2 seconds

export async function addLocationCheck() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.insert.locationCheck, [LocationCheckStatus.ACTIVE]);
  return res.rows[0];
}

export async function hasActiveLocationCheck() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.locationChecks.active, [
    LocationCheckStatus.ACTIVE,
    LocationCheckStatus.WAITING,
  ]);
  return !!res.rows.length;
}

export async function getLocationCheckById(id: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.locationChecks.byId, [id]);
  return res.rows[0];
}

export async function getLocationChecks() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.locationChecks.all);
  return res.rows;
}

export async function updateLocationCheckStatus(locationCheckId: number, status: LocationCheckStatus) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.update.locationChecks.status, [status, locationCheckId]);
  console.log(`>>> Location check status was updated. Id: ${locationCheckId}, status: ${status}`);
}

/*** Location checks results ***/

export async function addLocationCheckResult(data: {
  locationCheckId: number;
  employeeId: number;
  location?: string;
  working?: boolean;
}) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'locationCheckResults',
    columns,
  });
  await pool.query(query, values);
}

export async function getLocationCheckResultsByEmpIdLocCheckId(employeeId: number, locationCheckId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.locationCheckResults.byEmpIdLocCheckId, [employeeId, locationCheckId]);
  return res;
}

/*** Geocoding requests ***/

export async function addGeocodingRequest(data: { locationCheckId: number; employeeId: number; coordinates: string }) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'geocodingRequests',
    columns,
  });
  await pool.query(query, values);
}

export async function getGeocodingRequestsByLocationCheckId(locationCheckId: number, limit: number = 1) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.geocodingRequests.byLocationCheckIdWithLimit, [locationCheckId, limit]);
  return res.rows;
}

export async function getGeocodingRequestsByEmpIdLocCheckId(employeeId: number, locationCheckId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.geocodingRequests.byEmpIdLocCheckId, [employeeId, locationCheckId]);
  return res;
}

export async function deleteGeocodingRequests(ids: number[]) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.delete.geocodingRequests.byIds, [ids]);
}

/*** Business logic functions ***/

export async function getLocationByCoordinates(coordinates) {
  const coordinatesArr = coordinates.split(' ');
  const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
    params: {
      key: config.get('locationIQ.key'),
      lat: coordinatesArr[0],
      lon: coordinatesArr[1],
      format: 'json',
    },
  });
  const place = response.data.address;
  const location =
    (place.state_district || place.state || place.country || place.region || '?') +
    ', ' +
    (place.city || place.city_district || place.town || place.village || place.suburb || place.hamlet || '?') +
    ', ' +
    (place.road || '?') +
    ', ' +
    (place.house_number || '?');
  return location;
}

export async function startLocationCheck() {
  if (await hasActiveLocationCheck()) {
    throw new Error("Can't start location check automatically: another one is in progress now");
  }

  const locationCheck = await addLocationCheck();

  await sendLocationRequests(locationCheck.id);

  Daemons.startDaemon(
    `geocodingRequestSend>${locationCheck.id}`,
    sendGeocodingRequest,
    GEOCODING_REQUEST_SEND_INTERVAL,
    locationCheck.id
  );

  setTimeout(updateLocationCheckStatus, FINISH_LOCATION_CHECK_TIMEOUT, locationCheck.id, LocationCheckStatus.WAITING);
}

export async function finishLocationCheck(locationCheckId: number) {
  Daemons.deleteDaemon(`geocodingRequestSend>${locationCheckId}`);
  await updateLocationCheckStatus(locationCheckId, LocationCheckStatus.FINISHED);
  console.log(`>>> Location check was finished. Id: ${locationCheckId}`);
}

export async function sendGeocodingRequest(locationCheckId: number) {
  const geocodingRequests = await getGeocodingRequestsByLocationCheckId(locationCheckId);

  // No geocoding requests waiting for sending
  if (!geocodingRequests.length) {
    const locationCheck = await getLocationCheckById(locationCheckId);
    return locationCheck.status === LocationCheckStatus.WAITING // Location check is waiting for all requests
      ? finishLocationCheck(locationCheckId) // Set it as finished
      : null;
  }

  // Get ids of geocoding requests
  const ids = geocodingRequests.map(geocodingRequest => geocodingRequest.id);
  for (const geocodingRequest of geocodingRequests) {
    try {
      const location = await getLocationByCoordinates(geocodingRequest.coordinates);
      console.log(`>>> Geocoding request success. Location: ${location}`);
      await addLocationCheckResult({
        locationCheckId: geocodingRequest.locationCheckId,
        employeeId: geocodingRequest.employeeId,
        location,
        working: true,
      });
    } catch (err) {
      console.error(err);
    }
  }
  // Delete geocoding requests
  await deleteGeocodingRequests(ids);
}

export async function checkForLocationReport(employeeId: number, locationCheckId: number) {
  const locationCheckResults = await getLocationCheckResultsByEmpIdLocCheckId(employeeId, locationCheckId);
  const geocodingRequests = await getGeocodingRequestsByEmpIdLocCheckId(employeeId, locationCheckId);
  return !!(locationCheckResults.rowCount || geocodingRequests.rowCount);
}
