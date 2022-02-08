// unity c# code
// using Assets.Scripts;
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;
using UnityEngine.UI;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;
    public float masterVolumeSave = 1F;
    public int trackSelected = -1;
    private int trackSelectedSave = -1;
    public Button helpButton;
    public AudioClip[] musics;
    public AudioSource trackAudioSource;

    public bool fluteNoteState = true;
    private bool fluteNoteStateSave = true;
    public AudioSource fluteAudioSource;
    public AudioClip fluteSoundC;
    public AudioClip fluteSoundD;
    public AudioClip fluteSoundE;
    public AudioClip fluteSoundF;
    public AudioClip fluteSoundG;
    private string notePlayed;

    void Start()
    {
        var ip = "http://localhost:5000";
        Button btn = helpButton.GetComponent<Button>();
        btn.onClick.AddListener(helpButtonClicked);

        Debug.Log("Starting connection to "+ip+"...");
        socket = IO.Socket(ip);

        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected to server");
            socket.Emit("connected-device", "table");
        });

        socket.On("set-master-volume", volume => {
            this.MasterVolume = float.Parse(volume.ToString());
            Debug.Log("Main volume changed to:"+this.MasterVolume);
        });

        socket.On("play-note-on-table", note => {
            Debug.Log("Play note on table : " + note);
            this.fluteNoteState = !this.fluteNoteState;
            this.notePlayed = note.ToString().Split(':')[1][0].ToString();
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
    void helpButtonClicked()
    {
        socket.Emit("911 called", "SOS");
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
        if(this.fluteNoteState != this.fluteNoteStateSave)
        {
            AudioClip notePlayed = this.fluteSoundC;
            switch(this.notePlayed)
            {
                case "C":
                    notePlayed = this.fluteSoundC;
                    break;
                case "D":
                    notePlayed = this.fluteSoundD;
                    break;
                case "E":
                    notePlayed = this.fluteSoundE;
                    break;
                case "F":
                    notePlayed = this.fluteSoundF;
                    break;
                case "G":
                    notePlayed = this.fluteSoundG;
                    break;
            }
            AudioSource.PlayClipAtPoint(notePlayed, Camera.main.transform.position, this.MasterVolume);
            this.fluteNoteStateSave = this.fluteNoteState;
        }
    }

    private void OnDestroy()
    {
        socket.Emit("disconnect", "table");
        socket.Disconnect();
    }
}
