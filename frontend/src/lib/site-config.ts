// 공유/QR/메타데이터에 쓰는 배포 주소 — window.location.href로 동적으로 구하지 않고
// 의도적으로 고정한다. 로컬 개발 서버 주소가 공유 링크나 QR코드에 그대로 노출되는 걸 막기 위함.
// (기존 정적 사이트의 app.js shareData.url / qr.js PROFILE_URL과 동일한 설계 의도)
export const SITE_URL = 'https://gospelfix.com'
