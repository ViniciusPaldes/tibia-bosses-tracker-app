// data/seed.ts
export const BOSSES = [
  {
    id: "orshabaal",
    name: "Orshabaal",
    location: "Edron — Dragon Lair",
    baseChance: 72,
  },
  {
    id: "morgaroth",
    name: "Morgaroth",
    location: "Plains of Havoc",
    baseChance: 38,
  },
  {
    id: "ghazbaran",
    name: "Ghazbaran",
    location: "Kazordoon Mines",
    baseChance: 21,
  },
  {
    id: "ferumbras",
    name: "Ferumbras",
    location: "Ferumbras’ Citadel",
    baseChance: 12,
  },
];

function minsAgo(n) {
  return new Date(Date.now() - n * 60 * 1000);
}
function hoursAgo(n) {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}
function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

export const SIGHTINGS = [
  { id: "s1", bossId: "orshabaal", at: minsAgo(2), player: "Vinicius", status: "watched", world: "Venebra" },
  { id: "s2", bossId: "morgaroth", at: minsAgo(17), player: "Ana", status: "killed", world: "Venebra" },
  { id: "s3", bossId: "ghazbaran", at: hoursAgo(2), player: "Bruno", status: "watched", world: "Venebra" },
  { id: "s4", bossId: "ferumbras", at: hoursAgo(5), player: "Clara", status: "killed", world: "Venebra" },
  { id: "s5", bossId: "orshabaal", at: daysAgo(1), player: "Diego", status: "killed", world: "Venebra" },
  { id: "s6", bossId: "morgaroth", at: daysAgo(2), player: "Erika", status: "watched", world: "Venebra" },
];