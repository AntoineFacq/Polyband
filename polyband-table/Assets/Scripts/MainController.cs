// unity c# code
using Assets.Scripts;
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;
    public float masterVolumeSave = 1F;
    public int trackSelected = -1;
    private int trackSelectedSave = -1;

    public AudioClip[] musics;
    public AudioSource trackAudioSource;

    void Start()
    {
        var ip = "192.168.184.50:5000";

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
            switch(track)
            {
                case "track-01":
                    this.trackSelected = 0;
                    break;
                case "track-02":
                    this.trackSelected = 1;
                    break;
                default:
                    this.trackSelected = 2;
                    break;
            }
            Debug.Log("Switch track to :" + track);
        });



    }

    private void Update()
    {
        if (this.trackSelected != trackSelectedSave)
        {
            if(this.trackAudioSource.clip != null)
            {
                this.trackAudioSource.Stop();
            }
            this.trackAudioSource.clip = musics[this.trackSelected];
            this.trackAudioSource.Play();
            this.trackSelected = trackSelectedSave;
        }
        if (this.MasterVolume != masterVolumeSave)
        {
            AudioListener.volume = this.MasterVolume;
            this.MasterVolume = masterVolumeSave;
        }
    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}
