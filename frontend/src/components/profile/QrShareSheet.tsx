'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { QrCode, X } from 'lucide-react'
import QRCode from 'qrcode'
import { toast } from 'sonner'
import { SITE_URL } from '@/lib/site-config'

// 기존 qr.js 포팅. shadcn의 사전 스타일링된 DialogContent(가운데 모달용 Tailwind 클래스가
// 하드코딩됨) 대신 @base-ui/react/dialog 프리미티브를 직접 사용한다 — 포털/포커스트랩/ESC
// 닫기/스크롤 락은 그대로 재사용하면서, 시각 스타일은 기존 .qr-sheet-* 클래스(바텀시트 형태)로
// 완전히 대체한다. QR은 클라이언트 캔버스에서만 그려지고 외부 서버로 URL이 전송되지 않는다.
export default function QrShareSheet() {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  // Portal 기본 타깃은 document.body인데, profile.css의 CSS 변수(--color-surface,
  // --radius-xl, --space-* 등)는 .gf-profile-page에만 스코프돼 있어(shadcn :root 변수와의
  // 충돌 회피) body 직속으로 포털하면 전부 상속이 끊겨 배경/모서리/패딩이 모두 투명해진다.
  // BusinessHoursBadge와 동일하게 .gf-profile-page를 포털 타깃으로 지정해야 한다.
  useEffect(() => {
    setPortalContainer(document.querySelector<HTMLElement>('.gf-profile-page'))
  }, [])

  // useEffect(open 의존)로 그리면, Popup이 엔트런스 애니메이션 때문에 캔버스를 한 틱
  // 늦게 DOM에 붙이는 최초 open 때 canvasRef.current가 아직 null이라 조용히 아무것도
  // 안 그려지는 레이스가 있었다(두 번째 open부터는 정상이었던 이유). 콜백 ref로 바꾸면
  // React가 실제로 이 캔버스 노드를 붙이는 바로 그 순간에 그리므로 이 타이밍에 영향받지 않는다.
  const attachCanvas = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      canvasRef.current = canvas
      if (!canvas || !open) return
      QRCode.toCanvas(canvas, SITE_URL, { width: 200, margin: 1 }).catch(() => {
        toast.error('QR 코드를 생성할 수 없습니다')
      })
    },
    [open]
  )

  const handleSaveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'profile-qr.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className="qr-trigger-button"
        aria-label="QR코드로 프로필 공유하기"
      >
        <QrCode aria-hidden focusable={false} />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal container={portalContainer}>
        {/* qr.js가 런타임에 만들던 .qr-sheet-root 래퍼 — 딤 배경/슬라이드업 트랜지션이
            전부 `.qr-sheet-root.is-open` 상위 선택자에 걸려 있어, 이 래퍼 없이는 시트가
            항상 `translate(-50%, 100%)`(화면 밖)에 고정되고 거기로 포커스가 이동하면서
            브라우저가 페이지 맨 아래로 스크롤해버린다. */}
        <div className={`qr-sheet-root${open ? ' is-open' : ''}`}>
          <DialogPrimitive.Backdrop className="qr-sheet-backdrop" />
          <DialogPrimitive.Popup className="qr-sheet" aria-labelledby="qrSheetTitle">
            <div className="qr-sheet-handle" />
            <div className="qr-sheet-header">
              <DialogPrimitive.Title className="qr-sheet-title" id="qrSheetTitle">
                QR코드로 공유
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="qr-sheet-close" aria-label="닫기">
                <X aria-hidden focusable={false} />
              </DialogPrimitive.Close>
            </div>
            <div className="qr-sheet-body">
              <div className="qr-sheet-canvas-wrap">
                <canvas ref={attachCanvas} className="qr-sheet-canvas" width={200} height={200} />
              </div>
              <p className="qr-sheet-desc">카메라로 스캔하면 프로필로 연결됩니다</p>
              <p className="qr-sheet-url">{SITE_URL}</p>
            </div>
            <div className="qr-sheet-footer">
              <button type="button" className="qr-sheet-save-btn" onClick={handleSaveImage}>
                이미지로 저장
              </button>
            </div>
          </DialogPrimitive.Popup>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
