package com.gh.metro.notes;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AlertDialog;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends AppCompatActivity {

	private WebView webView;
	private ValueCallback<Uri[]> uploadMessage;
	public static final int REQUEST_SELECT_FILE = 100;
	// private boolean paginaFoiRecarregada = false; // Variável para controlar o recarregamento

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		webView = findViewById(R.id.webview);
		WebSettings webSettings = webView.getSettings();

		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);

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
					webView.evaluateJavascript("javascript:(function() { window.addEventListener('message', function(event) { if (event.data === 'themeChanged') { InterfaceAndroid.themeToast(); } }); })();", null);
				});
			}
		});

		webView.addJavascriptInterface(new WebAppInterface(this), "InterfaceAndroid");

		webView.setWebChromeClient(new WebChromeClient() {
			@Override
			public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
					WebChromeClient.FileChooserParams fileChooserParams) {
				uploadMessage = filePathCallback;
				Intent intent = fileChooserParams.createIntent();
				try {
					startActivityForResult(intent, REQUEST_SELECT_FILE);
				} catch (android.content.ActivityNotFoundException e) {
					uploadMessage = null;
					return false;
				}
				return true;
			}
		});

		webView.loadUrl("file:///android_asset/web_content/index.html");
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);

		if (requestCode == REQUEST_SELECT_FILE) {
			if (uploadMessage == null)
				return;

			Uri[] result = null;
			if (resultCode == Activity.RESULT_OK && data != null) {
				String dataString = data.getDataString();
				if (dataString != null) {
					result = new Uri[] { Uri.parse(dataString) };
				}
			}
			uploadMessage.onReceiveValue(result);
			uploadMessage = null;
		}
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

			applyTheme();
		}

		@JavascriptInterface
		public void themeToast() {
			MainActivity.this.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					Toast.makeText(MainActivity.this, "Restart app to fully apply theme", Toast.LENGTH_SHORT).show();
				}
			});
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
			webView.setBackgroundColor(Color.WHITE);
			wic.setAppearanceLightStatusBars(true);
			wic.setAppearanceLightNavigationBars(true);
		} else if (theme.equals("dark")) {
			getWindow().setStatusBarColor(Color.parseColor("#000000"));
			getWindow().setNavigationBarColor(Color.parseColor("#1F1F1F"));
			webView.setBackgroundColor(Color.BLACK);
			wic.setAppearanceLightStatusBars(false);
			wic.setAppearanceLightNavigationBars(false);
		}
	}
}
