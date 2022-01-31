using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PianoSounds : MonoBehaviour
{
    [SerializeField]
    public AudioClip sound;


    public void play(AudioClip a)
    {
        Debug.Log(GameObject.Find("piano").GetComponent<PianoMain>());
        AudioSource.PlayClipAtPoint(a, Camera.main.transform.position, GameObject.Find("piano").GetComponent<PianoMain>().Volume);

        Debug.Log("Played at "+ GameObject.Find("piano").GetComponent<PianoMain>().Volume);
    }

    public void PointerDown()
    {
        play(sound);
    }
}
