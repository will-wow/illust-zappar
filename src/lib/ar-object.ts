import { db } from "./firestore";

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface ArObject {
  id: string;
  slug: string;
  name: string;
  modelPath: string;
  iosPath?: string;
  locationSlug: string;
  placeName: string;
  coordinates: Coordinates;
  position: string;
  rotation: string;
  scale: string;
  cubeMap?: {
    directory: string;
    extension: string;
  };
}

export const fetchArObjectList = async (): Promise<ArObject[]> => {
  const arObjects = await db.collection("ar-objects").get();

  return arObjects.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as ArObject;
  });
};

export const fetchArObject = async (slug: string): Promise<ArObject | null> => {
  const query = await db
    .collection("ar-objects")
    .where("slug", "==", slug)
    .get();

  if (query.empty) {
    return null;
  }

  return query.docs[0].data() as ArObject;
};
