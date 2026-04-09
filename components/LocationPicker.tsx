"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, LocateFixed, Loader2 } from "lucide-react"

type LatLng = { lat: number; lng: number }

interface Props {
  value: LatLng | null
  onChange: (loc: LatLng, address: string) => void
}

// Default center: Phnom Penh, Cambodia
const DEFAULT_CENTER: LatLng = { lat: 11.5625, lng: 104.916 }

export function LocationPicker({ value, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [address, setAddress] = useState("")

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      )
      const data = await res.json()
      const label = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(label)
      onChange({ lat, lng }, label)
    } catch {
      const label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(label)
      onChange({ lat, lng }, label)
    }
  }

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return
    
    // Safety check: remove existing leaflet ID if container was reused
    if ((mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = null;
    }
    
    setLoading(true)

    // Dynamically import Leaflet (client-only)
    import("leaflet").then((L) => {
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return

      const center = value ?? DEFAULT_CENTER
      const map = L.map(mapRef.current!, { zoomControl: true }).setView(
        [center.lat, center.lng],
        15
      )

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([center.lat, center.lng], { draggable: true }).addTo(map)
      markerRef.current = marker

      marker.on("dragend", () => {
        const pos = marker.getLatLng()
        reverseGeocode(pos.lat, pos.lng)
      })

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng)
        reverseGeocode(e.latlng.lat, e.latlng.lng)
      })

      leafletRef.current = map
      setLoading(false)

      if (value) reverseGeocode(value.lat, value.lng)
    })

    return () => {
      leafletRef.current?.remove()
      leafletRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function locateMe() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        leafletRef.current?.setView([lat, lng], 17)
        markerRef.current?.setLatLng([lat, lng])
        reverseGeocode(lat, lng)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="space-y-2">
      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border" style={{ height: 300 }}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" />

        {/* Locate me button */}
        <button
          type="button"
          onClick={locateMe}
          disabled={locating}
          title="Use my current location"
          className="absolute bottom-3 right-3 z-999 flex h-9 w-9 items-center justify-center rounded-full bg-white  border hover:bg-gray-50 transition-colors"
        >
          {locating
            ? <Loader2 className="h-4 w-4 animate-spin text-primary" />
            : <LocateFixed className="h-4 w-4 text-primary" />
          }
        </button>
      </div>

      {/* Resolved address */}
      {address && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
        </div>
      )}
      <p className="text-[11px] text-muted-foreground">
        Click on the map or drag the pin to set your delivery location.
      </p>
    </div>
  )
}
