import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#000000',
            fontFamily: 'Arial, Helvetica, sans-serif',
            letterSpacing: '-1px',
          }}
        >
          CS
        </span>
      </div>
    ),
    { ...size }
  )
}
