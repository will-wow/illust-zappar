import {
  BaseComponent,
  component,
  bind,
} from "aframe-typescript-class-components";

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

  $instantGroup = document.querySelector("#instant-group");

  $placementUi = document.querySelector("#zappar-placement-ui");

  init(): void {
    this.$placementUi.addEventListener("click", this.setPlacement);
  }

  update(): void {
    if (this.data.slug) {
      this.loadArObject(this.data.slug);
    } else {
      this.clearModel();
    }
  }

  async loadArObject(slug: string): Promise<void> {
    const arObject = await fetchArObject(slug);

    if (!arObject) return;

    const model = document.createElement("a-entity");

    model.setAttribute("gltf-model", `url(${arObject.modelPath})`);
    model.setAttribute("scale", arObject.scale);
    model.setAttribute("rotation", arObject.rotation);
    model.setAttribute("animation-mixer", true);

    if (arObject.cubeMap) {
      model.setAttribute("cube-env-map", {
        path: arObject.cubeMap.directory,
        extension: arObject.cubeMap.extension,
        reflectivity: "0.5",
      });
    }

    this.removeOldModel();
    // Add the new one.
    this.el.append(model);

    const onModelLoaded = () => {
      model.removeEventListener("model-loaded", onModelLoaded);
      this.startPlacement();
    };

    this.hidePlacement();
    model.addEventListener("model-loaded", onModelLoaded);
  }

  startPlacement(): void {
    this.$instantGroup.setAttribute("zappar-instant", "placement-mode: true;");
    this.showPlacement();
  }

  @bind
  setPlacement(): void {
    this.$instantGroup.setAttribute("zappar-instant", "placement-mode: false;");
    this.hidePlacement();
  }

  showPlacement(): void {
    this.$placementUi.style.display = "block";
  }

  hidePlacement(): void {
    this.$placementUi.style.display = "none";
  }

  clearModel(): void {
    this.removeOldModel();
    // Don't show the placement picker.
    this.setPlacement();
  }

  removeOldModel(): void {
    // Remove the old model
    const oldModel = this.el.firstChild as Node;
    if (oldModel) {
      this.el.removeChild(oldModel);
    }
  }
}
