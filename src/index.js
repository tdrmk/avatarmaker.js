const maleData = require("./male.json");
const femaleData = require("./female.json");

const genders = ["male", "female"];

/**
 * Generates an avatar and returns an SVG image.
 * features are chosen at random if `chosen_zones` is not specified.
 * @param {Object} options
 * @param {Gender} options.gender - generate avatar with specified gender, else chosen at random
 * @param {ChosenZones} options.chosen_zones - generate avatar with specified features, rest are chosen at random
 * @param {Object} options
 *
 * @returns {string}
 */
function generateAvatar({ gender = null, chosen_zones = null } = {}) {
  if (!genders.includes(gender)) {
    // randomly choose a gender if none is specified..
    gender = genders[Math.floor(Math.random() * 2)];
  }

  const data = gender === "male" ? maleData : femaleData;

  const paths = [];
  const gradients = [];

  chosen_zones =
    chosen_zones && typeof chosen_zones === "object" ? chosen_zones : {};

  // make random choices for each of the component, if not specified
  Object.entries(data.elements).forEach(([zone, pathChoices]) => {
    // hairfront and hairback needs to use same index
    if (/^hair/.test(zone)) chosen_zones[zone] = chosen_zones["hairback"];
    if (["eyesback", "eyesfront"].includes(zone))
      chosen_zones[zone] = chosen_zones["eyesback"];

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

      paths.push(`<path ${stringifyAttributes(path)}/>`);
    });
  });

  // populate used gradients
  Object.entries(data.gradients)
    .filter(([id]) => gradientsUsed.includes(id))
    .forEach(([id, gradient]) => {
      const stops = gradient.stops
        .map((props) => `<stop ${stringifyAttributes(props)}/>`)
        .join("");
      const gradientTag =
        gradient.type === "linear" ? "linearGradient" : "radialGradient";
      const gradientAttrs = stringifyAttributes({ id, ...gradient.props });
      gradients.push(
        `<${gradientTag} ${gradientAttrs}>${stops}</${gradientTag}>`
      );
    });

  svgAttrs = stringifyAttributes({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 200 200",
    width: "200",
    height: "200",
  });

  const defs = `<defs>${gradients.join("")}</defs>`;
  const svg = `<svg ${svgAttrs}>${defs}${paths.join("")}</svg>`;
  return { svg, chosen_zones };
}

function choice(max) {
  return Math.floor(Math.random() * max);
}

function stringifyAttributes(props) {
  return Object.entries(props)
    .map(([key, value]) => `${key}='${value}'`)
    .join(" ");
}

module.exports = { generateAvatar };
