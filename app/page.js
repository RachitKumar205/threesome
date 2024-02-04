'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


import { apiDomain } from "@/app/apiConfig";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Map, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "postcss";
function Home() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentWaypoint, setCurrentWaypoint] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiDomain}/nav/`); // Replace with your actual endpoint URL
                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className={"w-full flex border-b border-b-nav-purple bg-nav-purple p-3"}>
                <div className={"flex"}>
                    <NavigationMenu className={"p-2 flex flex-row "}>
                        <p className={"text-3xl mx-4 text-white"}>meshNav Admin</p>

                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/create" className={navigationMenuTriggerStyle()}>
                                    Create
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                                    Map
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/waypoints" className={navigationMenuTriggerStyle()}>
                                    Waypoint List
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            <div className="flex flex-col md:flex-row overflow-hidden items-stretch w-full md:items-center">

                <div className="flex flex-col w-full md:w-2/3 md:p-12 p-0">
                    {/* Key changes for responsiveness */}
                    <Map
                        mapboxAccessToken="pk.eyJ1IjoicmFjaGl0a3VtYXIyMDUiLCJhIjoiY2xyb28yd2I3MDIxazJrbnpocjN4YTkzcCJ9.nP43qrue0MVVQim3guk0oQ"
                        initialViewState={{
                            latitude: 28.524169,
                            longitude: 77.574015,
                            zoom: 18,
                            width: '100vw',

                        }}
                        style={{height: 600}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                        {data.map((item) => (
                            <Marker
                                key={item.wp_id}
                                latitude={item.latitude}
                                longitude={item.longitude}
                                color="red"
                                onClick={() => setCurrentWaypoint(item)}/>
                        ))}
                    </Map>
                </div>
                <div className={"flex md:w-1/4 w-full h-1/4"}>
                    <Card className={"w-full h-full py-5"}>
                        {currentWaypoint.length===0 && (
                            <>
                                <CardHeader>Select a waypoint to get started</CardHeader>
                                <CardContent>Click on a marker on the map to view its details.</CardContent>
                            </>
                        )}
                        {currentWaypoint.length!==0 && (
                            <>
                                {/* Extract and display relevant information from the corresponding waypoint object */}
                                <CardHeader className={"text-2xl"}>Waypoint ID: {currentWaypoint.id}</CardHeader>
                                <CardContent>
                                    <div className={"border p-2"}>
                                        Name: {currentWaypoint.name}
                                    </div>
                                    <div className={"border p-2"}>
                                        Lat: {currentWaypoint.latitude}
                                    </div>
                                    <div className={"border p-2"}>
                                        Long: {currentWaypoint.longitude}
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            </div>

        </>
    );
}

export default Home;
