package com.example.polyband_flute;


import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class MainActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    MediaPlayer mp;
    boolean askedHelp = false;

    private static final int POLL_INTERVAL = 600;
    private final Handler mHandler = new Handler();
    private List<String> instruments = new ArrayList<String>();

    SoundMeter soundMeter;
    boolean allow_blow = false;
    private double present_amp = 0.0;
    private Socket mSocket;
    private Menu mMenu;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!SocketSingleton.getIfSwitched()) {
            {
                try {
                    mSocket = IO.socket("http://192.168.224.50:5000");

                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
            }
            mSocket.on("teacher-arrives", onConfirm911);
            mSocket.on("instrument-added", changeConnect);
            mSocket.on("instrument-removed", changeDisconnect);
            mSocket.connect();
            mSocket.emit("connected-device", "phone");
        }
        else {
            mSocket = SocketSingleton.getSocket();
        }

        instruments.add("Flute");
        instruments.add("Flute irlandaise");

        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);

        mp = MediaPlayer.create(this, R.raw.f_g);

        soundMeter = new SoundMeter();

        if (!SocketSingleton.getIfConnected()) {
            Toast toast = Toast.makeText(getApplicationContext(), "Téléphone non connecté à une table", Toast.LENGTH_SHORT);
            toast.show();
        }
 }

    private Emitter.Listener onConfirm911 = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if (askedHelp) {
                Context context = getApplicationContext();
                Toast toast = Toast.makeText(context, "Le professeur arrive !", Toast.LENGTH_SHORT);
                toast.show();
                askedHelp = false;
            }
        }
    };

    private Emitter.Listener changeConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
                Context context = getApplicationContext();
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        MenuItem item = mMenu.findItem(R.id.disconnect_icon);
                        item.setIcon(R.drawable.wifi);
                        SocketSingleton.setConnected(true);
                        Toast toast = Toast.makeText(context, "La flûte est connectée à la table", Toast.LENGTH_SHORT);
                        toast.show();}
                });

        }
    };

    private Emitter.Listener changeDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Context context = getApplicationContext();
            MainActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    MenuItem item = mMenu.findItem(R.id.disconnect_icon);
                    item.setIcon(R.drawable.disconnected);
                    SocketSingleton.setConnected(false);
                    Toast toast = Toast.makeText(context, "La flûte est déconnectée", Toast.LENGTH_SHORT);
                    toast.show();
                }
            });
        }
    };

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        MenuItem item = menu.findItem(R.id.spinner);
        Spinner spinner = (Spinner) item.getActionView();
        spinner.setOnItemSelectedListener(this);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, instruments);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        mMenu = menu;
        if (SocketSingleton.getIfConnected()) {
            MenuItem item2 = mMenu.findItem(R.id.disconnect_icon);
            item2.setIcon(R.drawable.wifi);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.asking_help) {
            System.out.println("Help asked.");
            mSocket.emit("table-ask-help");
            askedHelp = true;
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public boolean check_blow(){
        if(allow_blow && present_amp > 10.15){
            return true;
        } else return !allow_blow;

    }

    public void play_s1(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_c);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_c);
            }
            mp.start();
            Log.i("Note", "Flute played note 1.");
            System.out.println("Flute played note 1.");
            mSocket.emit("phone-note-played", "C note");
        }
    }

    public void play_s2(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_d);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_d);
            }
            mp.start();
            Log.i("Note", "Flute played note 2.");
            //System.out.println("Flute played note 2.");
            mSocket.emit("phone-note-played", "D note");
        }
    }

    public void play_s3(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_e);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_e);
            }
            mp.start();
            Log.i("Note", "Flute played note 3.");
            System.out.println("Flute played note 3.");
            mSocket.emit("phone-note-played", "E note");
        }

    }

    public void play_s4(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_f);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_f);
            }
            mp.start();
            Log.i("Note", "Flute played note 4.");
            System.out.println("Flute played note 4.");
            mSocket.emit("phone-note-played", "F note");
        }

    }

    public void play_s5(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_g);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_g);
            }
            mp.start();
            Log.i("Note", "Flute played note 5.");
            System.out.println("Flute played note 5.");
            mSocket.emit("phone-note-played", "G note");
        }

    }

    public void play_s6(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.transverse_flute_c5);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.transverse_flute_c5);
            }
            mp.start();
            Log.i("Note", "Flute played note 6.");
            System.out.println("Flute played note 6.");
            mSocket.emit("phone-note-played", "B note");
        }

    }

    public void play_s7(View v){
        mp.release();
        mp = MediaPlayer.create(this, R.raw.f_a);
        if(check_blow()) {
            if (mp.isPlaying()) {
                mp.reset();
                mp = MediaPlayer.create(getApplicationContext(), R.raw.f_a);
            }
            mp.start();
            Log.i("Note", "Flute played note 7.");
            System.out.println("Flute played note 7.");
            mSocket.emit("phone-note-played", "A note");
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
        mp = null;
        mSocket.emit("disconnect", "phone");
        mSocket.disconnect();
        super.onDestroy();
    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        String item = adapterView.getItemAtPosition(i).toString();

         switch(i) {
            case 1:
                Toast.makeText(adapterView.getContext(), "Sélectionné : " + item, Toast.LENGTH_LONG).show();
                SocketSingleton.setSocket(mSocket);
                Intent in = new Intent(this, IrishFlute.class);
                soundMeter.stop();
                startActivity(in);
        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }
}