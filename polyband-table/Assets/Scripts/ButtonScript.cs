using System;
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
    public Button lockButton;
    public SpriteRenderer spriteRenderer;
    public Sprite[] spritesLock;
    private GameObject leanTouch;
    private bool isLocked;


    void Start()
    {
        isLocked = false;
        leanTouch = GameObject.Find("LeanTouch");
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
        Button btn4 = lockButton.GetComponent<Button>();
        btn4.onClick.AddListener(lockButtonClicked);
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

    void lockButtonClicked() {
        leanTouch.SetActive(isLocked);
        GameObject.Find("Lock Icon").transform.GetComponent<UnityEngine.UI.Image>().sprite = spritesLock[Convert.ToInt32(!isLocked)];
        ToastModalWindow.Create(ignorable: true)
                        .SetHeader("Attention !")
                        .SetBody(isLocked ? "Instruments déverrouillés !" : "Instruments verrouillés !")
                        .SetDelay(2f) // Set it to 0 to make popup persistent
                        // .SetIcon(isLocked ? spritesLock[0] : spritesLock[1]) // set lock icon
                        .Show();
        isLocked = !isLocked;
    }
}
