import { createFileRoute } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { CityScene } from "@/components/city-scene"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#020205]">
      <CityScene />

      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div className="font-mono">
            <div className="text-xs tracking-[0.3em] text-white/30 uppercase">Warsaw / 3AM</div>
            <h1 className="text-2xl font-medium tracking-widest text-white/90 uppercase">
              Young ATI
            </h1>
            <div className="text-xs tracking-[0.2em] text-white/40">Late Night Hackin&apos;</div>
          </div>
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between">
          <div className="font-mono text-xs text-white/25 tracking-widest">
            <div>dark trap / hacker rap</div>
            <div className="mt-1 text-white/15">13 tracks · 2026</div>
          </div>
          <div className="font-mono text-xs text-white/20 text-right">
            <div>youngati.com</div>
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(2,2,5,0.7) 100%)",
        }}
      />
    </div>
  )
}
