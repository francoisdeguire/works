import BackPill from './back-pill'
import GetInTouch from './get-in-touch'
import Logo from './logo'
import MobileMenu from './mobile-menu'
import NavPill from './nav-pill'

type SiteHeaderProps =
  | { variant: 'default'; showGetInTouch?: boolean }
  | { variant: 'back'; label: string; href: string; showGetInTouch?: boolean }

export default function SiteHeader(props: SiteHeaderProps) {
  const showGetInTouch = props.showGetInTouch ?? true
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <Logo />
        {props.variant === 'default' ? (
          <div className="hidden md:block">
            <NavPill />
          </div>
        ) : (
          <BackPill label={props.label} href={props.href} />
        )}
      </div>
      <div className="flex items-center">
        {showGetInTouch ? (
          <div className="hidden md:block">
            <GetInTouch />
          </div>
        ) : null}
        <div className="md:hidden">
          <MobileMenu showGetInTouch={showGetInTouch} />
        </div>
      </div>
    </header>
  )
}
