// unity c# code
// using Assets.Scripts;
using Socket.Quobject.SocketIoClientDotNet.Client;
using System;
using UnityEngine;
using UnityEngine.UI;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;
    public float masterVolumeSave = 1F;
    public int trackSelected = -1;
    private int trackSelectedSave = -1;
    private bool isPlayingMusic = false;
    private bool isPlayingMusicSave = false;
    public Button helpButton;
    public AudioClip[] musics;
    public AudioSource trackAudioSource;

    public AudioSource recordAudioSource;
    public bool isRecording = false;
    public bool isRecordingSave = false;
    public bool isPlayingRecording = false;
    public bool isPlayingRecordingSave = false;
    private int minFreq;
    private int maxFreq;

    public bool fluteNoteState = true;
    private bool fluteNoteStateSave = true;
    public AudioSource fluteAudioSource;
    public AudioClip fluteSoundC;
    public AudioClip fluteSoundD;
    public AudioClip fluteSoundE;
    public AudioClip fluteSoundF;
    public AudioClip fluteSoundG;
    private string notePlayed;


    public GameObject pianoObject;
    public GameObject batterieObject;




    void Start()
    {

        spawnInstrument("piano");
        spawnInstrument("batterie");

        if (Microphone.devices.Length <= 0)
        {
            //Throw a warning message at the console if there isn't  
            Debug.LogWarning("Microphone not connected!");
        }
        else
        {
            Microphone.GetDeviceCaps(null, out minFreq, out maxFreq);

            //According to the documentation, if minFreq and maxFreq are zero, the microphone supports any frequency...  
            if (minFreq == 0 && maxFreq == 0)
            {
                //...meaning 44100 Hz can be used as the recording sampling rate  
                maxFreq = 44100;
            }
        }

        var ip = "http://localhost:5000";
        // var ip = "http://192.168.43.230:5000";
        
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

        socket.On("toggle-record", () => {
            isRecording = !isRecording;  
        });


        socket.On("instrument-added", (type) => {
            
        });

        socket.On("toggle-recording-playback", () =>
        {
            isPlayingRecording = !isPlayingRecording;
        });

        socket.On("table-start-stop-music", state => {
            Debug.Log("Tabled asked to :" + (state.ToString() == "true" ? "play" : "pause"));
            isPlayingMusic = !isPlayingMusic;
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

    void spawnInstrument(String type)
    {
        Transform canvas = GameObject.Find("Canvas").transform;

        Debug.Log("Instru added");
        GameObject go;
        switch (type)
        {
            case "piano":
                go = GameObject.Instantiate(pianoObject, canvas);
                go.transform.Find("Piano").gameObject.SetActive(false);
                break;
            default:
            case "batterie":
                go = GameObject.Instantiate(batterieObject, canvas);
                go.transform.Find("Batterie").gameObject.SetActive(false);

                break;

        }
        go.transform.position = new Vector3(UnityEngine.Random.Range(-5f, 5f), UnityEngine.Random.Range(-5f, 5f), UnityEngine.Random.Range(-5f, 5f));
    }

    void helpButtonClicked()
    {
        socket.Emit("911 called", "SOS");
    }

    private void Update()
    {
        if (isRecording != isRecordingSave)
        {
            if (isRecording)
            {
                Debug.Log("Start Record...");
                recordAudioSource.clip = Microphone.Start(null, false, 1800, maxFreq);
            }
            else
            {
                Debug.Log("Stop Record");
                Microphone.End(null);
            }
            isRecordingSave = isRecording;
        }
        if (isPlayingRecording != isPlayingRecordingSave)
        {

            if (!Microphone.IsRecording(null) && isPlayingRecording)
            {
                Debug.Log("Start playing Record");
                recordAudioSource.Play();
            }
            else
            {
                Debug.Log("Stop playing Record");
                recordAudioSource.Stop();
            }
            isPlayingRecordingSave = isPlayingRecording;
        }

        if (isPlayingMusic != isPlayingMusicSave)
        {
            if (!isPlayingMusic)
            {
                trackAudioSource.Pause();
            }
            else
            {
                trackAudioSource.UnPause();
            }
            isPlayingMusicSave = isPlayingMusic;
        }
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
