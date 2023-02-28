import { DBSchema, openDB } from "idb";

export type Image = {
  id: string; //URL for online images, File name for offline images
  content: string;
};

interface ImageDB extends DBSchema {
  images: {
    key: Image["id"];
    value: Image["content"];
  };
}

const imageDB = () =>
  openDB<ImageDB>("image-db", 1, {
    upgrade(database) {
      database.createObjectStore("images");
    },
  });

export const getImageFromDB = async (id: Image["id"]) => {
  return (await imageDB()).get("images", id);
};

export const getImageEntriesFromDB = async (ids: Image["id"][]) => {
  const db = await imageDB();
  return await Promise.all(
    ids.map(async (key) => {
      const image = await db.get("images", key);
      return [key, image] as const;
    })
  );
};

export const storeImageToDB = async (image: Image) => {
  if (image.content.indexOf("data:image") === -1)
    throw new Error("Content is not an image");
  return (await imageDB()).put("images", image.content, image.id);
};
