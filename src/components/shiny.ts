import { BaseComponent, component } from "aframe-typescript-class-components";
import { Object3D } from "three";

interface MaterialNode extends Object3D {
  material?: {
    name: string;
    metalness: number;
    roughness: number;
  };
}

type Shiny = Record<string, { metalness: number; roughness: number }>;

interface ShinyComponentData {
  materials: Shiny;
}

/**  Shows a Vignette when the Nft marker is detected. */
@component("shiny")
export class ShinyComponent extends BaseComponent<ShinyComponentData> {
  static schema = {
    materials: {
      default: {},
      parse(value: string): Shiny {
        return JSON.parse(value);
      },
      stringify(value: Shiny): string {
        return JSON.stringify(value);
      },
    },
  };
  events = {
    "model-loaded"(this: ShinyComponent): void {
      // grab the mesh
      const mesh = this.el.getObject3D("mesh");

      mesh.traverse((node) => {
        const materialNode = node as MaterialNode;

        // ignore nodes without materials
        if (!materialNode.material) return;

        const config =
          this.data.materials[materialNode.material.name] ||
          this.data.materials._all;

        if (config) {
          // assign the values.
          materialNode.material.metalness = config.metalness;
          materialNode.material.roughness = config.roughness;
        }
      });
    },
  };
}
