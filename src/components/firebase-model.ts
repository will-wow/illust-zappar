import { BaseComponent, component } from "aframe-typescript-class-components";
import { fetchArObject } from "../lib/ar-object";

export interface FirebaseModelComponentData {
  slug: string;
}

/** Load a model from a firebase slug. */
@component("firebase-model")
export class FirebaseModelComponent extends BaseComponent<FirebaseModelComponentData> {
  static schema = {
    slug: { type: "string" },
  };

  update(): void {
    if (this.data.slug) {
      this.loadArObject(this.data.slug);
    }
  }

  async loadArObject(slug: string): Promise<void> {
    const arObject = await fetchArObject(slug);

    if (!arObject) return;

    this.el.setAttribute("gltf-model", `url(${arObject.modelPath})`);
    this.el.setAttribute("scale", arObject.scale);
    this.el.setAttribute("rotation", arObject.rotation);
    this.el.setAttribute("animation-mixer", true);

    if (arObject.cubeMap) {
      this.el.setAttribute("cube-env-map", {
        path: arObject.cubeMap.directory,
        extension: arObject.cubeMap.extension,
        reflectivity: "0.5",
      });
    }
  }
}
