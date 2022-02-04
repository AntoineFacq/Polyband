using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts
{
    public class PlayTrack : MonoBehaviour
    {
        public AudioSource CymbalSound1;

        public void play()
        {
            CymbalSound1.Play();
        }

    }
}
