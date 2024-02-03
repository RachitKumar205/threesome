import { useCallback, useEffect, useState } from "react";

export const useDeviceOrientation = () => {
    const [orientationError, setOrientationError] = useState(null);
    const [orientation, setOrientation] = useState(null);

    const onDeviceOrientation = (event) => {
        setOrientation({
            alpha: event.alpha.toFixed(3),
            beta: event.beta.toFixed(3),
            gamma: event.gamma.toFixed(3),
        })
    }

    const revokeAccessAsync = async () => {
        window.removeEventListener("deviceorientationabsolute", onDeviceOrientation, true);
        setOrientation(null);
    }
    
    const requestAccessAsync = async () => {

        if (!DeviceOrientationEvent) {
            setOrientationError(new Error("Device orienation is not supported on this browser"));
            return false;   
        }

        if (
            DeviceOrientationEvent.requestPermission
            && typeof(DeviceOrientationEvent.requestPermission === "function")
        ) {
            let permission;
            try {
                permission = await DeviceOrientationEvent.requestPermission();
            } catch (err) {
                setOrientationError(err);
                return false;
            }
            if (permission !== "granted") {
                setOrientationError("not granted");
                return false;
            }
        }
        window.addEventListener("deviceorientationabsolute", onDeviceOrientation, true);  
        return true;
    }

    const requestAccess = useCallback(requestAccessAsync, []);
    const revokeAccess = useCallback(revokeAccessAsync, []);

    useEffect(() => {
        return () => revokeAccess();
    }, [revokeAccess])

    return [
        orientation,
        requestAccess,
        revokeAccess,
        orientationError,
    ];
}