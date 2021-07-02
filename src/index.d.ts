type ChosenZones = {
  backs?: number;
  hairback?: number;
  humanbody?: number;
  chinshadow?: number;
  clothes?: number;
  ears?: number;
  faceshape?: number;
  mouth?: number;
  eyesback?: number;
  eyesiris?: number;
  eyesfront?: number;
  facehighlight?: number;
  eyebrows?: number;
  nose?: number;
  beard?: number;
  mustache?: number;
  hairfront?: number;
  glasses?: number;
};

type Gender = "male" | "female";

/**
 * Generates an avatar and returns an SVG image.
 * features are chosen at random if `chosen_zones` is not specified.
 * @param {Object} options
 * @param {Gender} options.gender - generate avatar with specified gender, else chosen at random
 * @param {ChosenZones} options.chosen_zones - generate avatar with specified features, rest are chosen at random
 * @param {Object} options
 *
 * @returns {Object} output
 * @returns {string} output.svg - generated svg in string
 * @returns {Gender} output.gender
 * @returns {ChosenZones} output.chosen_zones
 */
export function generateAvatar(options?: {
  gender?: Gender;
  chosen_zones?: ChosenZones;
}): { svg: string; chosen_zones: ChosenZones; gender: Gender };
