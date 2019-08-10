(function() {
  console.log("started");
  let pinLocations = [];
  fetch("data.json")
    .then(response => response.json())
    .then(parsed => {
      pinLocations = parsed;
      slide1();
    });
  const kaart = document.querySelector(".map");
  const pinsLayer = kaart.querySelector(".pinsLayer");
  const cityLayer = kaart.querySelector(".cityLayer");
  const infoLayer = kaart.querySelector(".infoLayer");
  const pin = document.querySelector(".pin");
  let slideIndex = 0;

  function addPin(loc, id = 0, delay = 50) {
    const { coords } = loc;
    let node = pin.cloneNode(true);
    const css = `
          position:absolute;
          left: ${coords.x}px;
          top: ${coords.y}px;
          animation-delay: ${id * delay + 200}ms;
          `;
    node.style.cssText = css;
    pinsLayer.appendChild(node);
  }

  function addCityBox(loc, id = 0, delay = 100) {
    const { city, coords, left } = loc;
    let node = document.createElement("div");
    node.classList.add("city");
    left && node.classList.add("left");
    node.textContent = city;
    const css = `
              position:absolute;
              left: ${coords.x}px;
              top: ${coords.y}px;
              animation-delay: ${id * delay + 200}ms;
            `;
    node.style.cssText = css;
    cityLayer.appendChild(node);
  }

  function addInfoBox(loc, id = 0, delay = 100) {
    const { title, info } = loc;
    let node = document.createElement("div");
    node.classList.add("info");
    title.left && node.classList.add("left");
    node.innerHTML = `
          <h3>Perfomance</h3>
          <table>
              <tr>
                  <td>Visitors last week</td>
                  <td><strong>${info.lastWeek.total}</strong> <span class="${
      info.lastWeek.gain >= 0 ? "pos" : "neg"
    }">(${info.lastWeek.gain >= 0 ? "+" : ""}${info.lastWeek.gain}%)</span></td>
              </tr>
              <tr>
                  <td>Wait time</td>
                  <td><strong>${info.waitTime.time}min</strong> <span class="${
      info.waitTime.gain < 0 ? "pos" : "neg"
    }">(${info.waitTime.gain >= 0 ? "+" : ""}${info.waitTime.gain}%)</span></td>
              </tr>
              <tr>
                  <td>Service time</td>
                  <td><strong>${
                    info.serviceTime.time
                  }min</strong> <span class="${
      info.serviceTime.gain < 0 ? "pos" : "neg"
    }">(${info.serviceTime.gain >= 0 ? "+" : ""}${
      info.serviceTime.gain
    }%)</span></td>
              </tr>
          </table>
          `;
    const css = `
              position:absolute;
              left: ${title.coords.x}px;
              top: ${title.coords.y}px;
              animation-delay: ${id * delay + 200}ms;
            `;
    node.style.cssText = css;
    infoLayer.appendChild(node);
  }

  function nextSlide() {
    slideIndex >= 2 ? (slideIndex = 0) : slideIndex++;
    switch (slideIndex) {
      case 1:
        slide2();
        break;
      case 2:
        cityLayer.innerHTML = "";
        slide3();
        break;
      default:
        infoLayer.innerHTML = "";
        cityLayer.innerHTML = "";
        pinsLayer.innerHTML = "";
        slide1();
        return;
    }
  }

  function slide1() {
    pinLocations.forEach(loc => {
      addPin(loc, loc.id);
    });
  }

  function slide2(e) {
    const cityNames = pinLocations.filter(pin => pin.title);
    cityNames.forEach((pin, idx) => {
      addCityBox(pin.title, idx);
    });
  }

  function slide3(e) {
    const cityNames = pinLocations.filter(pin => pin.info);
    cityNames.forEach((loc, idx) => {
      addCityBox(loc.title);
      addInfoBox(loc, idx);
    });
  }

  setInterval(function() {
    nextSlide();
  }, 5000);
})();
