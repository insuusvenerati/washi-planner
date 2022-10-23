import fs from "fs";

export const getStickers = () => {
  return fs.readdirSync(`${__dirname}/../app/assets/stickers/`);
};
