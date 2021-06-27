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

export default function generateAvatar(options?: {
  gender?: Gender;
  chosen_zones?: ChosenZones;
}): string;
