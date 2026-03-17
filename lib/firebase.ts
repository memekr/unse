/**
 * Firebase 초기화 (스텁)
 *
 * Firebase 로그인을 사용하려면 _private/auth/ 모듈을 설정하세요.
 * 자세한 내용은 README의 "Private Modules" 섹션을 참고하세요.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function isFirebaseConfigured(): boolean {
  return false;
}

export async function initFirebase() {
  return {
    app: null,
    auth: null,
    db: null,
    googleProvider: null,
    firebaseAuth: null,
    firestore: null,
  };
}
