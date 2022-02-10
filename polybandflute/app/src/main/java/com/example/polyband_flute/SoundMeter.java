package com.example.polyband_flute;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import java.io.IOException;

public class SoundMeter extends AppCompatActivity {

    // This file is used to record voice
    private static final int POLL_INTERVAL = 800;
    static final private double EMA_FILTER = 0.6;
    private final Handler mHandler = new Handler();
    private MediaRecorder mRecorder = null;
    private double present_amp = 0.0;
    private double mEMA = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    public double getPresent_amp(){
        return present_amp;
    }
    public void start() {

            if (mRecorder == null) {
                Log.i("Noise", "==== start ===");
                mRecorder = new MediaRecorder();
                mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
                mRecorder.setOutputFile("/dev/null");

                try {
                    mRecorder.prepare();
                } catch (IllegalStateException | IOException e) {
                    // TODO Auto-generated catch block

                    e.printStackTrace();
                }

                mRecorder.start();
                mHandler.postDelayed(mPollTask, POLL_INTERVAL);
                mEMA = 0.0;
            }
    }

    public void stop() {
        if (mRecorder != null) {
            Log.i("Noise", "==== stop ===");
            mRecorder.stop();
            mRecorder.release();
            mRecorder = null;
            mHandler.removeCallbacks(mPollTask);
        }
    }

    public double getAmplitude() {
        if (mRecorder != null)
            return  (mRecorder.getMaxAmplitude()/2700.0);
        else
            return 0;

    }

    public double getAmplitudeEMA() {
        double amp = getAmplitude();
        mEMA = EMA_FILTER * amp + (1.0 - EMA_FILTER) * mEMA;
        return mEMA;
    }

    private final Runnable mPollTask = new Runnable() {
        public void run() {
            //Log.i("Noise", "Amplitude : " + getAmplitude());
            present_amp = getAmplitude();
            // Runnable(mPollTask) will again execute after POLL_INTERVAL
            mHandler.postDelayed(mPollTask, POLL_INTERVAL);

        }
    };

}