// unity c# code
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class TestObject : MonoBehaviour
{
    private QSocket socket;

    public AudioSource audioSource;
    public AudioClip clip;
    public float volume = 0.5f;

    void Start()
    {
        Debug.Log("start "+ "http://192.168.240.173:5000");
        socket = IO.Socket("http://192.168.240.173:5000");

        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected");
            socket.Emit("add-message", "test");
        });

        socket.On("add-message", data => {
            Debug.Log("data : " + data);
        });


    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}