// - ----- UI THINGS-----
let imgElem = document.getElementById("img");
let mapElem = document.getElementById("map");
let timeElem = document.getElementById("time");

// MAP THINGS
var map = L.map("map").setView([38.9874, -76.9421], 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const maphover = () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 330);
};
const mapclick = (e) => {
  L.marker(e.latlng).addTo(map);
  console.warn(id);
  fetch("/submit", {
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
    .then((res) => res.json())
    .then((data) => {
      L.marker(data.coords).addTo(map);
      L.polyline([data.coords, e.latlng]).addTo(map);
      timeElem.innerHTML = `Score: ${data.score}`;
      map.off("click", mapclick);
      // mangle the map
      mapElem.removeEventListener("mouseenter", maphover);
      mapElem.classList.add("w-[calc(100%-4rem)]");
      mapElem.classList.add("h-[calc(100%-8rem)]");
      mapElem.classList.remove("hover:h-[calc(100%-8rem)]");
      mapElem.classList.remove("hover:scale-100", "hover:opacity-100");
      mapElem.classList.add("scale-100");
      mapElem.classList.add("invert", "brightness-110", "contrast-110");

      timeElem.classList.remove("bg-neutral-700/50");
      timeElem.classList.add(
        "bg-black/50",
        "text-transparent",
        "bg-clip-text",
        "bg-gradient-to-r",
        "from-fuchsia-400",
        "via-blue-400",
        "to-emerald-400",
        "shadow-[-1rem_0_3rem_-0.5rem_#f8f8,1rem_0_3rem_-0.5rem_#8f88]"
      );

      setTimeout(() => {
        map.invalidateSize();
      }, 330);

      imgElem.classList.add("hidden");
    })
    .catch((err) => {
      console.error(err);
      document.getElementById(
        "time"
      ).innerHTML = `UH OH! There's been a server error!`;
    });
};
map.on("click", mapclick);
mapElem.addEventListener("mouseenter", maphover);

//- -----GAME COUNTDOWN-----
// - set a timer countdown from 2 minutes (minutes:seconds)
let timerInterval = setInterval(() => {
  countdown--;
  let minutes = Math.floor(countdown / 60);
  let seconds = countdown % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timeElem.innerHTML = `${minutes}:${seconds}`;
  if (countdown === 0) {
    clearInterval(timerInterval);
    timeElem.innerHTML = "Time's up!";
    //- submit failure form
    document.getElementById("failure").submit();
  }
}, 1000);

//- on press and hold of the #img element, hide the map and time
document.getElementById("img") &&
  (document.getElementById("img").addEventListener("mousedown", () => {
    mapElem.classList.add("hidden");
    timeElem.classList.add("hidden");
  }),
  document.getElementById("img").addEventListener("mouseup", () => {
    mapElem.classList.remove("hidden");
    timeElem.classList.remove("hidden");
  }));
//- if mouse moved out of the window, show the map and time
document.addEventListener("mouseout", (e) => {
  if (e.relatedTarget === null) {
    mapElem.classList.remove("hidden");
    timeElem.classList.remove("hidden");
  }
});
//- on press and hold of the 'h' key, hide the map and time
document.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    mapElem.classList.add("hidden");
    timeElem.classList.add("hidden");
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key === "h") {
    mapElem.classList.remove("hidden");
    timeElem.classList.remove("hidden");
  }
});
