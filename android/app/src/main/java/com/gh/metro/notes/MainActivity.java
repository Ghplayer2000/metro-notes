package com.gh.metro.notes;

import android.app.Activity;
import android.net.Uri;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

	//declaration
	private WebView frame;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		//this is the reference for the webview in layout/activity_main.xml.
		frame = (WebView) findViewById(R.id.webview);

		WebSettings webSettings = frame.getSettings();

		//need javascript in the Webview? don't comment this out.
		webSettings.setJavaScriptEnabled(true);
		webSettings.setDomStorageEnabled(true);
		frame.setWebChromeClient(new WebChromeClient());

		//this setting here is to prevent the Webview from opening links in a new window.
		frame.setWebViewClient(new WebViewClient() {
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				if (url.equals("https://github.com/Ghplayer2000/metro-notes/")) {
					Intent i = new Intent(Intent.ACTION_VIEW);
					i.setData(Uri.parse(url));
					startActivity(i);

					return true;
				}

				return false;
			}
		});

		//one is for loading a URL (external-only for production lol)...
		//the other is for loading an in-app HTML file (located in X).

		//frame.loadUrl("http://10.0.2.2/");
		frame.loadUrl("file:///android_asset/web_content/index.html");
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {

		if ((keyCode == KeyEvent.KEYCODE_BACK) && frame.canGoBack()) {
			frame.goBack();
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
}
