// unity c# code
using Socket.Quobject.SocketIoClientDotNet.Client;
using UnityEngine;

public class MainController : MonoBehaviour
{
    private QSocket socket;


    public float MasterVolume = 1F;


    void Start()
    {
        var ip = "http://localhost:5000";

        Debug.Log("Starting connection to "+ip+"...");
        socket = IO.Socket(ip);

        socket.On(QSocket.EVENT_CONNECT, () => {
            Debug.Log("Connected to server");
        });

        socket.On("volume", volume => {
            this.MasterVolume = float.Parse(volume.ToString());
            Debug.Log("Main volume changed to:"+this.MasterVolume);
        });

        //socket.On("add-message", data => {
        //    Debug.Log("data : " + data);
        // });




    }

    private void OnDestroy()
    {
        socket.Disconnect();
    }
}