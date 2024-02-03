"use client";

import { useState, useEffect } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";
import Image from "next/image";

import axios from "axios";
import {getDistance, getPreciseDistance, isPointWithinRadius} from "geolib";

import SelectDestination from "@/components/SelectDestination/SelectDestination";

export default function Home() {
  const [destination, setDestination] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [orienation, requestAccess, revokeAccess, orienationError] = useDeviceOrientation();
  const [path, setPath] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destinationReached, setDestinationReached] = useState(false);

  const changeDestination = (destination) => {
    console.log(destination)
    console.log(latitude)
    console.log(longitude)
    setDestination(destination);
    (async () => {
      try {
        const response = await fetch(
          "https://snunav.azurewebsites.net/api/path-api/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              target: destination.name,
              type: 'coordinates',
            }),
          }
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        console.log(data);
        setPath(data);
        
      } catch (error) {
        setError(error);
      }

    })();
  }

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);

            // Calculate distance only if both latitude, longitude, and responseData[0] are available
            if (latitude && longitude && path && path[0]) {
              setDistance(getDistance(
                  { latitude: latitude, longitude: longitude },
                  {
                    latitude: path[0].latitude,
                    longitude: path[0].longitude,
                  }
              ));	
              if (isPointWithinRadius(
                  { latitude: latitude, longitude: longitude },
                  {
                    latitude: path[0].latitude,
                    longitude: path[0].longitude,
                  },
                  5
              )) {
                // Remove the first element from responseData
                setPath(path.slice(1));

                // Update currentWaypoint if more waypoints exist
                if (path.length > 0) {
                  setDestinationReached(false);
                } else {
                  setDestinationReached(true);
                }
              }
            }
          },

          (error) => alert(JSON.stringify(error)),
          { enableHighAccuracy: true, distanceFilter: 1 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation API is not supported in this browser.');
      setError('Geolocation is not supported in your browser.');
    }
  }, [latitude, longitude, path]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <SelectDestination
        setDestination={changeDestination}
      />

      <div className="compass">

      </div>


    </div>
  )

}