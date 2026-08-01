"use client"

import { divIcon } from "leaflet"
import type { Marker as LeafletMarker } from "leaflet"
import { Crosshair } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"

import { Button } from "@/components/ui/button"

const DEFAULT_CENTER: [number, number] = [-7.751138, 114.2737278]
const DEFAULT_ZOOM = 13
const PICK_ZOOM = 15

const markerIcon = divIcon({
    className: "",
    html: `<div style="position:relative;width:18px;height:24px;">
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.5);"></div>
        <div style="position:absolute;top:13px;left:50%;transform:translateX(-50%) rotate(45deg);width:8px;height:8px;background:#2563eb;"></div>
    </div>`,
    iconSize: [18, 24],
    iconAnchor: [9, 24],
})

type MapPickerProps = {
    latitude: number | null
    longitude: number | null
    onChange: (latitude: number, longitude: number) => void
}

function ClickCatcher({
    onPick,
}: {
    onPick: (latitude: number, longitude: number) => void
}) {
    useMapEvents({
        click: (e) => {
            onPick(e.latlng.lat, e.latlng.lng)
        },
    })

    return null
}

function ViewCatcher({
    position,
}: {
    position: [number, number] | null
}) {
    const map = useMap()
    const first = useRef(true)

    useEffect(() => {
        if (!position || first.current) {
            first.current = false

            return
        }

        map.flyTo(position, Math.max(map.getZoom(), PICK_ZOOM))
    }, [position, map])

    return null
}

export function MapPicker({
    latitude,
    longitude,
    onChange,
}: MapPickerProps) {
    const hasCoords = latitude !== null && longitude !== null
    const [position, setPosition] = useState<[number, number]>(() =>
        hasCoords ? [latitude, longitude] : DEFAULT_CENTER
    )
    const [viewPosition, setViewPosition] = useState<[number, number] | null>(
        null
    )
    const [locating, setLocating] = useState(false)
    const [prevLat, setPrevLat] = useState(latitude)
    const [prevLng, setPrevLng] = useState(longitude)
    const [lastMapPos, setLastMapPos] = useState<[number, number] | null>(null)

    if (latitude !== prevLat || longitude !== prevLng) {
        setPrevLat(latitude)
        setPrevLng(longitude)

        const fromMap =
            lastMapPos !== null &&
            latitude === lastMapPos[0] &&
            longitude === lastMapPos[1]

        if (latitude !== null && longitude !== null && !fromMap) {
            setPosition([latitude, longitude])
            setViewPosition([latitude, longitude])
        }
    }

    const normalize = (value: number) => Number(value.toFixed(7))

    const pick = (
        lat: number,
        lng: number,
        opts: { flyTo?: boolean } = {}
    ) => {
        const normLat = normalize(lat)
        const normLng = normalize(lng)

        setPosition([normLat, normLng])
        setLastMapPos([normLat, normLng])

        if (opts.flyTo) {
            setViewPosition([normLat, normLng])
        }

        onChange(normLat, normLng)
    }

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            return
        }

        setLocating(true)

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false)
                pick(pos.coords.latitude, pos.coords.longitude, {
                    flyTo: true,
                })
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    return (
        <div className="space-y-2">
            <div className="relative z-0 h-64 w-full overflow-hidden rounded-lg border">
                <MapContainer
                    center={position}
                    zoom={hasCoords ? PICK_ZOOM : DEFAULT_ZOOM}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; Esri, Maxar, Earthstar Geographics'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                    />
                    <Marker
                        position={position}
                        icon={markerIcon}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target as LeafletMarker
                                const latlng = marker.getLatLng()

                                pick(latlng.lat, latlng.lng)
                            },
                        }}
                    />
                    <ClickCatcher onPick={pick} />
                    <ViewCatcher position={viewPosition} />
                </MapContainer>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-2 hover:!bg-muted hover:!text-foreground"
                onClick={useMyLocation}
                disabled={locating}
            >
                <Crosshair className="h-4 w-4" />
                {locating ? "Mendeteksi lokasi…" : "Gunakan lokasi saya"}
            </Button>
        </div>
    )
}
