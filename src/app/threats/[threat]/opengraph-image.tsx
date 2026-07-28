import { ImageResponse } from 'next/og'

export const alt = 'CyberSecurityStats'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ threat: string }> }) {
  const { threat } = await params
  const label = threat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffffff', padding: '80px', borderTop: '2px solid #000000', borderBottom: '2px solid #000000' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#555', fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: '24px' }}>cybersecuritystats.com</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#000000', lineHeight: 1, letterSpacing: '-3px', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#0a0a0a', lineHeight: 1, letterSpacing: '-3px', marginBottom: '32px' }}>Statistics 2026</div>
        <div style={{ fontSize: 22, color: '#555' }}>Data from published industry reports</div>
      </div>
    ),
    { ...size }
  )
}
