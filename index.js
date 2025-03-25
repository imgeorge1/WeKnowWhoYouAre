let latDMS
let lonDMS
let openingURL

fetch("http://ip-api.com/json/")
  .then(response => response.json())
  .then(data => {
    document.getElementById("userIP").innerHTML = "You live in: " + data.country + ", " + data.regionName;
    // console.log("IP Information:", data);
  })
  .catch(error => console.error("Error fetching IP geolocation:", error));

const browserInfo = {
  userAgent: navigator.userAgent, // User agent string
  platform: navigator.platform,   // Platform (e.g., "Win32" for Windows, "MacIntel" for macOS)
  language: navigator.language,   // Language set in the browser (e.g., "en-US")
  appName: navigator.appName,     // Browser's name (usually "Netscape")
  appVersion: navigator.appVersion, // Browser's version
  cookiesEnabled: navigator.cookieEnabled, // Whether cookies are enabled
  online: navigator.onLine,       // Whether the user is online
  geolocation: !!navigator.geolocation, // Whether geolocation is supported
  vendor: navigator.vendor,       // Browser vendor (e.g., "Google Inc." for Chrome)
  deviceMemory: navigator.deviceMemory, // Amount of device memory in GB (if available)
  hardwareConcurrency: navigator.hardwareConcurrency // Number of CPU cores
};

// Collecting screen information
const screenInfo = {
  width: screen.width,          // Screen width
  height: screen.height,        // Screen height
  availWidth: screen.availWidth, // Available screen width (excluding taskbars, dock)
  availHeight: screen.availHeight, // Available screen height
  colorDepth: screen.colorDepth, // Color depth
  pixelDepth: screen.pixelDepth  // Pixel depth (bits per pixel)
};

// Detecting if the device is mobile
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Collecting device-specific information (if available)
const deviceInfo = {
  isMobile: isMobile,
  screenOrientation: screen.orientation ? screen.orientation.type : 'N/A', // Screen orientation
  touchSupport: 'ontouchstart' in window, // Whether touch events are supported
  mediaQuery: window.matchMedia && window.matchMedia('(max-width: 768px)').matches // Check for mobile layout
};

// Log all collected information
console.log("Browser Info:", browserInfo);
console.log("Screen Info:", screenInfo);
console.log("Device Info:", deviceInfo);

// You can also log user device info as a structured JSON object
const fullDeviceInfo = {
  browserInfo: browserInfo,
  screenInfo: screenInfo,
  deviceInfo: deviceInfo
};

// console.log("Full Device Info (Structured):", JSON.stringify(fullDeviceInfo, null, 2));

// Update the userDevice element with all the collected device information
let deviceDetails = `
  <b>Device Information:</b><br/>
  <b>Mobile Device:</b> ${deviceInfo.isMobile ? "Yes" : "No"}<br/>
  <b>Screen Orientation:</b> ${deviceInfo.screenOrientation}<br/>
  <b>Touch Support:</b> ${deviceInfo.touchSupport ? "Yes" : "No"}<br/>
  <b>Mobile Layout:</b> ${deviceInfo.mediaQuery ? "Yes" : "No"}<br/><br/>

  <b>Browser Information:</b><br/>
  <b>User Agent:</b> ${browserInfo.userAgent}<br/>
  <b>Platform:</b> ${browserInfo.platform}<br/>
  <b>Language:</b> ${browserInfo.language}<br/>
  <b>App Name:</b> ${browserInfo.appName}<br/>
  <b>App Version:</b> ${browserInfo.appVersion}<br/>
  <b>Cookies Enabled:</b> ${browserInfo.cookiesEnabled ? "Yes" : "No"}<br/>
  <b>Online Status:</b> ${browserInfo.online ? "Online" : "Offline"}<br/>
  <b>Geolocation Support:</b> ${browserInfo.geolocation ? "Yes" : "No"}<br/>
  <b>Vendor:</b> ${browserInfo.vendor}<br/>
  <b>Avaliable Device Memory:</b> ${browserInfo.deviceMemory ? browserInfo.deviceMemory + " GB" : "N/A"}<br/>
  <b>Hardware Concurrency (CPU cores):</b> ${browserInfo.hardwareConcurrency}<br/><br/>

  <b>Screen Information:</b><br/>
  <b>Screen Width:</b> ${screenInfo.width}px<br/>
  <b>Screen Height:</b> ${screenInfo.height}px<br/>
  <b>Available Screen Width:</b> ${screenInfo.availWidth}px<br/>
  <b>Available Screen Height:</b> ${screenInfo.availHeight}px<br/>
  <b>Color Depth:</b> ${screenInfo.colorDepth} bits<br/>
  <b>Pixel Depth:</b> ${screenInfo.pixelDepth} bits
`;


// Battery information
if (navigator.getBattery) {
  navigator.getBattery().then(function(battery) {
    const batteryInfo = `
      Battery Level: ${battery.level * 100}%<br>
      Charging: ${battery.charging ? "Yes" : "No"}<br>
      Time remaining: ${battery.charging ? battery.chargingTime : battery.dischargingTime} seconds
    `;
    document.getElementById("batteryInfo").innerHTML = "Battery Info:<br>" + batteryInfo;
  });
} else {
  document.getElementById("batteryInfo").innerHTML = "Battery information is not available.";
}

// Geolocation information
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude1 = position.coords.latitude;
    const longitude1 = position.coords.longitude;
    const locationInfo = `
      Your Location:<br>
      Latitude: ${latitude1}<br>
      Longitude: ${longitude1}
    `;
    document.getElementById("userLocation").innerHTML = locationInfo;
  });
} else {
  document.getElementById("userLocation").innerHTML = "Geolocation is not supported by this browser.";
}

// Function to convert decimal degrees to DMS format
function convertToDMS(deg, isLatitude) {
  const direction = isLatitude 
    ? (deg >= 0 ? "N" : "S")  // If latitude, N for positive, S for negative
    : (deg >= 0 ? "E" : "W"); // If longitude, E for positive, W for negative

  const absDeg = Math.abs(deg);
  const d = Math.floor(absDeg);
  const m = Math.floor((absDeg - d) * 60);
  const s = ((absDeg - d - m / 60) * 3600).toFixed(2);

  return `${d}°${m}'${s}"${direction}`;
}

// Get geolocation and display it in DMS format
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    latDMS = convertToDMS(lat, true);
    lonDMS = convertToDMS(lon, false);

    document.getElementById("userLocation").innerHTML = `
      Your Location:<br>
      Latitude: ${latDMS}<br>
      Longitude: ${lonDMS}
    `;

    console.log(`Latitude (DMS): ${latDMS}`);
    console.log(`Longitude (DMS): ${lonDMS}`);
    openingURL = `https://www.google.com/maps/place/${latDMS}+${lonDMS}/@${lat},${lon}`
    console.log(openingURL)

  });
} else {
  document.getElementById("userLocation").innerHTML = "Geolocation is not supported by this browser.";
}
document.getElementById("openMap").addEventListener("click", function () {
  window.open(openingURL, "_blank");
});


document.getElementById("userDevice").innerHTML = deviceDetails;
