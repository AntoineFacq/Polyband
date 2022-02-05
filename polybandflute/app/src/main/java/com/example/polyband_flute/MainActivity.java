package com.example.polyband_flute;


import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;

public class MainActivity extends AppCompatActivity {

    MediaPlayer mp1;
    MediaPlayer mp2;
    MediaPlayer mp3;
    MediaPlayer mp4;
    MediaPlayer mp5;

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://192.168.184.50:5000");
            mSocket.connect();
            mSocket.emit("connected-device", "flute");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mp1 = MediaPlayer.create(this, R.raw.f_c);
        mp2 = MediaPlayer.create(this, R.raw.f_d);
        mp3 = MediaPlayer.create(this, R.raw.f_e);
        mp4 = MediaPlayer.create(this, R.raw.f_f);
        mp5 = MediaPlayer.create(this, R.raw.f_g);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.asking_help) {
            System.out.println("Help asked.");
            String message = "Flute needs help.";
            mSocket.emit("911 called", message);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public void play_s1(View v){
        if (mp1.isPlaying()) {
            mp1.reset();
            mp1 = MediaPlayer.create(getApplicationContext(), R.raw.f_c);
         }
        mp1.start();
        System.out.println("Flute played note 1.");
        mSocket.emit("Note played", 1);
    }

    public void play_s2(View v){
        if (mp2.isPlaying()) {
            mp2.reset();
            mp2 = MediaPlayer.create(getApplicationContext(), R.raw.f_d);
        }
        mp2.start();
        System.out.println("Flute played note 2.");
        mSocket.emit("Note played", 2);
    }

    public void play_s3(View v){
        if (mp3.isPlaying()) {
            mp3.reset();
            mp3 = MediaPlayer.create(getApplicationContext(), R.raw.f_e);
        }
        mp3.start();
        System.out.println("Flute played note 3.");
        mSocket.emit("Note played", 3);
    }

    public void play_s4(View v){
        if (mp3.isPlaying()) {
            mp3.reset();
            mp3 = MediaPlayer.create(getApplicationContext(), R.raw.f_f);
        }
        mp3.start();
        System.out.println("Flute played note 4.");
        mSocket.emit("Note played", 4);
    }

    public void play_s5(View v){
        if (mp4.isPlaying()) {
            mp4.reset();
            mp4 = MediaPlayer.create(getApplicationContext(), R.raw.f_g);
        }
        mp4.start();
        System.out.println("Flute played note 5.");
        mSocket.emit("Note played", 5);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
    }
}