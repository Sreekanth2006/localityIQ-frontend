'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-primary-600 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 font-display">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Ready to make a <br /><span className="text-white/80 italic">smarter</span> decision?
        </h2>
        <p className="text-lg md:text-xl opacity-90 mb-12 max-w-2xl mx-auto font-ui font-medium">
          Compare localities side-by-side and download detailed PDF reports with comprehensive insights.
        </p>
        <Link href="/compare">
          <Button variant="secondary" size="lg" className="bg-white text-primary-900 border-0 hover:bg-neutral-50 shadow-2xl px-12 py-8 text-xl font-bold rounded-2xl transition-all hover:scale-105">
            Start Comparing Now →
          </Button>
        </Link>
      </div>
    </section>
  )
}
