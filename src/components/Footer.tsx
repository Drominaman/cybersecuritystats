import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t-4 border-[var(--border)] mt-auto bg-[var(--foreground)] text-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <p className="font-mono text-xs uppercase tracking-[0.15em]">
          CyberSecurityStats
        </p>
        <div className="flex gap-4 font-mono text-xs uppercase tracking-wider">
          <Link href="/about" className="hover:text-[var(--highlight)]">
            About
          </Link>
          <Link href="/author" className="hover:text-[var(--highlight)]">
            Author
          </Link>
          <Link href="/newsletter" className="hover:text-[var(--highlight)]">
            Newsletter
          </Link>
          <Link href="/privacy" className="hover:text-[var(--highlight)]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--highlight)]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
