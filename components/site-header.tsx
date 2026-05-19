import GetInTouch from './get-in-touch'
import Logo from './logo'
import NavPill from './nav-pill'

type SiteHeaderProps = {
  showGetInTouch?: boolean
}

export default function SiteHeader({ showGetInTouch = true }: SiteHeaderProps = {}) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between p-3.5 sm:p-5">
      <div className="flex items-center gap-3 z-10">
        <Logo />
        <div className="hidden sm:block">
          <NavPill />
        </div>
      </div>
      <div className="flex items-center z-10">
        {showGetInTouch ? (
          <div className="hidden sm:block">
            <GetInTouch />
          </div>
        ) : null}
        <div className="sm:hidden">
          <NavPill withContact />
        </div>
      </div>

      <div
        aria-hidden
        className="eased-gradient eased-gradient-to-b from-background to-transparent w-full absolute top-0 left-0 h-full"
      />
    </header>
  )
}
