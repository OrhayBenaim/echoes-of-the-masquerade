const AlphaBet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
import { faker } from "@faker-js/faker";

export const randomRoomId = () => {
  return new Array(4)
    .fill(0)
    .map(() => AlphaBet[Math.floor(Math.random() * AlphaBet.length)])
    .join("");
};

export const randomPlayer = () => {
  const name = faker.person.firstName();
  return {
    name: name,
    image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`,
  };
};
