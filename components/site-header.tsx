import GetInTouch from "./get-in-touch";
import Logo from "./logo";
import NavPill from "./nav-pill";

export default function SiteHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between p-3.5 sm:px-5 sm:py-4">
      <div className="flex items-center gap-3 z-10">
        <Logo />
        <div className="hidden sm:block">
          <NavPill />
        </div>
      </div>
      <div className="flex items-center z-10">
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
        className="eased-gradient eased-gradient-to-b from-background to-transparent w-full absolute top-0 left-0 h-full"
      />
    </header>
  );
}
