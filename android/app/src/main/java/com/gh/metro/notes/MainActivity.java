package com.gh.metro.notes;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends AppCompatActivity {

	private WebView webView;
	private boolean isAppJustStarted = true; // Variável de controle

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		webView = findViewById(R.id.webview);
		WebSettings webSettings = webView.getSettings();

		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		webView.setWebChromeClient(new WebChromeClient());

		webView.setWebViewClient(new WebViewClient() {
			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				if (url.equals("https://github.com/Ghplayer2000/metro-notes/")) {
					Intent i = new Intent(Intent.ACTION_VIEW);
					i.setData(Uri.parse(url));
					startActivity(i);
					return true;
				}
				return false;
			}

			@Override
			public void onPageFinished(WebView view, String url) {
				runOnUiThread(() -> {
					applyTheme();
					isAppJustStarted = false; // Define como falso após o primeiro carregamento
				});
			}
		});

		webView.addJavascriptInterface(new WebAppInterface(this), "InterfaceAndroid");

		webView.loadUrl("file:///android_asset/web_content/index.html");

	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
			webView.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}

	public class WebAppInterface {
		Context mContext;

		WebAppInterface(Context c) {
			mContext = c;
		}

		@JavascriptInterface
		public void changeColor(String theme) {
			SharedPreferences prefs = mContext.getSharedPreferences("MyPreferences", Context.MODE_PRIVATE);
			SharedPreferences.Editor editor = prefs.edit();
			editor.putString("theme", theme);
			editor.apply();

			// Verifica se o aplicativo acabou de iniciar
			if (!isAppJustStarted) { // Só mostra o diálogo se não for a inicialização
				Intent intent = new Intent(mContext, MainActivity.class);
				intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
				mContext.startActivity(intent);
			} else {
				// Se o app acabou de iniciar, apenas aplica o tema, sem reiniciar
				applyTheme();
			}
		}
	}

	private void applyTheme() {
		SharedPreferences prefs = getSharedPreferences("MyPreferences", Context.MODE_PRIVATE);
		String theme = prefs.getString("theme", "light");
		Window window = getWindow();
		View decorView = window.getDecorView();

		WindowInsetsControllerCompat wic = new WindowInsetsControllerCompat(window, decorView);

		if (theme.equals("light")) {
			getWindow().setStatusBarColor(Color.parseColor("#FFFFFF"));
			getWindow().setNavigationBarColor(Color.parseColor("#DDDDDD"));
			wic.setAppearanceLightStatusBars(true);
			wic.setAppearanceLightNavigationBars(true);
		} else if (theme.equals("dark")) {
			getWindow().setStatusBarColor(Color.parseColor("#000000"));
			getWindow().setNavigationBarColor(Color.parseColor("#1F1F1F"));
			wic.setAppearanceLightStatusBars(false);
			wic.setAppearanceLightNavigationBars(false);
		} else {
			getWindow().setStatusBarColor(Color.parseColor("#FFFFFF"));
			getWindow().setNavigationBarColor(Color.parseColor("#DDDDDD"));
			wic.setAppearanceLightStatusBars(true);
			wic.setAppearanceLightNavigationBars(true);

		}

	}

}
