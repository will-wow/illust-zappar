import * as AFrame from "aframe";
import * as ZapparAFrame from "@zappar/zappar-aframe";

console.log("Using AFrame", AFrame.version);
console.log("Using ZapparAFrame", ZapparAFrame);

window.addEventListener("load", setup);

function setup() {

    // When the user taps on the placement UI
    var placementUI = document.getElementById("zappar-placement-ui");
    placementUI.addEventListener("click", function() {
        
        // Set placement-mode to false on the instant tracker group
        let instantGroup = document.getElementById("instant-group");
        instantGroup.setAttribute("zappar-instant", "placement-mode: false");

        // Remove the placement UI
        placementUI.remove();
    });
    
}
