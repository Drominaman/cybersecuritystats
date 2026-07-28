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
          backgroundColor: '#ffffff',
          padding: '80px',
          borderTop: '2px solid #000000',
          borderBottom: '2px solid #000000',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#555555',
            fontFamily: 'Arial, Helvetica, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginBottom: '24px',
          }}
        >
          cybersecuritystats.com
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
            color: '#000000',
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
