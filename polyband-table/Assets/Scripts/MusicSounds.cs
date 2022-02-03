using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MusicSounds : MonoBehaviour
{
    public AudioSource CymbalSound1;
    public AudioSource CymbalSound2;
    public AudioSource DrumSound1;
    public AudioSource DrumSound2;

    public void CymbalSound1Play() {
        CymbalSound1.Play();
    }
    public void CymbalSound2Play() {
        CymbalSound2.Play();
    }
    public void DrumSound1Play() {
        DrumSound1.Play();
    }
    public void DrumSound2Play() {
        DrumSound2.Play();
    }
}
