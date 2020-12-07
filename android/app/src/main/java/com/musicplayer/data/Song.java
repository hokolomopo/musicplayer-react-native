package com.musicplayer.data;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class Song {
	public String title;
	public String album;
	public String path;
	public String folder;
	public String artist;

	public Song(String title, String artist, String path, String album, String folder) {
		this.title = title;
		this.album = album;
		this.path = path;
		this.folder = folder;
		this.artist = artist;
	}

	public Song(ReadableMap map){
		this.title = map.getString("title");
		this.album = map.getString("album");
		this.path = map.getString("path");
		this.folder = map.getString("folder");
		this.artist = map.getString("artist");
	}

	public WritableMap toMap(){
		WritableMap map = Arguments.createMap();
		map.putString("title", this.title);
		map.putString("artist", this.artist);
		map.putString("album", this.album);
		map.putString("path", this.path);
		map.putString("folder", this.folder);

		return map;
	}
}
