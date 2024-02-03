"use client";
import Image from "next/image";
import { useState } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";

export default function Home() {
  const [orienation, requestAccess, revokeAccess, error] = useDeviceOrientation();
  const [isToggled, setIsToggled] = useState(false);
  const [destination, setDestination] = useState(null);

  const navigateClick = () => {
    if (!isToggled) {
      requestAccess();
      setIsToggled(true);
    }
    setDestination(document.getElementById("destination-select").value);
  }

  const compass = orienation && (
    <div>
      sex
      {orienation.alpha}
    </div>
  );

  return (
    <main>
      <div className="app h-screen flex flex-col">
        <div className="select flex flex-col">
          <select name="destination" id="destination-select">
            <option value="test">Tets</option>
          </select>
          <button onClick={navigateClick()}>Navigate!</button>
        </div>

        <div>
          {compass}
        </div>
      </div>
    </main>
    
  );
}
