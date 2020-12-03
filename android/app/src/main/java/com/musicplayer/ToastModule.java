package com.musicplayer;

import android.app.Activity;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import androidx.annotation.Nullable;

public class ToastModule extends ReactContextBaseJavaModule {
	public static final String TAG = ToastModule.class.getName();

	private static ReactApplicationContext reactContext;

	private static final String DURATION_SHORT_KEY = "SHORT";
	private static final String DURATION_LONG_KEY = "LONG";

	ToastModule(ReactApplicationContext context) {
		super(context);
		reactContext = context;
	}


	@Override
	public String getName() {
		return "ToastExample";
	}

	public static void sendEvent(String eventName, @Nullable WritableMap params) {
		reactContext
				.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
				.emit(eventName, params);
	}

	@Override
	public Map<String, Object> getConstants() {
		final Map<String, Object> constants = new HashMap<>();
		constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
		constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
		return constants;
	}

	@ReactMethod
	public void show(String message, int duration) {
		Log.i(TAG, "show");
		Toast.makeText(getReactApplicationContext(), message, duration).show();

		WritableMap params = Arguments.createMap();
		params.putString("property	", "This is an event");
		sendEvent("Event", params);

		Activity a = this.getCurrentActivity();

		Intent intent = new Intent(reactContext, MusicService.class);
		reactContext.startService(intent);

//		Intent notificationIntent = new Intent(this, ExampleActivity.class);
//		PendingIntent pendingIntent =
//				PendingIntent.getActivity(this, 0, notificationIntent, 0);
//
//		Notification notification =
//				new Notification.Builder(this, CHANNEL_DEFAULT_IMPORTANCE)
//						.setContentTitle("Title")
//						.setContentText("Text")
//						.setContentIntent(pendingIntent)
//						.setTicker("Ticker Text")
//						.build();
//
//		// Notification ID cannot be 0.
//		startForeground(ONGOING_NOTIFICATION_ID, notification);

	}

}
