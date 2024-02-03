"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";

export default function Home() {
  const [orienation, requestAccess, revokeAccess, error] = useDeviceOrientation();
  const [isToggled, setIsToggled] = useState(false);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    // Access the destination value within useEffect to ensure client-side execution
    const handleClick = () => {
      if (!isToggled) {
        requestAccess();
        setIsToggled(true);
      }
      const selectedDestination = document.getElementById("destination-select").value;
      setDestination(selectedDestination);
    };

    const button = document.querySelector("button"); // Assuming a single button
    button.addEventListener("click", handleClick);

    // Cleanup function to remove the event listener
    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, []);

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
          <button>Navigate!</button>
        </div>

        <div>
          {compass}
        </div>
      </div>
    </main>
    
  );
}
