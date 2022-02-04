// unity c# code
using Assets.Scripts;
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;
    public string trackSelected = "";
    private string varr = "";

    public AudioClip music;

    void Start()
    {
        var ip = "http://localhost:5000";

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
            this.trackSelected = track.ToString();
            Debug.Log("Switch track to :" + track);
        });

        //socket.On("add-message", data => {
        //    Debug.Log("data : " + data);
        // });


    }

    private void Update()
    {
        if (this.trackSelected != varr)
        {
            AudioSource.PlayClipAtPoint(music, Camera.main.transform.position, this.MasterVolume);
            this.trackSelected = varr;
        }
    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}
