import {
  BaseComponent,
  bind,
  component,
} from "aframe-typescript-class-components";

/** Load a model from a firebase slug. */
@component("model-picker")
export class ModelPicker extends BaseComponent {
  static schema = {};

  $form = document.querySelector("#model-picker");

  $input = (document.querySelector(
    "#model-picker__input"
  ) as unknown) as HTMLInputElement;

  $placementUi = document.querySelector("#zappar-placement-ui");

  init(): void {
    const urlSlug = this.getSlugFromPath();

    // Get the slug from the url, or the input if no query param.
    if (urlSlug) {
      this.setSlug(urlSlug);
    } else {
      this.$form.addEventListener("submit", this.onChooseModel);
    }
  }

  @bind
  async onChooseModel(event: Event): Promise<void> {
    event.preventDefault();

    const slug = this.$input.value;
    if (!slug) return;

    this.setSlug(slug);
  }

  setSlug(slug: string): void {
    this.el.setAttribute("firebase-model", {
      slug,
    });

    this.$form.style.display = "none";
    this.$placementUi.style.display = "block";
  }

  getSlugFromPath(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("model") || null;
  }
}
