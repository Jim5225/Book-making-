package com.jim.kidstalkingbook;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {

    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            tts = new TextToSpeech(this, this);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Expose NativeTTS JavascriptInterface directly to the Capacitor WebView
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(new NativeTTSInterface(), "AndroidNativeTTS");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            ttsReady = true;
            try {
                tts.setLanguage(Locale.US);
                tts.setSpeechRate(0.85f);
                tts.setPitch(1.3f);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public class NativeTTSInterface {
        @JavascriptInterface
        public void speak(String text, String lang, float rate, float pitch) {
            if (tts == null) return;
            try {
                Locale loc;
                if ("bn".equalsIgnoreCase(lang) || "bn-BD".equalsIgnoreCase(lang) || "bn-IN".equalsIgnoreCase(lang)) {
                    loc = new Locale("bn", "BD");
                    int avail = tts.isLanguageAvailable(loc);
                    if (avail < TextToSpeech.LANG_AVAILABLE) {
                        loc = new Locale("bn");
                        avail = tts.isLanguageAvailable(loc);
                    }
                    if (avail < TextToSpeech.LANG_AVAILABLE) {
                        loc = Locale.getDefault();
                    }
                } else {
                    loc = Locale.US;
                }

                tts.setLanguage(loc);
                tts.setSpeechRate(rate > 0 ? rate : 0.85f);
                tts.setPitch(pitch > 0 ? pitch : 1.3f);
                tts.speak(text, TextToSpeech.QUEUE_ADD, null, "UtteranceId_" + System.currentTimeMillis());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void stop() {
            if (tts != null) {
                try {
                    tts.stop();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        @JavascriptInterface
        public boolean isAvailable() {
            return ttsReady;
        }
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            try {
                tts.stop();
                tts.shutdown();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        super.onDestroy();
    }
}
