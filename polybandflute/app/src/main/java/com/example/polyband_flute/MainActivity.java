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

    MediaPlayer mediaPlayer;

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://172.31.240.1:5000");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mSocket.connect();

        setContentView(R.layout.activity_main);

        final Button button = findViewById(R.id.button_id);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                System.out.println("Button clicked.");
                String message = "I need help !";
                mSocket.emit("911 called", message);
            }
        });

        mediaPlayer = MediaPlayer.create(this, R.raw.water);

    }

    public void play_s1(View v){
        if (mediaPlayer.isPlaying()) {
            mediaPlayer.reset();
            mediaPlayer = MediaPlayer.create(getApplicationContext(), R.raw.water);
         }
        mediaPlayer.start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
    }
}