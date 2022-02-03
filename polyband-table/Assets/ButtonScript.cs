using System.Collections;
using UnityEngine.UI;
using UnityEngine;

public class ButtonScript : MonoBehaviour
{
    public GameObject batterie;
    public GameObject piano;
    private bool displayBatterie;
    private bool displayPiano;
    public Button batterieButton;
    public Button pianoButton;
    
    void Start()
    {
        batterie = GameObject.Find("Batterie");
        piano = GameObject.Find("piano");
        displayBatterie = false;
        displayPiano = false;
        Button btn1 = batterieButton.GetComponent<Button>();
		btn1.onClick.AddListener(batterieButtonClicked);
        Button btn2 = pianoButton.GetComponent<Button>();
		btn2.onClick.AddListener(pianoButtonClicked);
    }

    
    void batterieButtonClicked() {
        batterie.SetActive(displayBatterie);
        displayBatterie = !displayBatterie;
    }
    void pianoButtonClicked() {
        piano.SetActive(displayPiano);
        displayPiano = !displayPiano;
    }
}
