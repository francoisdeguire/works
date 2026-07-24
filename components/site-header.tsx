import GetInTouch from './get-in-touch'
import Logo from './logo'
import NavPill from './nav-pill'

export default function SiteHeader() {
  // pt max() clears the notch on viewport-fit=cover routes
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-40 flex items-center justify-between p-3.5 pt-[max(0.875rem,env(safe-area-inset-top))] sm:px-5 sm:py-4 sm:pt-[max(1rem,env(safe-area-inset-top))] print:hidden">
      <div className="pointer-events-auto flex items-center gap-3 z-10">
        <Logo />
        <div className="hidden sm:block">
          <NavPill />
        </div>
      </div>
      <div className="pointer-events-auto flex items-center z-10">
        <div className="hidden sm:block">
          <GetInTouch />
        </div>
        <div className="sm:hidden">
          <NavPill withContact />
        </div>
      </div>

      <div
        aria-hidden
        data-header-fade
        className="bg-eased-linear-to-b from-background to-transparent w-full absolute top-0 left-0 h-full pointer-events-none"
      />
    </header>
  )
}
