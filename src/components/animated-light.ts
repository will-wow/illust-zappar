import { BaseComponent, component } from "aframe-typescript-class-components";

interface AnimatedLightData {
  colors: string[];
  timing: number;
}

/**  Records ArJS Nft object detections. */
@component("animated-light")
export class AnimatedLightComponent extends BaseComponent<AnimatedLightData> {
  static schema = {
    colors: { type: "array" as const, default: [] },
    timing: { type: "number", default: "1000" },
  };

  colorIndex = 0;
  lastColorChange = 0;

  tick(time: number, _delta: number): void {
    if (this.lastColorChange < time - this.data.timing) {
      this.colorIndex = (this.colorIndex + 1) % this.data.colors.length;

      this.el.setAttribute("light", {
        color: this.data.colors[this.colorIndex],
      });

      this.lastColorChange = time;
    }
  }
}

console.log("anim");

