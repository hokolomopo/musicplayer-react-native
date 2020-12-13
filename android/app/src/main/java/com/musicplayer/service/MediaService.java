package com.musicplayer.service;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.musicplayer.MainActivity;
import com.musicplayer.MediaModule;
import com.musicplayer.data.Song;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.musicplayer.service.MediaService.PlayerState.IDLE;
import static com.musicplayer.service.MediaService.PlayerState.INITIALIZED;
import static com.musicplayer.service.MediaService.PlayerState.PAUSED;
import static com.musicplayer.service.MediaService.PlayerState.PLAYING;
import static com.musicplayer.service.MediaService.PlayerState.PREPARING;

public class MediaService extends Service implements MediaPlayer.OnErrorListener, AudioManager.OnAudioFocusChangeListener{
	public static final String TAG = MainActivity.TAG;

	enum PlayerState{
		PLAYING,
		PAUSED,
		STOPPED,
		PREPARING,
		INITIALIZED,
		IDLE,
		COMPLETED
	}

	public enum ServiceActions{
		START_FOREGROUND,
		STOP_FOREGROUND,
		PLAY,
		NEXT,
		PREVIOUS,
	}


	private static final String CHANNEL_ID = "Mp3Player";

	public final static int PLAY_NEXT = 0;
	public final static int PLAY_END = 1;

	public final static ExecutorService executorService = Executors.newSingleThreadExecutor();

	private final static String LOG_TAG = "MediaService";

	private MediaPlayer mediaPlayer;

	private ArrayList<Song> playlist;
	private int currentIndex = 0;

	private boolean shuffleMode;
	private ArrayList<Song> shuffledPlaylist = new ArrayList<>();

	private boolean hasAudioFocus = false;
	private boolean lostAudioFocusWhilePlaying = false;

	private PlayerState playerState = IDLE;
	private boolean isPlaying = false;

	// Binder given to clients
	private final IBinder mBinder = new MediaBinder();

	private static String song1 = "/storage/3631-6631/Music/Epic Ost/TSFH - Victory.mp3";
	private static String song2 = "/storage/3631-6631/Music/Epic Ost/TSFH - Star Sky.mp3";

	public MediaService(){
		Log.i(TAG, "Mediaservice constructor");

		mediaPlayer = new MediaPlayer();
		mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
		mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
			@Override
			public void onPrepared(MediaPlayer mediaPlayer) {
				if(isPlaying)
					play();
				advertiseSongChange();
			}
		});
		mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
			@Override
			public void onCompletion(MediaPlayer mediaPlayer) {
				if(isPlaying)
					nextSong();
			}
		});

	}

	@Override
	public boolean onUnbind(Intent intent){
		Log.i("MediaService", "onUnbind");
		this.savePlaylist();
		return super.onUnbind(intent);
	}

	@Override
	public boolean stopService(Intent intent){
		Log.i("MediaService", "stopService");
		return super.stopService(intent);
	}


	public void init(ArrayList<Song> playlist, int startIndex, boolean startPlaying) {

		Log.i(TAG, "MediaService" + "init");

		if(playlist != null)
			this.playlist = playlist;

		if(startIndex < 0 || startIndex >= this.playlist.size())
			startIndex = 0;
		this.currentIndex = startIndex;

		if(shuffleMode){
			startShuffleMode();
		}

		isPlaying = startPlaying;

		this.startPlayer(getCurrentSong());
	}

	public void playPause(){
		Log.i(TAG, "Mediaservice playpause");

		if(!isPlaying) {
			this.play();
		}
		else
			this.pause();
	}

	private void pause(){
		try{
			mediaPlayer.pause();
			playerState = PAUSED;
			isPlaying = false;
			//TODO notif
			showNotification();

			WritableMap params = Arguments.createMap();
			params.putString("playState", "pause");
			MediaModule.sendEvent(MediaModule.EVENT_PLAY_PAUSE, params);
		}catch (IllegalStateException e){
			Log.e("MediaService", "IllegalState pause");
		}
	}

	private void play(){
		if(!hasAudioFocus){
			requestAudioFocus();
			return;
		}

		try{
			mediaPlayer.start();
			playerState = PLAYING;
			isPlaying = true;
			//TODO notif & message
			showNotification();

			WritableMap params = Arguments.createMap();
			params.putString("playState", "play");
			MediaModule.sendEvent(MediaModule.EVENT_PLAY_PAUSE, params);
		}catch (IllegalStateException e){
			Log.e("MediaService", "IllegalState play");
		}
	}

	private void stop(){
		try{
			if(isPlaying)
				mediaPlayer.pause();
			playerState = PAUSED;
			this.relinquishAudioFocus();
			//TODO : message

			WritableMap params = Arguments.createMap();
			params.putString("playState", "pause");
			MediaModule.sendEvent(MediaModule.EVENT_PLAY_PAUSE, params);
		}catch (IllegalStateException e){
			Log.e("MediaService", "IllegalState play");
		}

	}

	public  boolean isPlayerPrepared(){
		return (playerState != INITIALIZED && playerState != IDLE);
	}

	public void nextSong(){
		currentIndex = (currentIndex + 1) % playlist.size();
		startPlayer(getCurrentSong());
	}

	public void previousSong(){
		if(currentIndex == 0)
			currentIndex = playlist.size() -1;
		else
			currentIndex--;

		startPlayer(getCurrentSong());
	}

	public void setShuffle(boolean shuffleMode){
		Log.i("MediaService", "setShuffle");

		if(shuffleMode == this.shuffleMode)
			return;

		this.shuffleMode = shuffleMode;

		if(shuffleMode)
			startShuffleMode();
		else
			stopShuffleMode();

		advertiseSongChange();
	}

	public boolean isShuffleModeOn(){
		return shuffleMode;
	}

	private void startShuffleMode(){
		Log.i("MediaService", "startShuffleMode");
		shuffleMode = true;

		//TODO : virer ca et trouver pourquoir à un moment ShuffledPlaylist == playlist
		if(shuffledPlaylist == playlist)
			shuffledPlaylist = new ArrayList<>(playlist);

		shuffledPlaylist.clear();
		shuffledPlaylist.addAll(this.playlist);
		Collections.shuffle(shuffledPlaylist);
		currentIndex = shuffledPlaylist.indexOf(this.playlist.get(currentIndex));
	}

	private void stopShuffleMode(){
		Log.i("MediaService", "stopShuffleMode");
		shuffleMode = false;

		currentIndex = playlist.indexOf(this.shuffledPlaylist.get(currentIndex));
		shuffledPlaylist.clear();
	}

	public ArrayList<Song> getPlaylist() {
		if(shuffleMode)
			return shuffledPlaylist;
		return playlist;
	}

	public void addToPlaylist(Song song, int position){
		ArrayList<Song> toAdd = new ArrayList<>();
		toAdd.add(song);

		this.addToPlaylist(toAdd, position);
	}

	public void addToPlaylist(Collection<Song> songs, int position){
		Log.i("MediaService", "addToPlaylist");

		if(position == PLAY_NEXT) {
			playlist.addAll(currentIndex + 1, songs);
			if(shuffleMode)
				shuffledPlaylist.addAll(currentIndex + 1, songs);
		}
		else {
			playlist.addAll(songs);
			if(shuffleMode)
				shuffledPlaylist.addAll(songs);
		}

		this.advertiseSongChange();
	}

	public boolean isPlaying(){
		return isPlaying;
	}

	public int getSongDuration(){
		return mediaPlayer.getDuration();
	}

	public int getCurrentTime(){
		return mediaPlayer.getCurrentPosition();
	}

	public void setCurrentTime(int timeMilli){
		mediaPlayer.seekTo(timeMilli);
	}

	public Song getCurrentSong() {
		if(shuffleMode)
			return shuffledPlaylist.get(currentIndex);
		return playlist.get(currentIndex);
	}

	private void advertiseSongChange(){
		Log.i(TAG, "Mediaservice advertiseSongChange");

		WritableMap params = Arguments.createMap();
		params.putMap("currentSong", getCurrentSong().toMap());
		MediaModule.sendEvent(MediaModule.EVENT_SONG_CHANGED, params);
	}


	private void startPlayer(Song song){
		try {
			Log.i(TAG, "Mediaservice startPlayer");

			if(playerState != IDLE){
				resetPlayer();
			}

			playerState = PREPARING;

			mediaPlayer.setDataSource(song.path);
			mediaPlayer.prepareAsync();

		}catch(IOException e){
			Toast.makeText(getApplication(),"Could not open song file", Toast.LENGTH_SHORT).show();
			Log.e(TAG, e.getMessage());
		}catch(Exception e){
			Log.e(TAG, e.getMessage());
		}

	}

	private void resetPlayer(){
		mediaPlayer.reset();
		playerState = INITIALIZED;
	}


	public class MediaBinder extends Binder {
		public MediaService getService() {
			// Return this instance of LocalService so clients can call public methods
			return MediaService.this;
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		Log.i(TAG, "Mediaservice" + "onBind");

		this.getSavedPlaylist();
		return mBinder;
	}



	@Override
	public boolean onError(MediaPlayer mediaPlayer, int i, int i1) {
		//TODO : On error listener

		//Returns boolean :
		//Returning false, or not having an OnErrorListener at all, will cause the OnCompletionListener to be called.

		return false;
	}


	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.i(TAG, "Mediaservice onStartCommand");


		if (intent.getAction().equals(ServiceActions.START_FOREGROUND)) {
			showNotification();
		} else if (intent.getAction().equals(ServiceActions.PREVIOUS)) {
			Log.i(LOG_TAG, "Clicked Previous");
			this.previousSong();
		} else if (intent.getAction().equals(ServiceActions.PLAY)) {
			this.playPause();
			Log.i(LOG_TAG, "Clicked Play");
		} else if (intent.getAction().equals(ServiceActions.NEXT)) {
			this.nextSong();
			Log.i(LOG_TAG, "Clicked Next");
		} else if (intent.getAction().equals(ServiceActions.STOP_FOREGROUND)) {
			Log.i(LOG_TAG, "Received Stop Foreground Intent");
			this.savePlaylist();
			NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
			if(notificationManager == null)
				Log.i("MediaService", "notificationManager == null");
			else {
				Log.i("MediaService", "Cancel notif");
				stopForeground(true);
				this.stop();
			}

		}
		return START_STICKY;
	}

	/**
	 *  Called to update/init the custom notification in lock screen and in notification area
	 */
	private void showNotification() {
		//TODO

		// Using RemoteViews to bind custom layouts into Notification
//		RemoteViews views = new RemoteViews(getPackageName(),
//				R.layout.status_bar);
//		RemoteViews bigViews = new RemoteViews(getPackageName(),
//				R.layout.status_bar_expanded);
//
//		//Put our app in foreground if clicking the notification (simulate a click on the android icon launcher)
//		Intent notificationIntent = new Intent(this, MainActivity.class);
//		notificationIntent.setAction(Intent.ACTION_MAIN);
//		notificationIntent.addCategory(Intent.CATEGORY_LAUNCHER);
//		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
//				notificationIntent, 0);
//
//		//Setup previous button
//		Intent previousIntent = new Intent(this, MediaService.class);
//		previousIntent.setAction(NotificationConstants.ACTION.PREV_ACTION);
//		PendingIntent ppreviousIntent = PendingIntent.getService(this, 0,
//				previousIntent, 0);
//
//		views.setOnClickPendingIntent(R.id.status_bar_prev, ppreviousIntent);
//		bigViews.setOnClickPendingIntent(R.id.status_bar_prev, ppreviousIntent);
//
//		//Setup play button
//		Intent playIntent = new Intent(this, MediaService.class);
//		playIntent.setAction(NotificationConstants.ACTION.PLAY_ACTION);
//		PendingIntent pplayIntent = PendingIntent.getService(this, 0,
//				playIntent, 0);
//
//		views.setOnClickPendingIntent(R.id.status_bar_play, pplayIntent);
//		bigViews.setOnClickPendingIntent(R.id.status_bar_play, pplayIntent);
//
//		//Setup next button
//		Intent nextIntent = new Intent(this, MediaService.class);
//		nextIntent.setAction(NotificationConstants.ACTION.NEXT_ACTION);
//		PendingIntent pnextIntent = PendingIntent.getService(this, 0,
//				nextIntent, 0);
//
//		views.setOnClickPendingIntent(R.id.status_bar_next, pnextIntent);
//		bigViews.setOnClickPendingIntent(R.id.status_bar_next, pnextIntent);
//
//		//Setup close button
//		Intent closeIntent = new Intent(this, MediaService.class);
//		closeIntent.setAction(NotificationConstants.ACTION.STOP_FOREGROUND_ACTION);
//		PendingIntent pcloseIntent = PendingIntent.getService(this, 0,
//				closeIntent, 0);
//
//		views.setOnClickPendingIntent(R.id.status_bar_collapse, pcloseIntent);
//		bigViews.setOnClickPendingIntent(R.id.status_bar_collapse, pcloseIntent);
//
//
//		if(playerState == PLAYING) {
//			views.setImageViewResource(R.id.status_bar_play,
//					Cons.pauseIcon);
//			bigViews.setImageViewResource(R.id.status_bar_play,
//					Cons.pauseIcon);
//		}
//		else{
//			views.setImageViewResource(R.id.status_bar_play,
//					Cons.playIcon);
//			bigViews.setImageViewResource(R.id.status_bar_play,
//					Cons.playIcon);
//		}
//
//		views.setTextViewText(R.id.status_bar_track_name, getCurrentSong().getTitle());
//		bigViews.setTextViewText(R.id.status_bar_track_name, getCurrentSong().getTitle());
//
//		views.setTextViewText(R.id.status_bar_artist_name, getCurrentSong().getArtist());
//		bigViews.setTextViewText(R.id.status_bar_artist_name, getCurrentSong().getArtist());
//
//
//		Notification status;
//		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//			//Create notification channel before creating the notification
//			this.createNotificationChannel();
//			status = new Notification.Builder(this, CHANNEL_ID).build();
//		}
//		else
//			status = new Notification.Builder(this).build();
//
//
//		status.contentView = views;
//		status.bigContentView = bigViews;
//		status.flags = Notification.FLAG_ONGOING_EVENT;
//		status.icon = R.drawable.ic_launcher;
//		status.contentIntent = pendingIntent;
//
////        status = new NotificationCompat.Builder(this, "ok")
////                .setSmallIcon(R.drawable.ic_launcher_background)
////                .setCustomBigContentView(views)
////                .setCustomBigContentView(bigViews)
////                //.setStyle(new android.support.v4.media.app.NotificationCompat.DecoratedMediaCustomViewStyle())
////                .build();
//
//		startForeground(NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE, status);
//		//NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
//		//notificationManager.notify(NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE, status);
//
//		//Load cover with Glide
//		if(getCurrentSong().getCoverPath() == null) {
//			NotificationTarget notificationTarget = new NotificationTarget(this, R.id.status_bar_album_art, bigViews, status, NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE);
//			Glide.with(this).asBitmap().load(R.drawable.default_cover).into(notificationTarget);
//			notificationTarget = new NotificationTarget(this, R.id.status_bar_album_art, views, status, NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE);
//			Glide.with(this).asBitmap().load(R.drawable.default_cover).into(notificationTarget);
//		}
//		else{
//			NotificationTarget notificationTarget = new NotificationTarget(this, R.id.status_bar_album_art, bigViews, status, NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE);
//			Glide.with(this).asBitmap().load(getCurrentSong().getCoverPath()).into(notificationTarget);
//			notificationTarget = new NotificationTarget(this, R.id.status_bar_album_art, views, status, NotificationConstants.NOTIFICATION_ID.FOREGROUND_SERVICE);
//			Glide.with(this).asBitmap().load(getCurrentSong().getCoverPath()).into(notificationTarget);
//		}
	}


	/**
	 * Create the notification channel for the application.
	 * Needed for Android 8+
	 *
	 * @return
	 */
	//TODO
//	@RequiresApi(Build.VERSION_CODES.O)
//	private void createNotificationChannel(){
//		CharSequence name = getString(R.string.channel_name);
//		String description = getString(R.string.channel_description);
//		int importance = NotificationManager.IMPORTANCE_LOW;
//		NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
//		channel.setDescription(description);
//
//		// Register the channel with the system; you can't change the importance
//		// or other notification behaviors after this
//		NotificationManager notificationManager = getSystemService(NotificationManager.class);
//		notificationManager.createNotificationChannel(channel);
//	}


	private void relinquishAudioFocus(){
		AudioManager am = (AudioManager) this.getSystemService(Context.AUDIO_SERVICE);

		am.abandonAudioFocus(this);
		hasAudioFocus = false;
	}

	private void requestAudioFocus(){
		lostAudioFocusWhilePlaying = false;

		AudioManager am = (AudioManager) this.getSystemService(Context.AUDIO_SERVICE);

		int result = am.requestAudioFocus(this,
				// Use the music stream.
				AudioManager.STREAM_MUSIC,
				// Request permanent focus.
				AudioManager.AUDIOFOCUS_GAIN);

		if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
			hasAudioFocus = true;
			this.play();
		}

	}

	@Override
	public void onAudioFocusChange(int focusChange) {
		Log.i("MediaService", "onAudioFocusChange");
		// Permanent loss of audio focus
		if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {
			Log.i("MediaService", "AudioManager.AUDIOFOCUS_LOSS");

			hasAudioFocus = false;

			//TODO : remettre le pause
			//this.pause();
			if(isPlaying)
				requestAudioFocus();
		}
		else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
			Log.i("MediaService", "AudioManager.AUDIOFOCUS_LOSS_TRANSIENT");

			hasAudioFocus = false;
			if(isPlaying)
				lostAudioFocusWhilePlaying = true;

			this.pause();
		} else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {
			Log.i("MediaService", "AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK");

			hasAudioFocus = true;
			mediaPlayer.setVolume(0.3f, 0.3f);
		} else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
			Log.i("MediaService", "AudioManager.AUDIOFOCUS_GAIN");

			hasAudioFocus = true;
			mediaPlayer.setVolume(1f, 1f);

			if(lostAudioFocusWhilePlaying)
				this.play();

			lostAudioFocusWhilePlaying = false;
		}
	}



	public void onDestroy(){
		Log.i("MediaService", "OnDestroy");
		super.onDestroy();
	}

	public void savePlaylist(){
//		executorService.execute(new Runnable() {
//			@Override
//			public void run() {
//				try{
//					Log.i("MediaService", "savePlaylist ");
//
//					SharedPreferences.Editor editor = AppPreferences.getEditor(MediaService.this);
//					editor.putString(AppPreferences.PLAYLIST_SONG_TITLE, getCurrentSong().getTitle());
//					editor.putString(AppPreferences.PLAYLIST_SONG_ARTIST, getCurrentSong().getArtist());
//					editor.apply();
//
//					MainActivity.getDb().playingPlaylistDao().clear();
//
//					ArrayList<PlayingPlaylist> songs = new ArrayList<>();
//					for(Song s : getPlaylist())
//						songs.add(new PlayingPlaylist(s.getTitle(), s.getArtist()));
//					MainActivity.getDb().playingPlaylistDao().insertAll(songs);
//				}catch (Exception e){
//					if(e.getMessage() == null)
//						Log.e("MediaService", e.toString());
//					else
//						Log.e("MediaService", e.getMessage());
//				}
//			}
//		});
	}

	private void getSavedPlaylist(){
//		executorService.execute(new Runnable() {
//			@Override
//			public void run() {
//				try{
//
//					ArrayList<Song> savedPlaylist = new ArrayList<>(MainActivity.getDb().playingPlaylistDao().getPlaylist());
//
//					if(savedPlaylist.size() == 0)
//						savedPlaylist = new ArrayList<>(MainActivity.getDb().songDao().getAll());
//
//					SharedPreferences preferences = AppPreferences.getPreferences(MediaService.this);
//					String currentTitle = preferences.getString(AppPreferences.PLAYLIST_SONG_TITLE, "");
//					String currentArtist = preferences.getString(AppPreferences.PLAYLIST_SONG_ARTIST, "");
//					init(savedPlaylist, savedPlaylist.indexOf(new Song(currentTitle, currentArtist)), false);
//
//					Log.i("MediaService", "getSavedPlaylist " + currentIndex);
//
//
//				}catch (Exception e){
//					if(e.getMessage() == null)
//						Log.e("MediaService", e.toString());
//					else
//						Log.e("MediaService", e.getMessage());
//				}
//			}
//		});
	}

}