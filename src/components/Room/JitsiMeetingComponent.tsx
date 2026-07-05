import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

interface JitsiMeetingComponentProps {
  roomName: string;
  userName: string;
  userEmail?: string;
  onReadyToClose: () => void;
}

export const JitsiMeetingComponent: React.FC<JitsiMeetingComponentProps> = ({
  roomName,
  userName,
  userEmail,
  onReadyToClose,
}) => {
  return (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
      <JitsiMeeting
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableModeratorIndicator: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
        }}
        userInfo={{
          displayName: userName || "Anonymous Student",
          email: userEmail || "",
        }}
        onApiReady={(externalApi) => {
          externalApi.addListener("readyToClose", onReadyToClose);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
          iframeRef.style.border = "none";
        }}
      />
    </div>
  );
};
