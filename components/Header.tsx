import Link from "next/link";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/layout/logo.png"
            alt="Behringer & Partner Logo"
            loading="lazy"
          />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
