import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#eff5fe',
          color: '#072c66',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          width: '100%',
        }}
      >
        <div
          style={{
            borderLeft: '16px solid #126dff',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1020px',
            paddingLeft: '52px',
          }}
        >
          <div
            style={{
              color: '#126dff',
              display: 'flex',
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 24,
            }}
          >
            IDSK SHADCN
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.08,
            }}
          >
            React komponenty pre slovenské e-služby
          </div>
          <div
            style={{
              color: '#335477',
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 30,
            }}
          >
            Open source komponenty podľa dizajnového systému IDSK 3.1
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
