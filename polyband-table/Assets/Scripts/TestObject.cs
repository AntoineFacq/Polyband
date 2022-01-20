// unity c# code
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class TestObject : MonoBehaviour
{
    private QSocket socket;

    void Start()
    {
        Debug.Log("start");
        socket = IO.Socket("http://localhost:5000");

        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected");
            socket.Emit("chat", "test");
        });

        socket.On("chat", data => {
            Debug.Log("data : " + data);
        });
    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}