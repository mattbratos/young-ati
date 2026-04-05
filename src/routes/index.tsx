import { createFileRoute } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { MapboxCity } from "@/components/mapbox-city"
import { BloomOverlay } from "@/components/bloom-overlay"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#06060f]">
      {/* Layer 1: Real Warsaw via Mapbox */}
      <MapboxCity />

      {/* Layer 2: Three.js bloom glow overlay */}
      <BloomOverlay />

      {/* Layer 3: HUD */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="font-mono">
            <div className="text-[10px] tracking-[0.35em] text-white/30 uppercase">
              Warszawa · 3:00 AM
            </div>
            <h1 className="text-3xl font-medium tracking-[0.2em] text-white/90 uppercase">
              Young ATI
            </h1>
            <div className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
              Late Night Hackin&apos;
            </div>
          </div>
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
            <div>dark trap · hacker rap</div>
            <div className="mt-1 text-white/12">13 tracks · 2026</div>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/15 uppercase text-right">
            <div>youngati.com</div>
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(6,6,15,0.75) 100%)",
        }}
      />
    </div>
  )
}
