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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Badge} from "@/components/ui/badge";
import {apiDomain} from "@/app/apiConfig";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



function WaypointList() {
    const [name, setName] = useState('');
    const [wp_id, setWp_id] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

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
                                <NavigationMenuLink href="https://google.com/" className={navigationMenuTriggerStyle()}>
                                    Waypoint List
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            <div className={"flex items-center justify-center flex-col w-full md:flex-row"}>
                {error && <p>Error: {error}</p>}
                <div className={"flex w-full md:w-fit"}>
                    <Card className={"w-full"}>
                        <CardHeader>
                            <CardTitle className={"text-2xl"}>List of waypoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Name</TableHead>
                                        <TableHead>wp_id</TableHead>
                                        <TableHead>Latitude</TableHead>
                                        <TableHead className="text-right">Longitude</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <>
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.wp_id}</TableCell>
                                                <TableCell>{item.latitude}</TableCell>
                                                <TableCell>{item.longitude}</TableCell>
                                            </TableRow>
                                        </>
                                    ))}

                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default WaypointList;
