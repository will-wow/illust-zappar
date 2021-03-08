import { BaseComponent, component } from "aframe-typescript-class-components";
import { MeshBasicMaterial, Mesh } from "three";

interface AnimatedMaterialColorData {
  materials: string[];
  colors: string[];
  timing: number;
}

@component("animated-material-color")
export class AnimatedMaterialColorComponent extends BaseComponent<AnimatedMaterialColorData> {
  static schema = {
    materials: { type: "array", default: [] },
    colors: { type: "array", default: [] },
    timing: { type: "number", default: 1000 },
  };

  colors: number[] = [];
  colorIndex = 0;
  lastColorChange = 0;
  materials = new Set<MeshBasicMaterial>();

  update(): void {
    this.colors = this.data.colors.map((color) => parseInt(color.slice(1), 16));
    this.colorIndex = this.colors.length - 1;
  }

  tick(time: number, _delta: number): void {
    if (this.lastColorChange < time - this.data.timing) {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;

      this.lastColorChange = time;

      this.updateColors();
    }
  }

  updateColors(): void {
    this.materials.forEach((material) => {
      if (this.data.materials.includes(material.name)) {
        material.color?.setHex(this.colors[this.colorIndex]);
      }
    });
  }

  events = {
    "model-loaded"(this: AnimatedMaterialColorComponent): void {
      const mesh = this.el.getObject3D("mesh");

      mesh.traverse((node) => {
        const materialNode = node as Mesh;

        // ignore nodes without materials
        if (!materialNode.material) return;

        const materials = (Array.isArray(materialNode.material)
          ? materialNode.material
          : [materialNode.material]) as MeshBasicMaterial[];

        materials.forEach((material) => this.materials.add(material));
      });
    },
  };
}
