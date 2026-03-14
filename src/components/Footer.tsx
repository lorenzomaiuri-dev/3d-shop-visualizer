import { Github, Linkedin, Box } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2 text-lg font-black tracking-tighter">
              <Box className="h-5 w-5 text-blue-600" />
              <span>
                <span className="text-blue-600">3D</span> Shop Visualizer
              </span>
            </div>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
              React - Three.js - SQLite WASM
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/lorenzomaiuri-dev"
              target="_blank"
              className="text-slate-400 transition-colors hover:text-blue-600"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/maiurilorenzo"
              target="_blank"
              className="text-slate-400 transition-colors hover:text-blue-600"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
