'use client'

import WorkContent from '@/components/landing/WorkContent'

const FONT_UI = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export default function WorkPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: '#f9f9f7',
      fontFamily: FONT_UI,
      color: '#0d0d0d',
    }}>
      <WorkContent />
    </main>
  )
}
