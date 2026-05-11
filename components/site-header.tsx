import BackPill from './back-pill'
import GetInTouch from './get-in-touch'
import Logo from './logo'
import NavPill from './nav-pill'

type SiteHeaderProps =
  | { variant: 'default'; showGetInTouch?: boolean }
  | { variant: 'back'; label: string; href: string; showGetInTouch?: boolean }

export default function SiteHeader(props: SiteHeaderProps) {
  const showGetInTouch = props.showGetInTouch ?? true
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between p-3.5 sm:p-5">
      <div className="flex items-center gap-3 z-10">
        <Logo />
        {props.variant === 'default' ? (
          <div className="hidden sm:block">
            <NavPill />
          </div>
        ) : (
          <BackPill label={props.label} href={props.href} />
        )}
      </div>
      <div className="flex items-center z-10">
        {showGetInTouch ? (
          <div className="hidden sm:block">
            <GetInTouch />
          </div>
        ) : null}
        {props.variant === 'default' ? (
          <div className="sm:hidden">
            <NavPill withContact />
          </div>
        ) : null}
      </div>

      <div
        aria-hidden
        className="eased-gradient eased-gradient-to-b from-background to-transparent w-full absolute top-0 left-0 h-full"
      />
    </header>
  )
}
