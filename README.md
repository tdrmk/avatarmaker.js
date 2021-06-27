# Avatar Maker

Generate random avatar images (in SVG format).

Inspired from [Free Avatar Maker](https://avatarmaker.com/).

## Installation

```bash
# Using yarn
yarn add @tdrmk/avatarmaker

# Using npm
npm install @tdrmk/avatarmaker
```

## Usage

Generate a random image (gender chosen at random).

```js
const { generateAvatar } = require("@tdrmk/avatarmaker");

// generate a random avatar
const { svg } = generateAvatar();

// logs the svg image
console.log(svg);
```

Generate a random image with specified gender (`male` or `female`).

```js
const { generateAvatar } = require("@tdrmk/avatarmaker");

// generate a random male avatar
const { svg } = generateAvatar({ gender: "male" });

// logs the svg image
console.log(svg);
```

Obtain features from generated image

```js
const { generateAvatar } = require("@tdrmk/avatarmaker");

// generate a random avatar
const { svg, chosen_zones } = generateAvatar();

// logs the chosen features
console.log(chosen_zones);

// logs the svg image
console.log(svg);
```

Generate an image with specified features

```js
const { generateAvatar } = require("@tdrmk/avatarmaker");

const chosen_zones = {
  backs: 7,
  clothes: 1,
  ears: 3,
  faceshape: 9,
  mouth: 14,
  eyesiris: 5,
  eyesfront: 8,
  eyebrows: 3,
  nose: 1,
};

// generate a random avatar
const { svg } = generateAvatar({ gender: "male", chosen_zones });

// logs the svg image
console.log(svg);
```

All available features

```js
const chosen_zones = {
  backs: 1,
  hairback: 13,
  humanbody: 0,
  chinshadow: 5,
  clothes: 11,
  ears: 6,
  faceshape: 11,
  mouth: 13,
  eyesback: 2,
  eyesiris: 7,
  eyesfront: 0,
  facehighlight: 0,
  eyebrows: 10,
  nose: 2,
  beard: 8,
  mustache: 11,
  hairfront: 13,
  glasses: 2,
};
```

### Generating random avatar images

```bash

npx avatarmake > output.svg

```

## Sample images

Some randomly generated images

![Sample male 1](./sample/male_1.svg)
![Sample male 2](./sample/male_2.svg)
![Sample male 3](./sample/male_3.svg)
![Sample male 4](./sample/male_4.svg)
![Sample male 5](./sample/male_5.svg)
![Sample male 6](./sample/male_6.svg)
![Sample male 7](./sample/male_7.svg)
![Sample male 8](./sample/male_8.svg)
![Sample male 9](./sample/male_9.svg)
![Sample male 10](./sample/male_10.svg)

![Sample female 1](./sample/female_1.svg)
![Sample female 2](./sample/female_2.svg)
![Sample female 3](./sample/female_3.svg)
![Sample female 4](./sample/female_4.svg)
![Sample female 5](./sample/female_5.svg)
![Sample female 6](./sample/female_6.svg)
![Sample female 7](./sample/female_7.svg)
![Sample female 8](./sample/female_8.svg)
![Sample female 9](./sample/female_9.svg)
![Sample female 10](./sample/female_10.svg)
