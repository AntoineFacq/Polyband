using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PianoSounds : MonoBehaviour
{
    [SerializeField]
    public bool octave = false;
    public AudioClip sound;
    public MainController mainController;
    public AudioSource speaker;

    void Start()
    {
        mainController = Camera.main.GetComponent<MainController>();
        speaker = transform.parent.transform.parent.GetComponent<AudioSource>();
    }

    public void PointerDown()
    {
        play(sound);
    }

    public void play(AudioClip a)
    {
        speaker.clip = a;
        speaker.pitch = octave ? 2 : 1;
        speaker.Play();
    }

}
