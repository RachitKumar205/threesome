'use client'
// pages/create-waypoint.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Badge} from "@/components/ui/badge";


function CreateWaypoint() {
    const [name, setName] = useState('');
    const [wp_id, setWp_id] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    console.log("updated")
                },

                (error) => alert(JSON.stringify(error)),
                {enableHighAccuracy: true, distanceFilter: 1}

            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            console.error('Geolocation API is not supported in this browser.');
            setError('Geolocation is not supported in your browser.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('https://meshnav.azurewebsites.net/nav/', {
                name,
                wp_id,
                latitude,
                longitude,
            });

            // Handle successful response
            console.log('Waypoint created successfully:', response.data);
            setIsSuccessDialogOpen(true)
            setName('');
            setWp_id('');
            // Clear form fields, redirect, or display a success message
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={"w-full flex align-middle justify-center border-b border-b-gray-800"}>
                <div className={"flex"}>
                    <NavigationMenu className={"p-2 flex justify-center flex-row "}>
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
                                <NavigationMenuLink href="/list" className={navigationMenuTriggerStyle()}>
                                    Waypoint List
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            <div className={"flex items-center justify-center flex-col w-full md:flex-row"}>
                {error && <p>Error: {error}</p>}
                <form onSubmit={handleSubmit} className="w-screen md:w-[350px] mt-40">
                    <div className={"flex"}>
                        <Card className={"w-full"}>
                            <CardHeader>
                                <CardTitle className={"text-2xl"}>Add a waypoint</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={name} placeholder="Name the waypoint" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="framework">Waypoint ID</Label>
                                        <Input id="wp_id" value={wp_id} placeholder="Add waypoint ID" onChange={(e) => setWp_id(e.target.value)} />
                                    </div>
                                    <div className={"flex flex-row"}>
                                        <Badge variant={"outline"} className={"w-fit mr-2 text-blue-600 flex text-base"}>Lat: {latitude}</Badge>
                                        <Badge variant={"outline"} className={"w-fit text-blue-600 flex text-base"}>Long: {longitude}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="submit" className={"md:w-1/4 w-full"}> Create</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </form>

                <AlertDialog open={isSuccessDialogOpen} onClose={() => setIsSuccessDialogOpen(false)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Waypoint Created!</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            The waypoint has been successfully added.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}

export default CreateWaypoint;
