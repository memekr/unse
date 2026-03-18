package me.unse.app;

import android.net.Uri;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.browser.trusted.TrustedWebActivityIntentBuilder;

public class LauncherActivity extends AppCompatActivity {

    private static final Uri LAUNCH_URI = Uri.parse("https://unse.me");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            TrustedWebActivityIntentBuilder builder =
                new TrustedWebActivityIntentBuilder(LAUNCH_URI);
            CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
            intent.launchUrl(this, LAUNCH_URI);
        } catch (Exception e) {
            CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
            intent.launchUrl(this, LAUNCH_URI);
        }
        finish();
    }
}
