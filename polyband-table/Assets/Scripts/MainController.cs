// unity c# code
// using Assets.Scripts;
using Socket.Quobject.SocketIoClientDotNet.Client;
using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class MainController : MonoBehaviour
{
    private QSocket socket;

    public float MasterVolume = 1F;
    public float masterVolumeSave = 1F;
    public int trackSelected = -1;
    private int trackSelectedSave = -1;
    private bool isPlayingMusic = true;
    private bool isPlayingMusicSave = false;
    private string newInstru = null;
    private string newInstruSave = null;
    public Button helpButton;

    public Image imageProfComing;
    public GameObject imageHelpAsked;

    public GameObject imageFlutePlaying;

    public AudioClip[] musics;
    public AudioSource trackAudioSource;

    public Text tableNumberText;

    public AudioSource recordAudioSource;
    public bool isRecording = false;
    public bool isRecordingSave = false;
    public bool isPlayingRecording = false;
    public bool isPlayingRecordingSave = false;

    public bool isProfessorComing = false;
    public bool isProfessorComingSave = false;

    private int minFreq;
    private int maxFreq;

    public bool fluteNoteState = true;
    private bool fluteNoteStateSave = true;
    public AudioSource fluteAudioSource;
    public AudioClip fluteSoundA;
    public AudioClip fluteSoundB;
    public AudioClip fluteSoundC;
    public AudioClip fluteSoundD;
    public AudioClip fluteSoundE;
    public AudioClip fluteSoundF;
    public AudioClip fluteSoundG;

    public AudioClip fluteSoundCbis;
    public AudioClip fluteSoundDbis;
    public AudioClip fluteSoundEbis;
    public AudioClip fluteSoundFbis;
    public AudioClip fluteSoundGbis;
    public AudioClip fluteSoundAbis;
    private string notePlayed;

    public string tableColor = "red";
    public string tableColorSave = "red";

    public string tableNumber = "1";
    public string tableNumberSave = "1";


    public GameObject pianoObject;
    public GameObject batterieObject;
    public GameObject planeObject;




    void Start()
    {
        planeObject = GameObject.Find("Plane");

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
        //var ip = "http://192.168.224.50:5000";

        this.imageFlutePlaying = GameObject.Find("FlutePlaying");
        this.imageFlutePlaying.SetActive(false);
        this.imageProfComing = GameObject.Find("ProfComingImage").GetComponent<Image>();
        this.imageHelpAsked = GameObject.Find("HelpAskedImage");
        this.imageProfComing.enabled = false;
        this.imageHelpAsked.SetActive(false);

        this.tableNumberText = GameObject.Find("Table Number").GetComponent<Text>();

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


        socket.On("instrument-added", type => {
            newInstru = type.ToString();
        });

        socket.On("set-table-color", color => {
            tableColor = color.ToString();
        });

        socket.On("set-table-number", number => {
            tableNumber = "#" + number.ToString();
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
            isPlayingMusic = true;
            switch (track)
            {
                case "track-01":
                    this.trackSelected = 0;
                    break;
                case "track-02":
                    this.trackSelected = 1;
                    break;
                case "track-03":
                    this.trackSelected = 2;
                    break;
                case "track-04":
                    this.trackSelected = 3;
                    break;
                default:
                    this.trackSelected = 4;
                    break;
            }
            Debug.Log("Switch track to :" + track);
        });

        socket.On("teacher-arrives", () =>
        {
            isProfessorComing = !isProfessorComing;
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
        // go.transform.position = new Vector3(UnityEngine.Random.Range(-5f, 5f), UnityEngine.Random.Range(-5f, 5f), UnityEngine.Random.Range(-5f, 5f));
        go.transform.position = new Vector3(0,0,0);
    }

    void helpButtonClicked()
    {
        socket.Emit("table-ask-help");
        imageHelpAsked.SetActive(true);
        StartCoroutine(ExecuteAfterTime(10));
    }

    IEnumerator ExecuteAfterTime(float time)
    {
        yield return new WaitForSeconds(time);
        imageHelpAsked.SetActive(false);
    }

    private void Update()
    {

        if (newInstru != newInstruSave)
        {
            this.spawnInstrument(newInstru);
            newInstru = null;
            newInstruSave = null;
        }
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
                case "A":
                    notePlayed = this.fluteSoundA;
                    break;
                case "B":
                    notePlayed = this.fluteSoundB;
                    break;
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
                case "H":
                    notePlayed = this.fluteSoundCbis;
                    break;
                case "I":
                    notePlayed = this.fluteSoundDbis;
                    break;
                case "J":
                    notePlayed = this.fluteSoundEbis;
                    break;
                case "K":
                    notePlayed = this.fluteSoundFbis;
                    break;
                case "L":
                    notePlayed = this.fluteSoundGbis;
                    break;
                case "M":
                    notePlayed = this.fluteSoundAbis;
                    break;
            }
            fluteAudioSource.PlayOneShot(notePlayed);
            //AudioSource.PlayClipAtPoint(notePlayed, Camera.main.transform.position, this.MasterVolume);
            this.fluteNoteStateSave = this.fluteNoteState;
        }

        if (fluteAudioSource.isPlaying)
        {
            this.imageFlutePlaying.SetActive(true);
        } else
        {

            this.imageFlutePlaying.SetActive(false);
        }

        if(tableColor != tableColorSave){
            float redX = (tableColor == "red" ? 256 : 0);
            float greenX = (tableColor == "green" ? 256 : 0);
            float blueX = (tableColor == "blue" ? 256 : 0);
            float colourSum = redX + greenX + blueX;
            redX = redX / colourSum;
            greenX = greenX / colourSum;
            blueX = blueX / colourSum;
            planeObject.GetComponent<Renderer>().material.color = new Color(redX, greenX, blueX, 1);
            tableColorSave = tableColor;
        }

        if (tableNumber != tableNumberSave)
        {
            this.tableNumberText.text = tableNumber;
             tableNumberSave = tableNumber;
        }

        if (isProfessorComing != isProfessorComingSave)
        {
            this.imageHelpAsked.SetActive(false);
            this.imageProfComing.enabled = true;
            StartCoroutine(ExecuteAfterTime2(10));
            isProfessorComingSave = isProfessorComing;
        }
    }
    IEnumerator ExecuteAfterTime2(float time)
    {
        yield return new WaitForSeconds(time);
        this.imageProfComing.enabled = false;
    }

    private void OnDestroy()
    {
        socket.Emit("disconnect", "table");
        socket.Disconnect();
    }
}
