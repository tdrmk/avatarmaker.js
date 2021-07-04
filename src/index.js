const maleData = require("./male.json");
const femaleData = require("./female.json");

const genders = ["male", "female"];

function generateAvatar({
  gender = null,
  chosen_zones = null,
  avatarId = null,
} = {}) {
  if (typeof avatarId === "string") {
    try {
      // incase avatar id is specified, decode the gender and chosen_zones from id.
      const { gender: _g, chosen_zones: _cz } = fromAvatarId(avatarId);
      gender = _g;
      chosen_zones = _cz;
    } catch (err) {}
  }

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

  const svgAttrs = stringifyAttributes({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 200 200",
    width: "200",
    height: "200",
  });

  const defs = `<defs>${gradients.join("")}</defs>`;
  const svg = `<svg ${svgAttrs}>${defs}${paths.join("")}</svg>`;

  avatarId = toAvatarId(chosen_zones, gender);
  return { svg, gender, chosen_zones, avatarId };
}

function choice(max) {
  return Math.floor(Math.random() * max);
}

function stringifyAttributes(props) {
  return Object.entries(props)
    .map(([key, value]) => `${key}='${value}'`)
    .join(" ");
}

// generate an unique identifier for each avatar
// (identified by fully populated chosen_zones)
function toAvatarId(chosen_zones, gender) {
  const data = gender === "male" ? maleData : femaleData;

  const availableChoices = Object.fromEntries(
    Object.entries(data.elements).map(([zone, pathChoices]) => {
      return [zone, BigInt(pathChoices.length)];
    })
  );
  // encode chosen_zones
  let id = Object.keys(availableChoices).reduce((acc, zone) => {
    return acc * availableChoices[zone] + BigInt(chosen_zones[zone]);
  }, 0n);

  // encode gender
  id = id * 2n + (gender === "male" ? 0n : 1n);

  // return as string
  return id.toString();
}

// generate a fully populated chosen_zones object
// from the specified unique identifier
function fromAvatarId(id) {
  id = BigInt(id);
  let gender;

  // decode gender
  if (id % 2n === 1n) {
    gender = "female";
    id = (id - 1n) / 2n;
  } else {
    gender = "male";
    id = id / 2n;
  }

  const data = gender === "male" ? maleData : femaleData;
  const availableChoices = Object.fromEntries(
    Object.entries(data.elements).map(([zone, pathChoices]) => {
      return [zone, BigInt(pathChoices.length)];
    })
  );

  // decode chosen_zones
  const chosen_zones = {};
  Object.keys(availableChoices)
    .reverse()
    .reduce((currID, zone) => {
      chosen_zones[zone] = Number(currID % availableChoices[zone]);
      return (currID - BigInt(chosen_zones[zone])) / availableChoices[zone];
    }, id);

  return { chosen_zones, gender };
}

// returns make possible value for each zone
function chosenZonesLimit(gender) {
  const data = gender === "male" ? maleData : femaleData;
  return Object.fromEntries(
    Object.entries(data.elements).map(([zone, pathChoices]) => {
      return [zone, pathChoices.length];
    })
  );
}

module.exports = { generateAvatar, chosenZonesLimit };
