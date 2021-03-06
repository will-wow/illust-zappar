import { BaseComponent, component } from "aframe-typescript-class-components";

/** Load a model from a firebase slug. */
@component("spinner")
export class SpinnerComponent extends BaseComponent {
  tick(time: number, timeDelta: number): void {
    if (this.el.object3D.visible) {
      this.el.object3D.rotateZ(360 / (timeDelta / 1000));
    }
  }
}
