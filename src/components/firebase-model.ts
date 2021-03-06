import { Entity } from "aframe";
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
    slug: { type: "string" as const },
    loadingMarker: { type: "selector" as const },
    placementMarker: { type: "selector" as const },
  };

  $instantGroup = document.querySelector("#instant-group");
  $placementUi = document.querySelector("#zappar-placement-ui");
  $loadingMarker = document.querySelector("#loading");
  $placementMarker = document.querySelector("#placement");

  $model?: Entity;

  init(): void {
    this.$placementUi.addEventListener("click", this.showModel);
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

    this.$model = document.createElement("a-entity");

    this.$model.setAttribute("gltf-model", `url(${arObject.modelPath})`);
    this.$model.setAttribute("scale", arObject.scale);
    this.$model.setAttribute("rotation", arObject.rotation);
    this.$model.setAttribute("animation-mixer", true);
    this.$model.object3D.visible = false;

    if (arObject.cubeMap) {
      this.$model.setAttribute("cube-env-map", {
        path: arObject.cubeMap.directory,
        extension: arObject.cubeMap.extension,
        reflectivity: "0.5",
      });
    }

    this.removeOldModel();
    // Add the new one.
    this.el.append(this.$model);

    const onModelLoaded = () => {
      this.$model?.removeEventListener("model-loaded", onModelLoaded);
      this.showPlacement();
    };

    this.showLoading();
    this.$model.addEventListener("model-loaded", onModelLoaded);
  }

  showLoading(): void {
    this.$instantGroup.setAttribute("zappar-instant", "placement-mode: true;");

    this.$placementUi.style.display = "none";
    this.$loadingMarker.object3D.visible = true;
    this.$placementMarker.object3D.visible = false;
    this.setModelVisibility(false);
  }

  showPlacement(): void {
    this.$instantGroup.setAttribute("zappar-instant", "placement-mode: true;");

    this.$placementUi.style.display = "block";
    this.$loadingMarker.object3D.visible = false;
    this.$placementMarker.object3D.visible = true;
    this.setModelVisibility(false);
  }

  @bind
  showModel(): void {
    this.$instantGroup.setAttribute("zappar-instant", "placement-mode: false;");

    this.$placementUi.style.display = "none";
    this.$loadingMarker.object3D.visible = false;
    this.$placementMarker.object3D.visible = false;
    this.setModelVisibility(true);
  }

  hideAll(): void {
    this.$placementUi.style.display = "none";
    this.$loadingMarker.object3D.visible = false;
    this.$placementMarker.object3D.visible = false;
    this.setModelVisibility(false);
  }

  setModelVisibility(visible: boolean): void {
    if (this.$model) {
      this.$model.object3D.visible = visible;
    }
  }

  clearModel(): void {
    this.removeOldModel();
    // Don't show the placement picker.
    this.hideAll();
  }

  removeOldModel(): void {
    // Remove the old model
    const oldModel = this.el.firstChild as Node;
    if (oldModel) {
      this.el.removeChild(oldModel);
    }
  }
}
