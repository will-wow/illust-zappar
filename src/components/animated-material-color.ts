import {
  BaseComponent,
  bind,
  component,
} from "aframe-typescript-class-components";
import { MeshBasicMaterial, Mesh, Color } from "three";
import anime, { AnimeTimelineInstance } from "animejs";

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

  /** List of all materials to animate in the model. */
  materials = new Set<MeshBasicMaterial>();
  modelIsLoaded = false;
  animation?: AnimeTimelineInstance;
  /** The animation time (updated on tick). */
  time = 0;
  /** The object that will be animated over time. */
  currentColor = new Color();

  update(): void {
    this.animation?.pause();
    this.startAnimation();
  }

  tick(time: number, delta: number): void {
    if (!this.modelIsLoaded) return;

    this.time += delta;
    this.animation?.tick(this.time);
  }

  startAnimation(): void {
    if (this.data.colors.length <= 1) return;

    // Animate the color, starting with the first color.
    this.currentColor.set(this.data.colors[0]);

    // Set up a timeline, which will run each change in sequence.
    this.animation = anime.timeline({
      easing: "easeOutQuad",
      duration: this.data.timing,
      autoplay: false,
      loop: true,
      update: () => {
        this.updateColors();
      },
    });

    // Add animations to the other colors.
    this.data.colors.slice(1).forEach(this.addColorAnimation);
    // Animate back to the original color at the end of the loop.
    this.addColorAnimation(this.data.colors[0]);

    // Reset the timer clock.
    this.time = 0;
  }

  @bind
  addColorAnimation(color: string): void {
    const { r, g, b } = new Color(color);

    this.animation = this.animation?.add({
      targets: this.currentColor,
      r,
      g,
      b,
    });
  }

  updateColors(): void {
    this.materials.forEach((material) => {
      if (this.data.materials.includes(material.name)) {
        const { r, g, b } = this.currentColor;
        material.color?.setRGB(r, g, b);
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

      // Start the animation when the model is loaded.
      this.startAnimation();
      this.modelIsLoaded = true;
    },
  };
}
