import { db } from "./firestore";

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface AnimatedMaterialColorAddon {
  attributes: {
    materials: string;
    colors: string;
    timing: number;
  };
}

export interface CubeEnvMapAddon {
  directory: string;
  extension: string;
  reflectivity: number;
}

export interface ShinyConfig {
  metalness: number;
  roughness: number;
}

export type ShinyData = Record<string, ShinyConfig>;

export interface ShinyAddon {
  data: ShinyData;
}

export interface ArObject {
  id: string;
  slug: string;
  name: string;
  modelPath: string;
  modelThumbnail: string;
  iosPath?: string;
  locationSlug: string;
  placeName: string;
  coordinates: Coordinates;
  position: string;
  rotation: string;
  scale: string;
  // Components
  animatedMaterialColor?: AnimatedMaterialColorAddon;
  cubeMap?: CubeEnvMapAddon;
  shiny?: ShinyAddon;
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
