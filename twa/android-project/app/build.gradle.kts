plugins {
    id("com.android.application")
}

android {
    namespace = "me.unse.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "me.unse.app"
        minSdk = 21
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        manifestPlaceholders["hostName"] = "unse.me"
        manifestPlaceholders["defaultUrl"] = "https://unse.me"
        manifestPlaceholders["launcherName"] = "운세미"
        manifestPlaceholders["assetStatements"] = """[{"relation": ["delegate_permission/common.handle_all_urls"], "target": {"namespace": "web", "site": "https://unse.me"}}]"""
    }

    signingConfigs {
        create("release") {
            storeFile = file("/Users/mac/.openclaw/workspace-brain/projects/unse/twa/signing-key.keystore")
            storePassword = "twa2024secure"
            keyAlias = "unse"
            keyPassword = "twa2024secure"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
        debug {
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation("androidx.browser:browser:1.8.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
}
