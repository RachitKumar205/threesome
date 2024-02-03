"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";

import arrowDark from "../public/arrow-dark.png"

export default function Home() {
  const [orienation, requestAccess, revokeAccess, error] = useDeviceOrientation();
  const [isToggled, setIsToggled] = useState(false);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const handleClick = () => {
      if (!isToggled) {
        requestAccess();
        setIsToggled(true);
      }
      const selectedDestination = document.getElementById("destination-select").value;
      setDestination(selectedDestination);
    };

    const button = document.getElementById("destination-submit");
    button.addEventListener("click", handleClick);

    // Cleanup function
    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, []);

  const compass = orienation && (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={arrowDark}
        style={{transform: `rotate(${Math.round(orienation.alpha - 360)}deg)`}}
      />
      {orienation.alpha}
    </div>
  );

  return (
    <main>
      <div className="app h-screen flex flex-col justify-center items-center">

        <div className="select flex flex-col justify-center items-center">
          <select name="destination" id="destination-select">
            <option value="test">Tets</option>
          </select>
          <button id="destination-submit">Navigate!</button>
        </div>

      {compass}
      </div>
    </main>
    
  );
}
