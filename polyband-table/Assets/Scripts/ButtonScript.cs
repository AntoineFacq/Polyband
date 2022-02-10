using System.Collections;
using UnityEngine.UI;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ButtonScript : MonoBehaviour
{
    public GameObject batterie;
    public GameObject piano;
    private bool displayBatterie;
    private bool displayPiano;
    public Button batterieButton;
    public Button pianoButton;
    public Button reloadButton;


    void Start()
    {
        batterie = batterieButton.transform.parent.Find("Batterie").gameObject;
        piano = pianoButton.transform.parent.Find("Piano").gameObject;
        displayBatterie = batterie.activeSelf;
        displayPiano = batterie.activeSelf;
        Button btn1 = batterieButton.GetComponent<Button>();
        btn1.onClick.AddListener(batterieButtonClicked);
        Button btn2 = pianoButton.GetComponent<Button>();
        btn2.onClick.AddListener(pianoButtonClicked);
        Button btn3 = reloadButton.GetComponent<Button>();
        btn3.onClick.AddListener(reloadButtonClicked);
    }


    void batterieButtonClicked()
    {
        batterie.SetActive(displayBatterie);
        displayBatterie = !displayBatterie;
    }
    void pianoButtonClicked()
    {
        piano.SetActive(displayPiano);
        displayPiano = !displayPiano;
    }

    void reloadButtonClicked()
    {
      Scene scene = SceneManager.GetActiveScene(); SceneManager.LoadScene(scene.name);
    }
}
