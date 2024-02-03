"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";
import axios from "axios";

import arrowDark from "../public/arrow-dark.svg"

export default function Home() {
  const [orienation, requestAccess, revokeAccess, orientationError] = useDeviceOrientation();
  const [isToggled, setIsToggled] = useState(false);
  const [destination, setDestination] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [path, setPath] = useState(null);
  const [error, setError] = useState(null);

  // Getting coordinates

  // Getting compass heading
  useEffect(() => {
    const handleClick = () => {
      (async () => {
        try {
          const response = await axios.get(
            `https://snunav.azurewebsites.net/meshnav/`
          )
          setPath(response);
        } catch (error) {
          setError(error);
        }
      })();

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

  const compass = (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={arrowDark}
        style={{transform: `rotate(${Math.round((orienation && orienation.alpha)??360 - 360)}deg)`}}
      />
      {/* {360 - orienation.alpha} */}
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
        {error}
        {path&&path[0]}

      {/* {compass} */}
      </div>
    </main>
    
  );
}
