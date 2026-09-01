const labVisualPairs = [
  ["orb-lime", "orb-violet"],
  ["orb-sky", "orb-coral"],
  ["orb-pink", "orb-cyan"],
  ["orb-orange", "orb-blue"],
  ["orb-teal", "orb-yellow"],
  ["orb-violet", "orb-orange"],
  ["orb-cyan", "orb-lime"],
  ["orb-coral", "orb-blue"],
  ["orb-yellow", "orb-pink"],
  ["orb-teal", "orb-violet"],
  ["orb-sky", "orb-lime"],
  ["orb-blue", "orb-pink"],
];

function hashString(value) {
  let hash = 0;

  for (const character of value) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }

  return hash >>> 0;
}

export function getLabVisualPair(slug) {
  return labVisualPairs[hashString(slug) % labVisualPairs.length];
}
