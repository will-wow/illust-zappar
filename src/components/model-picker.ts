import {
  BaseComponent,
  bind,
  component,
} from "aframe-typescript-class-components";

/** Load a model from a firebase slug. */
@component("model-picker")
export class ModelPicker extends BaseComponent {
  $input = (document.querySelector(
    "#model-picker"
  ) as unknown) as HTMLSelectElement;

  init(): void {
    const urlSlug = this.getSlugFromPath();

    // Get the slug from the url, or the input if no query param.
    this.$input.value = urlSlug;
    this.setSlug(urlSlug);
    this.$input.addEventListener("change", this.onChooseModel);
  }

  @bind
  async onChooseModel(): Promise<void> {
    const slug = this.$input.value;

    this.setSlug(slug);
  }

  setSlug(slug: string): void {
    this.el.setAttribute("firebase-model", {
      slug,
    });
  }

  getSlugFromPath(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("model") || "";
  }
}
