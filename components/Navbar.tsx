import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <p className="text-lg font-bold">Sobri Saham</p>
          <p className="text-xs text-slate-500">Asisten analisis saham Indonesia</p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/chat" className="hover:text-blue-600">Chat</Link>
          <a href="#watchlist" className="hover:text-blue-600">Watchlist</a>
        </div>
      </div>
    </nav>
  );
}
