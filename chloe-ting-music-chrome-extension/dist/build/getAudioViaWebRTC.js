"use strict";
(() => { let e; const t = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] }, o = chrome.runtime.connect({ name: "WEB_RTC" }); let n; const c = document.querySelector("audio"), s = document.querySelector("video"); if (s)
    n = s;
else {
    if (!c)
        return o.postMessage({ type: "PEER_CONNECTION_ERROR", error: "No video or audio source found on this tab" }), void o.disconnect();
    n = c;
} const a = n.captureStream(), E = n => { switch (n.type) {
    case "PEER_CONNECTION_RECEIVER_READY":
        e = new RTCPeerConnection(t), e.onicecandidate = e => { e.candidate && o.postMessage({ type: "PEER_CONNECTION_SENDER_CANDIDATE", candidate: e.candidate }); }, a.getTracks().forEach((t => e.addTrack(t, a))), e.onconnectionstatechange = () => { console.log(`[${Date.now()}] Peer connection state: ${e.connectionState}`); }, e.createOffer().then((t => e.setLocalDescription(t))).then((() => { o.postMessage({ type: "PEER_CONNECTION_OFFER", description: e.localDescription }); }));
        break;
    case "PEER_CONNECTION_ANSWER":
        e.setRemoteDescription(n.description);
        break;
    case "PEER_CONNECTION_RECEIVER_CANDIDATE":
        e.addIceCandidate(n.candidate);
        break;
    case "PEER_CONNECTION_CLOSE": e.close(), o.onMessage.removeListener(E), o.disconnect(), console.log("Peer connection closed"), e = null;
} }; o.onMessage.addListener(E), o.postMessage({ type: "PEER_CONNECTION_SENDER_READY" }); })();
