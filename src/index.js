const xml = require("xml");

const maleData = require("./male.json");
const femaleData = require("./female.json");

function generateAvatar({ gender = "male", chosen_zones = null } = {}) {
  const data = gender === "female" ? femaleData : maleData;

  const paths = [];
  const defs = [];

  chosen_zones =
    chosen_zones && typeof chosen_zones === "object" ? chosen_zones : {};

  // make random choices for each of the component, if not specified
  Object.entries(data.elements).forEach(([zone, pathChoices]) => {
    // hairfront and hairback needs to use same index
    if (/^hair/.test(zone)) chosen_zones[zone] = chosen_zones["hairback"];

    if (!Number.isInteger(chosen_zones[zone]))
      chosen_zones[zone] = choice(pathChoices.length);
    // make sure its within bounds
    else chosen_zones[zone] = chosen_zones[zone] % pathChoices.length;
  });

  const gradientsUsed = [];
  // populate chosen paths
  Object.entries(data.elements).forEach(([zone, pathChoices]) => {
    const i = chosen_zones[zone];
    pathChoices[i].forEach((path) => {
      if (/url\(#.*\)/.test(path.fill))
        // keep track of used gradients
        gradientsUsed.push(path.fill.match(/url\(#(.*)\)/)[1]);

      paths.push({
        path: {
          _attr: path,
        },
      });
    });
  });

  // populate used gradients
  Object.entries(data.gradients)
    .filter(([id]) => gradientsUsed.includes(id))
    .forEach(([id, gradient]) => {
      defs.push({
        [gradient.type === "linear" ? "linearGradient" : "radialGradient"]: [
          {
            _attr: { id, ...gradient.props },
          },
          ...gradient.stops.map((stop) => ({
            stop: {
              _attr: {
                offset: stop.offset,
                "stop-color": stop.color,
                "stop-opacity": stop.opacity,
              },
            },
          })),
        ],
      });
    });

  const svg = xml({
    svg: [
      {
        _attr: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 200 200",
          width: "200",
          height: "200",
        },
      },
      { defs },
      ...paths,
    ],
  });

  return { svg, chosen_zones };
}

function choice(max) {
  return Math.floor(Math.random() * max);
}

module.exports = { generateAvatar };
