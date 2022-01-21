// unity c# code
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class TestObject : MonoBehaviour
{
    private QSocket socket;

    void Start()
    {
        Debug.Log("start"+ "http://192.168.240.50:5000");
        socket = IO.Socket("http://localhost:5000");

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