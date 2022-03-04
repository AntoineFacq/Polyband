package com.example.polyband_flute;

import io.socket.client.Socket;

public class SocketSingleton {
    private static Socket mSocket;
    private static boolean switched = false;
    private static boolean connected = false;

    public static void setSocket(Socket _socket) {
        SocketSingleton.mSocket=_socket;
        switched = true;
    }

    public static Socket getSocket() {
        return SocketSingleton.mSocket;
    }

    public static boolean getIfSwitched() { return switched;}

    public static void setConnected(boolean isConnected) {
        connected = isConnected;
    }

    public static boolean getIfConnected() { return connected;}
}
