import * as AFrame from "aframe";
import * as ZapparAFrame from "@zappar/zappar-aframe";
import "aframe-extras";

import "./components/shiny";
import "./components/model-picker";
import "./components/firebase-model";
import "./index.scss";

console.log("Using AFrame", AFrame.version);
console.log("Using ZapparAFrame", ZapparAFrame);

const setup = () => {
  // When the user taps on the placement UI
  const placementUI = document.getElementById(
    "zappar-placement-ui"
  ) as HTMLElement;

  placementUI.addEventListener("click", () => {
    // Set placement-mode to false on the instant tracker group
    const instantGroup = document.getElementById(
      "instant-group"
    ) as HTMLElement;
    instantGroup.setAttribute("zappar-instant", "placement-mode: false");

    // Remove the placement UI
    placementUI.remove();
  });
};

window.addEventListener("load", setup);
