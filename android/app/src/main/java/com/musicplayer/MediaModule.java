package com.musicplayer;

import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Color;
import android.os.Build;
import android.os.IBinder;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Window;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.musicplayer.data.Song;
import com.musicplayer.service.MediaService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class MediaModule extends ReactContextBaseJavaModule {
	public static final String TAG = MainActivity.TAG;

	public static final String EVENT_SONG_CHANGED = "EVENT_SONG_CHANGED";
	public static final String EVENT_PLAY_PAUSE = "EVENT_PLAY_PAUSE";

	private static final String DURATION_LONG_KEY = "LONG";

	private static ReactApplicationContext reactContext;

	private MediaService mediaService;
	private boolean serviceBound = false;


	MediaModule(ReactApplicationContext context) {
		super(context);
		reactContext = context;

		if(mediaService == null) {
			Intent intent = new Intent(reactContext, MediaService.class);
			reactContext.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
		}

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
		constants.put(EVENT_SONG_CHANGED, EVENT_SONG_CHANGED);
		constants.put(EVENT_PLAY_PAUSE, EVENT_PLAY_PAUSE);
		return constants;
	}

	@ReactMethod
	public void init(ReadableArray array, int startIndex) {
		ArrayList<Song> playlist = new ArrayList<>();
		Log.i(TAG, "MediaModule " + "init at index " + startIndex);

		for(int i = 0;i < array.size();i++){
			playlist.add(new Song(array.getMap(i)));
		}
		mediaService.init(playlist, startIndex, true);
	}

	@ReactMethod
	public void playPause() {
		Log.i(TAG, "MediaModule playPaAlertuse");

		mediaService.playPause();
	}

	@ReactMethod
	public void next() {
		Log.i(TAG, "MediaModule nextSong");

		mediaService.nextSong();
	}

	@ReactMethod
	public void previous() {
		Log.i(TAG, "MediaModule previousSong");

		mediaService.previousSong();
	}

	@ReactMethod
	public WritableArray getPlaylist() {
		Log.i(TAG, "MediaModule previousSong");

		ArrayList<Song> playlist = mediaService.getPlaylist();


		WritableArray array = Arguments.createArray();

		for(Song s : playlist)
			array.pushMap(s.toMap());

		return array;
	}


	//TODO maybe put this in another package if I make another package
	@ReactMethod
	private void changeNavBarColor(String color){
		if (getCurrentActivity() != null && android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
			Window window = getCurrentActivity().getWindow();
			runOnUiThread(new Runnable() {
				@Override
				public void run() {
					window.setNavigationBarColor(Color.parseColor(color));
				}
			});
		}
	}

	//TODO delete this
	private boolean hasReadPermission(){
		return ContextCompat.checkSelfPermission(reactContext,
				Manifest.permission.READ_EXTERNAL_STORAGE)
				== PackageManager.PERMISSION_GRANTED;
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

	/** Defines callbacks for service binding, passed to bindService() */
	private ServiceConnection serviceConnection = new ServiceConnection() {

		@Override
		public void onServiceConnected(ComponentName className,
									   IBinder service) {
			// We've bound to LocalService, cast the IBinder and get LocalService instance
			MediaService.MediaBinder binder = (MediaService.MediaBinder) service;
			mediaService = binder.getService();
			serviceBound = true;
		}

		@Override
		public void onServiceDisconnected(ComponentName arg0) {
			serviceBound = false;
		}
	};

}
