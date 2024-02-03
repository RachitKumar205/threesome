"use client";
import { useState, useEffect } from "react";
import { useDeviceOrientation } from "./deviceOrientationHook";
import Image from "next/image";

import SelectDestination from "@/components/SelectDestination/SelectDestination";

import {getDistance, getPreciseDistance, isPointWithinRadius} from "geolib";

import arrowDarkSVG from "../public/arrow-dark.svg";

export default function Home() {
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [nextWaypoint, setNextWaypoint] = useState(null);
  const [nextWaypointHeading, setNextWaypointHeading] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compassToggled, setCompassToggled] = useState(false);
  const [orientation, requestAccess, revokeAccess, orientationError] = useDeviceOrientation();
  
  
  const changeDestination = (destination) => {
    if (!compassToggled) {
      requestAccess();
      setCompassToggled(true); 
    }
    setDestination(destination);
    setIsLoading(true);
    (async () => {
      try {
        console.log(destination);
        console.log(latitude);
        console.log(longitude);
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
          },
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json()
        setPath(data);
        setNextWaypoint(data[0]);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();

  }

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        console.log(latitude);
        console.log(longitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        if (latitude && longitude && path) {
          setDistance(getDistance(
            { latitude: latitude, longitude: longitude },
            {
              latitude: nextWaypoint.latitude,
              longitude: nextWaypoint.longitude,
            }
          ));

          if (distance <= 5) {
            setPath(path.slice(1));
            if (path.length > 0) {
              setNextWaypoint(path[0]);
            } else {
              setNextWaypoint(null);
            }
          }

        }
      },
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, distanceFilter: 1 }
      );

      // Cleanup code
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      const error = new Error("Geolocation API is not supported in this browser");
      setError(error);
    }
  }, [latitude, longitude, path]);

  useEffect(() => {
    if (nextWaypoint) {
      const deltaX = nextWaypoint.latitude - latitude;
      const deltaY = nextWaypoint.longitude - longitude;
  
      let theta;
      if (deltaY > 0 && deltaX > 0) {
        theta = Math.PI / 2 - Math.atan(deltaY / deltaX);
      } else if (deltaY < 0 && deltaX < 0) {
        theta = (3 * Math.PI / 2) - Math.atan(deltaY / deltaX);
      } else if (deltaY < 0 && deltaX > 0) {
        theta = Math.atan(deltaY / deltaX) + (Math.PI / 2);
      } else if (deltaY > 0 && deltaX < 0) {
        theta = Math.atan(deltaY / deltaX) + (3 * Math.PI / 2);
      }
      setNextWaypointHeading(180 * theta / Math.PI);
    }
  }, [latitude, longitude, nextWaypoint])

  const compass = (
    <div className="compass">
      <Image
        src={arrowDarkSVG}
        style={{transform: `rotate(${Math.round((orientation && orientation.alpha)??360 - 360)})deg`}}
      />
    </div>
  )

  return (
    <div className="app min-h-screen flex flex-col justify-center items-center">
      <p>
      {latitude}
      </p>
      <p>
      {longitude}

      </p>
      <SelectDestination
        setDestination={changeDestination}
      />
      {isLoading && <p>Loading Path...</p>}
      {!isLoading && !error && (
        <>
          <div>
            Angle - {nextWaypointHeading}
            {path.map((item) => (
              <p>{item.latitude}</p>
            ))}
          </div>
        </>
      )}
      {!isLoading && !error && ({compass})}

    </div>
  )

}