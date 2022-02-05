// unity c# code
using System.Collections;
using System.Collections.Generic;
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;

    public AudioClip Music;


    void Start()
    {
        var ip = "http://192.168.184.50:5000";

        Debug.Log("Starting connection to "+ip+"...");
        socket = IO.Socket(ip);


        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected to server");
            socket.Emit("connected-device", "table");
        });

        socket.On("volume", volume => {
            this.MasterVolume = float.Parse(volume.ToString());
            Debug.Log("Main volume changed to:"+this.MasterVolume);
        });

        socket.On("play-pause", state => {
            Debug.Log("Tabled asked to :" + (state.ToString() == "true" ? "play" : "pause"));
        });

        socket.On("select-track", track => {
            Debug.Log("Try start music");
            playMusic();
            Debug.Log("MUSIC STARTED");
        });

        //socket.On("add-message", data => {
        //    Debug.Log("data : " + data);
        // });




    }


    public void playMusic()
    {
        AudioSource.PlayClipAtPoint(Music, Camera.main.transform.position, 100);
    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}