// unity c# code
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class TestObject : MonoBehaviour
{
    private QSocket socket;

    public PianoMain piano;


    void Start()
    {
        piano = (PianoMain) GameObject.Find("piano").GetComponent<PianoMain>();
        // piano = (PianoMain) GameObject.FindObjectOfType(typeof(PianoMain));

        piano.Volume = 222222;
        Debug.Log("start "+ "http://localhost:5000");
        socket = IO.Socket("http://localhost:5000");

        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected");
        });

        //socket.On("add-message", data => {
        //    Debug.Log("data : " + data);
        // });


        socket.On("volume", volume => {
            Debug.Log("v : " + volume);
            Debug.Log(float.Parse(volume.ToString()));
            piano.Volume = float.Parse(volume.ToString());
            Debug.Log(piano.Volume);

        });



    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}