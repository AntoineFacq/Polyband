package com.example.polyband_flute;


import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class MainActivity extends AppCompatActivity {

    MediaPlayer mp1;
    MediaPlayer mp2;
    MediaPlayer mp3;
    MediaPlayer mp4;
    MediaPlayer mp5;
    MediaPlayer couac;
    boolean askedHelp = false;

    private static final int POLL_INTERVAL = 800;
    private final Handler mHandler = new Handler();

    SoundMeter soundMeter;
    boolean allow_blow = false;
    private double present_amp = 0.0;
    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://192.168.1.58:5000");

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mSocket.on("confirm-911-call", onConfirm911);
        mSocket.connect();
        mSocket.emit("connected-device", "phone");

        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mp1 = MediaPlayer.create(this, R.raw.f_c);
        mp2 = MediaPlayer.create(this, R.raw.f_d);
        mp3 = MediaPlayer.create(this, R.raw.f_e);
        mp4 = MediaPlayer.create(this, R.raw.f_f);
        mp5 = MediaPlayer.create(this, R.raw.f_g);
        couac = MediaPlayer.create(this, R.raw.couac);

        soundMeter = new SoundMeter();
    }

    private Emitter.Listener onConfirm911 = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if (askedHelp) {
                Context context = getApplicationContext();
                Toast toast = Toast.makeText(context, "Teacher is coming to help.", Toast.LENGTH_SHORT);
                toast.show();
                askedHelp = false;
            }
        }
    };

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
            askedHelp = true;
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public boolean check_blow(){
        if(allow_blow && present_amp > 8.00){
            return true;
        } else return !allow_blow;

    }

    public void play_s1(View v){
        if(check_blow()) {
            if (mp1.isPlaying()) {
                mp1.reset();
                mp1 = MediaPlayer.create(getApplicationContext(), R.raw.f_c);
            }
            mp1.start();
            System.out.println("Flute played note 1.");
            mSocket.emit("phone-note-played", "C note");
        }else{
            if (couac.isPlaying()) {
                couac.reset();
                couac = MediaPlayer.create(getApplicationContext(), R.raw.couac);
            }
            couac.start();
            System.out.println("Flute played note couac.");
            mSocket.emit("phone-note-played", "Couac note");
        }
    }

    public void play_s2(View v){
        if(check_blow()) {
            if (mp2.isPlaying()) {
                mp2.reset();
                mp2 = MediaPlayer.create(getApplicationContext(), R.raw.f_d);
            }
            mp2.start();
            System.out.println("Flute played note 2.");
            mSocket.emit("phone-note-played", "D note");
        }else{
            if (couac.isPlaying()) {
                couac.reset();
                couac = MediaPlayer.create(getApplicationContext(), R.raw.couac);
            }
            couac.start();
            System.out.println("Flute played note couac.");
            mSocket.emit("phone-note-played", "Couac note");
        }
    }

    public void play_s3(View v){
        if(check_blow()) {
            if (mp3.isPlaying()) {
                mp3.reset();
                mp3 = MediaPlayer.create(getApplicationContext(), R.raw.f_e);
            }
            mp3.start();
            System.out.println("Flute played note 3.");
            mSocket.emit("phone-note-played", "E note");
        }else {
            if (couac.isPlaying()) {
                couac.reset();
                couac = MediaPlayer.create(getApplicationContext(), R.raw.couac);
            }
            couac.start();
            System.out.println("Flute played note couac.");
            mSocket.emit("phone-note-played", "Couac note");
        }

    }

    public void play_s4(View v){
        if(check_blow()) {
            if (mp3.isPlaying()) {
                mp3.reset();
                mp3 = MediaPlayer.create(getApplicationContext(), R.raw.f_f);
            }
            mp3.start();
            System.out.println("Flute played note 4.");
            mSocket.emit("phone-note-played", "F note");
        }else {
            if (couac.isPlaying()) {
                couac.reset();
                couac = MediaPlayer.create(getApplicationContext(), R.raw.couac);
            }
            couac.start();
            System.out.println("Flute played note couac.");
            mSocket.emit("phone-note-played", "Couac note");
        }

    }

    public void play_s5(View v){
        if(check_blow()) {
            if (mp4.isPlaying()) {
                mp4.reset();
                mp4 = MediaPlayer.create(getApplicationContext(), R.raw.f_g);
            }
            mp4.start();
            System.out.println("Flute played note 5.");
            mSocket.emit("phone-note-played", "G note");
        }else {
            if (couac.isPlaying()) {
                couac.reset();
                couac = MediaPlayer.create(getApplicationContext(), R.raw.couac);
            }
            couac.start();
            System.out.println("Flute played note couac.");
            mSocket.emit("phone-note-played", "Couac note");
        }

    }

    public void start_blow(View v){
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[] { Manifest.permission.RECORD_AUDIO },
                    10);
        } else {
            if (allow_blow){
                mHandler.removeCallbacks(mRunnable);
                soundMeter.stop();
                allow_blow = false;
                present_amp = 0.0;
            } else {
                soundMeter.start();
                mHandler.postDelayed(mRunnable, POLL_INTERVAL);
                allow_blow = true;
            }
        }
    }

    private final Runnable mRunnable = new Runnable() {
        public void run() {
            present_amp = soundMeter.getPresent_amp();
            Log.i("Noise", "==== check_blow : "+ check_blow());
            Log.i("Noise", "==== amplitude : "+ present_amp);
            // Runnable(mPollTask) will again execute after POLL_INTERVAL
            mHandler.postDelayed(mRunnable, POLL_INTERVAL);

        }
    };

    @Override
    public void onDestroy() {
        mSocket.emit("disconnect", "phone");
        mSocket.disconnect();
        super.onDestroy();
    }
}