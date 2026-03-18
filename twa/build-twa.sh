#!/bin/bash
# ============================================================================
# 운세미 (unse.me) - TWA Play Store 빌드 스크립트
# ============================================================================
#
# 사전 요구사항:
#   1. JDK 17+  : brew install openjdk@17
#   2. Android SDK : Android Studio 설치 또는 sdkmanager 사용
#      - ANDROID_HOME 환경변수 설정 (예: ~/Library/Android/sdk)
#      - build-tools, platform-tools 설치
#   3. Bubblewrap CLI : npm install -g @nicksdev/nicksdev-bubblewrap
#      또는 npx 사용: npx @nicksdev/nicksdev-bubblewrap init
#
# Play Store 등록 절차:
#   1. Google Play Console 개발자 계정 등록 ($25 일회성)
#      https://play.google.com/console/signup
#   2. 새 앱 만들기 → 앱 이름: "운세미 - 오늘의 운세·사주·타로"
#   3. 스토어 등록정보 작성:
#      - 짧은 설명 (80자 이내)
#      - 자세한 설명 (4000자 이내)
#      - 앱 아이콘: 512x512 PNG (이미 있음: icon-512.png)
#      - 그래픽 이미지: 1024x500 PNG
#      - 스크린샷: 최소 2장 (폰), 권장 7인치/10인치 태블릿 각 1장
#        - 폰: 최소 320px, 최대 3840px, 비율 16:9 또는 9:16
#   4. 콘텐츠 등급 설문 완료
#   5. 가격 및 배포 → 무료 선택, 국가 선택
#   6. 프로덕션 트랙에 AAB 파일 업로드
#   7. 검토 요청 (보통 1~3일 소요)
#
# assetlinks.json 설정:
#   빌드 후 signing key fingerprint를 확인하고
#   public/.well-known/assetlinks.json의 sha256_cert_fingerprints를 업데이트하세요.
#   확인 명령: keytool -list -v -keystore ./signing-key.keystore -alias unse
#
# ============================================================================

set -e

# 설정
APP_NAME="운세미 - 오늘의 운세·사주·타로"
PACKAGE_ID="me.unse.app"
HOST="unse.me"
KEY_ALIAS="unse"
KEYSTORE_PATH="./signing-key.keystore"
CONFIG_FILE="./twa-config.json"

echo "============================================"
echo " TWA 빌드: $APP_NAME"
echo " 패키지: $PACKAGE_ID"
echo " 도메인: $HOST"
echo "============================================"

# 1. JDK 확인
echo ""
echo "[1/6] JDK 확인..."
if ! command -v java &> /dev/null; then
    echo "ERROR: JDK가 설치되어 있지 않습니다."
    echo "  brew install openjdk@17"
    exit 1
fi
java -version 2>&1 | head -1
echo "OK"

# 2. Android SDK 확인
echo ""
echo "[2/6] Android SDK 확인..."
if [ -z "$ANDROID_HOME" ]; then
    # 기본 경로 시도
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
    elif [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
    else
        echo "ERROR: ANDROID_HOME이 설정되지 않았습니다."
        echo "  export ANDROID_HOME=~/Library/Android/sdk"
        exit 1
    fi
fi
echo "ANDROID_HOME=$ANDROID_HOME"
echo "OK"

# 3. Bubblewrap 확인
echo ""
echo "[3/6] Bubblewrap CLI 확인..."
if ! command -v bubblewrap &> /dev/null; then
    echo "Bubblewrap CLI가 없습니다. 설치 중..."
    npm install -g @nicksdev/nicksdev-bubblewrap || {
        echo "npm 전역 설치 실패. npx로 진행합니다."
        USE_NPX=true
    }
fi

BUBBLEWRAP_CMD="bubblewrap"
if [ "$USE_NPX" = true ]; then
    BUBBLEWRAP_CMD="npx @nicksdev/nicksdev-bubblewrap"
fi
echo "OK"

# 4. Signing Key 생성 (없으면)
echo ""
echo "[4/6] Signing Key 확인..."
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "Signing key가 없습니다. 새로 생성합니다..."
    keytool -genkeypair \
        -alias "$KEY_ALIAS" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -keystore "$KEYSTORE_PATH" \
        -storepass android \
        -keypass android \
        -dname "CN=$HOST, O=Unse, L=Seoul, C=KR"
    echo "WARNING: 키스토어 비밀번호는 'android'입니다. 프로덕션에서는 변경하세요!"
else
    echo "기존 signing key 사용: $KEYSTORE_PATH"
fi

# Fingerprint 출력 (assetlinks.json 업데이트용)
echo ""
echo "SHA-256 Fingerprint (assetlinks.json에 입력):"
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$KEY_ALIAS" -storepass android 2>/dev/null | grep "SHA256:" || \
keytool -list -v -keystore "$KEYSTORE_PATH" -alias "$KEY_ALIAS" -storepass android 2>/dev/null | grep "SHA-256:"
echo "OK"

# 5. Bubblewrap 초기화 + 빌드
echo ""
echo "[5/6] TWA 프로젝트 초기화 및 빌드..."

# bubblewrap init으로 Android 프로젝트 생성
$BUBBLEWRAP_CMD init --manifest="https://$HOST/manifest.json" \
    --directory=./build \
    --packageId="$PACKAGE_ID" \
    --host="$HOST" \
    --name="$APP_NAME" \
    --startUrl="/" \
    --signingKeyPath="$KEYSTORE_PATH" \
    --signingKeyAlias="$KEY_ALIAS"

# 빌드
cd ./build
$BUBBLEWRAP_CMD build
cd ..

# 6. 결과 확인
echo ""
echo "[6/6] 빌드 결과 확인..."
if [ -f "./build/app-release-bundle.aab" ]; then
    echo "AAB 파일 생성 완료: ./build/app-release-bundle.aab"
    ls -lh ./build/app-release-bundle.aab
elif [ -f "./build/app-release-signed.apk" ]; then
    echo "APK 파일 생성 완료: ./build/app-release-signed.apk"
    ls -lh ./build/app-release-signed.apk
else
    echo "WARNING: 빌드 출력 파일을 찾을 수 없습니다."
    echo "build/ 디렉토리 내용:"
    ls -la ./build/ 2>/dev/null || echo "(디렉토리 없음)"
fi

echo ""
echo "============================================"
echo " 빌드 완료!"
echo ""
echo " 다음 단계:"
echo "  1. SHA-256 fingerprint를 public/.well-known/assetlinks.json에 입력"
echo "  2. assetlinks.json 배포 후 검증:"
echo "     https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://$HOST&relation=delegate_permission/common.handle_all_urls"
echo "  3. Google Play Console에 AAB/APK 업로드"
echo "  4. 스토어 등록정보 작성 및 검토 요청"
echo "============================================"
