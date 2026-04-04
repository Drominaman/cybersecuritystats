import { ImageResponse } from 'next/og'

export const alt = 'CyberSecurityStats — Cybersecurity Statistics by Industry and Threat'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#fffdf5',
          padding: '80px',
          borderTop: '8px solid #0a0a0a',
          borderBottom: '8px solid #0a0a0a',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#555555',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginBottom: '24px',
          }}
        >
          CYBERSECURITYSTATS.COM
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#0a0a0a',
            lineHeight: 0.95,
            letterSpacing: '-3px',
            marginBottom: '24px',
          }}
        >
          Cybersecurity Statistics,
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#ff3d00',
            lineHeight: 0.95,
            letterSpacing: '-3px',
            marginBottom: '40px',
          }}
        >
          Indexed &amp; Organized
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#555555',
          }}
        >
          9,900+ data points from 700+ industry reports
        </div>
      </div>
    ),
    { ...size }
  )
}
