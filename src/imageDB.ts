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

const imageDB = openDB<ImageDB>("image-db", 1, {
  upgrade(database) {
    database.createObjectStore("images");
  },
});

export const getImageFromDB = async (id: Image["id"]) => {
  return (await imageDB).get("images", id);
};

export const storeImageToDB = async (image: Image) => {
  return (await imageDB).put("images", image.content, image.id);
};
