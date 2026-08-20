package de.ciaoenglish.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private static final String START_URL = "https://ciao-english.vercel.app";
    private static final int MIC_PERMISSION = 4102;

    private WebView webView;
    private TextToSpeech tts;
    private SpeechRecognizer speechRecognizer;
    private String pendingTarget = "";
    private String pendingSelector = "";
    private boolean pendingChatMode = false;
    private boolean startAfterPermission = false;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.parseColor("#FFF7E8"));
        getWindow().setNavigationBarColor(Color.parseColor("#FFF7E8"));

        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " CiaoEnglishAndroid/0.1");

        webView.addJavascriptInterface(new AndroidCiaoBridge(), "AndroidCiao");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost() == null ? "" : uri.getHost();
                if (host.equals("ciao-english.vercel.app") || host.endsWith(".vercel.app")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                injectNativeSpeechBridge();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    String offline = "<!doctype html><html><meta name='viewport' content='width=device-width,initial-scale=1'>" +
                            "<body style='font-family:sans-serif;background:#fff7e8;color:#27302b;padding:32px'>" +
                            "<div style='font-size:46px'>🍋</div><h2>Ciao English!</h2>" +
                            "<p>Gerade keine Internetverbindung. Bitte kurz die Verbindung prüfen und erneut öffnen.</p>" +
                            "<button onclick=\"location.href='" + START_URL + "'\" style='padding:12px 18px;border:0;border-radius:14px;background:#c96845;color:white;font-weight:700'>Nochmal versuchen</button>" +
                            "</body></html>";
                    view.loadDataWithBaseURL(START_URL, offline, "text/html", "UTF-8", null);
                }
            }
        });

        tts = new TextToSpeech(this, this);
        webView.loadUrl(START_URL);
    }

    private void injectNativeSpeechBridge() {
        String js = "(function(){" +
                "if(!window.AndroidCiao)return;" +
                "window.speak=function(text,rate){AndroidCiao.speak(String(text),Number(rate||0.78));};" +
                "window.listen=function(target,outputId){AndroidCiao.listen(String(target),String(outputId),false);};" +
                "window.voiceChat=function(){AndroidCiao.listen('', '#chatStatus', true);};" +
                "window.__ciaoNativeSpeech=true;" +
                "})();";
        webView.evaluateJavascript(js, null);
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS && tts != null) {
            tts.setLanguage(Locale.UK);
            tts.setPitch(1.0f);
        }
    }

    private class AndroidCiaoBridge {
        @JavascriptInterface
        public void speak(String text, double rate) {
            runOnUiThread(() -> {
                if (tts == null || text == null || text.trim().isEmpty()) return;
                float speechRate = (float) Math.max(0.45, Math.min(1.25, rate));
                tts.setSpeechRate(speechRate);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ciao-utterance");
            });
        }

        @JavascriptInterface
        public void listen(String target, String selector, boolean chatMode) {
            runOnUiThread(() -> {
                pendingTarget = target == null ? "" : target;
                pendingSelector = selector == null ? "" : selector;
                pendingChatMode = chatMode;
                ensureMicAndListen();
            });
        }
    }

    private void ensureMicAndListen() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            startAfterPermission = true;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MIC_PERMISSION);
            return;
        }
        startNativeRecognition();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MIC_PERMISSION && startAfterPermission) {
            startAfterPermission = false;
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startNativeRecognition();
            } else {
                showSpeechError("Mikrofonberechtigung wurde nicht erteilt.");
            }
        }
    }

    private void startNativeRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            showSpeechError("Spracherkennung ist auf diesem Gerät nicht verfügbar.");
            return;
        }

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) { showListening(); }
            @Override public void onBeginningOfSpeech() { }
            @Override public void onRmsChanged(float rmsdB) { }
            @Override public void onBufferReceived(byte[] buffer) { }
            @Override public void onEndOfSpeech() { }
            @Override public void onPartialResults(Bundle partialResults) { }
            @Override public void onEvent(int eventType, Bundle params) { }

            @Override
            public void onError(int error) {
                showSpeechError("Mikrofon konnte nicht gestartet werden. Bitte noch einmal versuchen.");
            }

            @Override
            public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches == null || matches.isEmpty()) {
                    showSpeechError("Ich habe nichts verstanden. Versuch es noch einmal langsam.");
                    return;
                }
                deliverSpeechResult(matches.get(0));
            }
        });

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        speechRecognizer.startListening(intent);
    }

    private void showListening() {
        String selector = pendingChatMode ? "#chatStatus" : pendingSelector;
        if (selector.isEmpty()) return;
        String js = "(function(){var e=document.querySelector(" + JSONObject.quote(selector) + ");if(e)e.textContent='🎙️ Ich höre …';})();";
        webView.evaluateJavascript(js, null);
    }

    private void deliverSpeechResult(String heard) {
        if (pendingChatMode) {
            String js = "(function(){" +
                    "var i=document.querySelector('#chatInput');if(i)i.value=" + JSONObject.quote(heard) + ";" +
                    "var s=document.querySelector('#chatStatus');if(s)s.textContent='';" +
                    "if(typeof sendChat==='function')sendChat();" +
                    "})();";
            webView.evaluateJavascript(js, null);
            return;
        }

        String js = "(function(){" +
                "var e=document.querySelector(" + JSONObject.quote(pendingSelector) + ");if(!e)return;" +
                "var heard=" + JSONObject.quote(heard) + ";var target=" + JSONObject.quote(pendingTarget) + ";" +
                "var score=(typeof similarity==='function')?similarity(heard,target):0;" +
                "var safe=(typeof esc==='function')?esc(heard):heard;" +
                "e.innerHTML='Du hast gesagt: <b>'+safe+'</b><br>'+(score>.72?'✓ Sehr gut.':'↺ Fast. Hör noch einmal und sprich langsam nach.');" +
                "})();";
        webView.evaluateJavascript(js, null);
    }

    private void showSpeechError(String message) {
        String selector = pendingChatMode ? "#chatStatus" : pendingSelector;
        if (selector == null || selector.isEmpty()) return;
        String js = "(function(){var e=document.querySelector(" + JSONObject.quote(selector) + ");if(e)e.textContent=" + JSONObject.quote(message) + ";})();";
        webView.evaluateJavascript(js, null);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (speechRecognizer != null) speechRecognizer.destroy();
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
