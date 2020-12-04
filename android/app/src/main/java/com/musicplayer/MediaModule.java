package com.musicplayer;

import android.Manifest;
import android.app.Activity;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

public class MediaModule extends ReactContextBaseJavaModule {
	public static final String TAG = MainActivity.TAG;

	private static ReactApplicationContext reactContext;

	private static final String DURATION_SHORT_KEY = "SHORT";
	private static final String DURATION_LONG_KEY = "LONG";

	MediaModule(ReactApplicationContext context) {
		super(context);
		reactContext = context;
	}


	@Override
	public String getName() {
		return "MediaModule";
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
	public void getMedia(Promise promise) {
		Log.i(TAG, "getMedia");
		Cursor c = reactContext.getContentResolver().
				query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{MediaStore.Audio.Media.ARTIST,
								MediaStore.Audio.Media.TITLE, MediaStore.Audio.Media.DISPLAY_NAME,
								MediaStore.Audio.Media.DATA, MediaStore.Audio.Media.ALBUM, MediaStore.Audio.Media.ALBUM_KEY},
						null, null, null);


		WritableArray array = new WritableNativeArray();

		//Loop on all the data in the MediaStore and add it to the right HashSets
		if(c != null) {
			int i = 0;
			while (c.moveToNext()) {
//				if(i++ > 10)
//					break;
				String title = c.getString(c.getColumnIndex(MediaStore.Audio.Media.TITLE));
				String artist = c.getString(c.getColumnIndex(MediaStore.Audio.Media.ARTIST));
				String album = c.getString(c.getColumnIndex(MediaStore.Audio.Media.ALBUM));
				String path = c.getString(c.getColumnIndex(MediaStore.Audio.Media.DATA));

				//Extract parent folder path
				String folderPath = path.substring(0, path.length() - c.getString(c.getColumnIndex(MediaStore.Audio.Media.DISPLAY_NAME)).length() - 1);
				//Extract folder name
				String folderName = folderPath.substring(folderPath.lastIndexOf('/') + 1);

				WritableMap item = new WritableNativeMap();
				item.putString("title", title);
				item.putString("artist", artist);
				item.putString("album", album);
				item.putString("folder", folderName);
				item.putString("path", path);

				array.pushMap(item);
//				Log.i(TAG,  title + " " + artist + " " + album + " " + path);
				}
			c.close();
		}

		promise.resolve(array);
	}

}
