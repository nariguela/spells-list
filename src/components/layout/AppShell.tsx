import type { ReactNode } from "react"
import { Link, NavLink } from "react-router-dom"
import { cn } from "../../lib/cn"

interface AppShellProps {
  children: ReactNode
  savedCount: number
}

export function AppShell({ children, savedCount }: AppShellProps) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-lg border border-[#f6df9a]/35 px-3 py-2 text-[#f7e8c1] no-underline transition hover:border-[#f6df9a]/60 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]",
      isActive &&
        "border-[#f6df9a]/55 bg-linear-to-b from-[#9f292d] to-[#64191c]",
    )

  return (
    <div className="mx-auto min-h-dvh w-[min(1220px,calc(100%-32px))] pb-12 pt-4 max-md:w-[calc(100%-20px)] max-sm:w-full max-sm:pt-0">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 py-3 backdrop-blur-3xl max-md:flex-col max-md:items-stretch max-sm:px-3">
        <Link
          className="inline-flex items-center gap-2.5 text-[#f7e8c1] no-underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f6df9a]"
          to="/"
        >
          <span className="grid size-9 place-items-center text-xl rounded-full border border-[#f6df9a]/40 bg-[#7e1f22]/80 text-[#f6df9a]">
            ✦
          </span>
          <span>
            <strong className="block font-serif text-xl">Grimório 5e</strong>
            <small className="block text-xs text-[#d8c79f]">
              Magias em português
            </small>
          </span>
        </Link>
        <nav
          aria-label="Navegação principal"
          className="flex flex-wrap justify-end gap-2 max-md:justify-start"
        >
          <NavLink className={navClass} to="/">
            Todas
          </NavLink>
          <NavLink className={navClass} to="/salvas">
            Minhas Magias ({savedCount})
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
