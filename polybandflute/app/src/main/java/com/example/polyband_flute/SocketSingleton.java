package com.example.polyband_flute;

import io.socket.client.Socket;

public class SocketSingleton {
    private static Socket mSocket;

    public static void setSocket(Socket _socket) {
        SocketSingleton.mSocket=_socket;
    }

    public static Socket getSocket() {
        return SocketSingleton.mSocket;
    }
}
