//- -----UI THINGS-----
document.getElementById("map").addEventListener("mouseenter", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 330);
});
//- on press and hold of the #img element, hide the map and time
document.getElementById("img") &&
  (document.getElementById("img").addEventListener("mousedown", () => {
    document.getElementById("map").classList.add("hidden");
    document.getElementById("time").classList.add("hidden");
  }),
  document.getElementById("img").addEventListener("mouseup", () => {
    document.getElementById("map").classList.remove("hidden");
    document.getElementById("time").classList.remove("hidden");
  }));
//- if mouse moved out of the window, show the map and time
document.addEventListener("mouseout", (e) => {
  if (e.relatedTarget === null) {
    document.getElementById("map").classList.remove("hidden");
    document.getElementById("time").classList.remove("hidden");
  }
});
//- on press and hold of the 'h' key, hide the map and time
document.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    document.getElementById("map").classList.add("hidden");
    document.getElementById("time").classList.add("hidden");
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key === "h") {
    document.getElementById("map").classList.remove("hidden");
    document.getElementById("time").classList.remove("hidden");
  }
});
//- -----GAME COUNTDOWN-----
var map = L.map("map").setView([38.9874, -76.9421], 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let cords = { lat: 38.9891263587382, lng: -76.93646009768167 };
//- if ()
map.on("click", (e) => {
  L.marker(e.latlng).addTo(map);
  L.marker(cords).addTo(map);
  L.polyline([cords, e.latlng]).addTo(map);
  console.warn(id);
  fetch("/success", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      id: id,
    }),
  })
    .then(async (res) => await res.json())
    .then(console.log);
});
//- let result = !{result.toString()}
//- TODO: fix this
//- let point = JSON.parse(!{point})
//- console.log(point)
//- let coords = JSON.parse(!{coords})
//- console.log(coords)

//- if (result === 'success' && point && coords) {
//-   console.log(point);
//-   console.log(coords);
//-   L.marker(coords).addTo(map)
//-   L.marker(point).addTo(map)
//-   L.polyline([coords, point]).addTo(map)
//- }

//- set a timer countdown from 2 minutes (minutes:seconds)
let countdown = 120;
let timer = setInterval(() => {
  countdown--;
  let minutes = Math.floor(countdown / 60);
  let seconds = countdown % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  document.getElementById("time").innerHTML = `${minutes}:${seconds}`;
  if (countdown === 0) {
    clearInterval(timer);
    document.getElementById("time").innerHTML = "Time's up!";
    //- submit failure form
    document.getElementById("failure").submit();
  }
}, 1000);
