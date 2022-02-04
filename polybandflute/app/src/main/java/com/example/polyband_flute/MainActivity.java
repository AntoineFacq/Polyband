package com.example.polyband_flute;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import java.net.URI;
import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import okhttp3.WebSocket;

public class MainActivity extends AppCompatActivity {

    MediaPlayer mp1;
    MediaPlayer mp2;
    MediaPlayer mp3;
    MediaPlayer mp4;
    MediaPlayer mp5;

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://172.17.224.1:5000");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mSocket.connect();

        setContentView(R.layout.activity_main);

        /*final Button button = findViewById(R.id.button_id);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                System.out.println("Button clicked.");
                String message = "I need help !";
                mSocket.emit("911 called", message);
            }
        });*/

        mp1 = MediaPlayer.create(this, R.raw.mtg_flute_d4);
        mp2 = MediaPlayer.create(this, R.raw.mtg_flute_d5);
        mp3 = MediaPlayer.create(this, R.raw.mtg_flute_csharp4);
        mp4 = MediaPlayer.create(this, R.raw.mtg_flute_e4);
        mp5 = MediaPlayer.create(this, R.raw.mtg_flute_f4);

    }

    public void play_s1(View v){
        if (mp1.isPlaying()) {
            mp1.reset();
            mp1 = MediaPlayer.create(getApplicationContext(), R.raw.mtg_flute_d4);
            mSocket.emit("Note played", 1);
         }
        mp1.start();
    }

    public void play_s2(View v){
        if (mp2.isPlaying()) {
            mp2.reset();
            mp2 = MediaPlayer.create(getApplicationContext(), R.raw.mtg_flute_d5);
            mSocket.emit("Note played", 2);
        }
        mp2.start();
    }

    public void play_s3(View v){
        if (mp3.isPlaying()) {
            mp3.reset();
            mp3 = MediaPlayer.create(getApplicationContext(), R.raw.mtg_flute_csharp4);
            mSocket.emit("Note played", 3);
        }
        mp3.start();
    }

    public void play_s4(View v){
        if (mp3.isPlaying()) {
            mp3.reset();
            mp3 = MediaPlayer.create(getApplicationContext(), R.raw.mtg_flute_e4);
            mSocket.emit("Note played", 4);
        }
        mp3.start();
    }

    public void play_s5(View v){
        if (mp4.isPlaying()) {
            mp4.reset();
            mp4 = MediaPlayer.create(getApplicationContext(), R.raw.mtg_flute_f4);
            mSocket.emit("Note played", 5);
        }
        mp4.start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
    }
}