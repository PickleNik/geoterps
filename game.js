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
      // mangle the map
      map.off("click", mapclick);
      mapElem.removeEventListener("mouseenter", maphover);
      mapElem.classList.add(
        "transition-all",
        "duration-500",
        "w-full",
        "h-full",
        "bottom-0",
        "right-0",
        "rounded-none",
        "scale-100",
        "invert",
        "brightness-110",
        "contrast-110"
      );
      mapElem.classList.remove(
        "hover:h-[calc(100%-8rem)]",
        "hover:scale-100",
        "hover:opacity-100"
      );
      setTimeout(() => {
        map.invalidateSize();
      }, 330);

      // mangle the time
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
      clearInterval(timerInterval);

      let score = document.createElement("h1");
      score.innerHTML = data.score;
      score.classList.add(
        "absolute",
        "top-1/2",
        "left-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "text-9xl",
        "font-bold",
        "text-transparent",
        "bg-clip-text",
        "italic",
        "bg-gradient-to-r",
        "from-fuchsia-400",
        "via-blue-400",
        "to-emerald-400"
      );
      // text shadow
      score.style.textShadow = `
        -1rem 0 3rem -0.5rem #f8f8,
        1rem 0 3rem -0.5rem #8f88
      `;
      document.documentElement.appendChild(score);

      let playAgain = document.createElement("a");
      playAgain.href = "/";
      playAgain.innerHTML = "Play again";
      playAgain.classList.add(
        "absolute",
        "bottom-8",
        "py-2",
        "px-4",
        "left-1/2",
        "-translate-x-1/2",
        "hover:scale-125",
        "duration-300",
        "hover:-translate-y-2",
        "mx-auto",
        "rounded-full",
        "text-center",
        "text-2xl",
        "font-bold",
        "text-white",
        "bg-gradient-to-r",
        "from-fuchsia-400",
        "via-blue-400",
        "to-emerald-400",
        "shadow-[-1rem_0_3rem_-0.5rem_#f8f8,1rem_0_3rem_-0.5rem_#8f88]"
      );
      document.documentElement.appendChild(playAgain);

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
// TODO: end game // call /success with fake coords and finish the game
// - set a timer countdown from 2 minutes (minutes:seconds)
let timerInterval = setInterval(() => {
  countdown--;
  let minutes = Math.floor(countdown / 60);
  let seconds = countdown % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  // if below 10 seconds, make the time red
  if (countdown < 10) {
    timeElem.classList.add("scale-125");
  }
  // if below 30 seconds, make the time yellow
  if (countdown < 30) {
    timeElem.classList.add("text-orange-500", "animate-pulse");
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
