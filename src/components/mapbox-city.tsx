"use client"

import { useEffect, useRef } from "react"

const WARSAW: [number, number] = [21.0118, 52.2298] // Śródmieście

export function MapboxCity() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) {
      console.warn("Set VITE_MAPBOX_TOKEN in .env.local")
      return
    }

    let map: any = null

    const init = async () => {
      const mapboxgl = (await import("mapbox-gl")).default
      await import("mapbox-gl/dist/mapbox-gl.css")

      mapboxgl.accessToken = token

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: WARSAW,
        zoom: 15.5,
        pitch: 62,
        bearing: -15,
        antialias: true,
        interactive: false,
      })

      map.on("style.load", () => {
        // Kill the default building layer if present
        if (map.getLayer("building")) map.removeLayer("building")

        // Add custom neon-tinted 3D buildings
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,   "#12122e",
                20,  "#1a1a40",
                60,  "#1e1e55",
                120, "#22226a",
                200, "#2a2a88",
              ],
              "fill-extrusion-height": [
                "interpolate", ["linear"], ["zoom"],
                14, 0,
                14.5, ["get", "height"],
              ],
              "fill-extrusion-base": [
                "interpolate", ["linear"], ["zoom"],
                14, 0,
                14.5, ["get", "min_height"],
              ],
              "fill-extrusion-opacity": 0.97,
              "fill-extrusion-ambient-occlusion-intensity": 0.4,
              "fill-extrusion-ambient-occlusion-radius": 3,
            },
          },
          // Insert below road labels so they stay readable
          "road-label-simple"
        )

        // Tint roads cyan/neon
        const roadLayers = map.getStyle().layers.filter(
          (l: any) => l.id.startsWith("road") && l.type === "line"
        )
        roadLayers.forEach((l: any) => {
          map.setPaintProperty(l.id, "line-color", "#0d3a5c")
        })

        // Slow rotation — Warsaw slowly spinning under you
        let bearing = -15
        const animate = () => {
          bearing -= 0.018
          map.setBearing(bearing)
          rafRef.current = requestAnimationFrame(animate)
        }
        animate()
      })
    }

    init()

    return () => {
      cancelAnimationFrame(rafRef.current)
      map?.remove()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
