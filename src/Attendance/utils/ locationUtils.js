// Office coordinates (your provided location)
const OFFICE_LAT = 21.485862;
const OFFICE_LNG = 86.907635;
const OFFICE_RADIUS_METERS = 50; // 50 meters radius

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Check if user is within office radius
export function isWithinOfficeRadius(userLat, userLng) {
  const distance = calculateDistance(userLat, userLng, OFFICE_LAT, OFFICE_LNG);
  return distance <= OFFICE_RADIUS_METERS;
}

// Get current location
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  });
}

// Get attendance status based on time
export function getAttendanceStatus(checkInTime) {
  if (!checkInTime) return 'ABSENT';
  
  const checkInDate = new Date(checkInTime);
  const checkInHour = checkInDate.getHours();
  const checkInMinute = checkInDate.getMinutes();
  const checkInTotalMinutes = checkInHour * 60 + checkInMinute;
  
  const officeStartTime = 10 * 60; // 10:00 AM
  const lateThreshold = 10 * 60 + 30; // 10:30 AM
  
  if (checkInTotalMinutes > lateThreshold) return 'LATE';
  if (checkInTotalMinutes <= officeStartTime) return 'ON_TIME';
  return 'EARLY';
}

// Check if checkout before 5:00 PM (half day)
export function isHalfDay(checkOutTime) {
  if (!checkOutTime) return false;
  
  const checkOutDate = new Date(checkOutTime);
  const checkOutHour = checkOutDate.getHours();
  const checkOutMinute = checkOutDate.getMinutes();
  const checkOutTotalMinutes = checkOutHour * 60 + checkOutMinute;
  
  const halfDayThreshold = 17 * 60; // 5:00 PM
  
  return checkOutTotalMinutes < halfDayThreshold;
}