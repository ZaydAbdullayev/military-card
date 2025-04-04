import { ranks } from "./datas";

export const generateRandomID = () => {
    return "MIL-" + Math.floor(100000 + Math.random() * 900000); // MIL-843271
};

export const getRandomRank = () => {
    const randomIndex = Math.floor(Math.random() * ranks.length);
    return ranks[randomIndex];
};
