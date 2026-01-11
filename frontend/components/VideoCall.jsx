import React, { useRef, useState, useEffect } from "react";
import { socket } from "../socket";
import SimplePeer from "simple-peer";

export default function VideoCall({ userId }) {
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on("incoming-call", ({ from, signalData }) => {
      setCall({ isReceivingCall: true, from, signal: signalData });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answer-call", { to: call.from, signalData: data });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("call-user", { to: id, signalData: data });
    });
    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });
    socket.on("call-accepted", ({ signalData }) => {
      setCallAccepted(true);
      peer.signal(signalData);
    });
    connectionRef.current = peer;
  };

  const toggleMic = () => {
    stream.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    stream.getVideoTracks()[0].enabled = !camOn;
    setCamOn(!camOn);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex space-x-4">
        <video ref={myVideo} autoPlay muted className="w-48 h-36 bg-black rounded" />
        {callAccepted && <video ref={userVideo} autoPlay className="w-48 h-36 bg-black rounded" />}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded ${micOn ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {micOn ? "Mic On" : "Mic Off"}
        </button>
        <button
          onClick={toggleCam}
          className={`px-4 py-2 rounded ${camOn ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {camOn ? "Cam On" : "Cam Off"}
        </button>
      </div>

      {!callAccepted && call.isReceivingCall && (
        <div className="mt-2">
          <button
            onClick={answerCall}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Answer Call
          </button>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          placeholder="User ID to call"
          className="border px-2 py-1 rounded"
          id="callTo"
        />
        <button
          onClick={() => callUser(document.getElementById("callTo").value)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Call
        </button>
      </div>
    </div>
  );
}
