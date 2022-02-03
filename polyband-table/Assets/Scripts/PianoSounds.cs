using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PianoSounds : MonoBehaviour
{
    [SerializeField]
    public AudioClip sound;
    public MainController mainController;

    void Start()
    {
        mainController = Camera.main.GetComponent<MainController>();
    }

    public void PointerDown()
    {
        play(sound);
    }

    public void play(AudioClip a)
    {
        AudioSource.PlayClipAtPoint(a, Camera.main.transform.position, mainController.MasterVolume);
    }

}
