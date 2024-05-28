import {
  faSquare,
  faThLarge,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import "react-aspect-ratio/aspect-ratio.css";
import { useStateContext } from "../contexts/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ParticipantEvent,
  Room,
  RoomEvent,
  VideoPresets,
} from "livekit-client";
import { DisplayContext, DisplayOptions, LiveKitRoom } from "livekit-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [displayOptions, setDisplayOptions] = useState({
    stageLayout: "grid",
    showStats: false,
  });
  const query = new URLSearchParams(useLocation().search);
  const url = query.get("url");
  const token = query.get("token");
  const recorder = query.get("recorder");
  const [symblConfig, setSymblConfig] = useState({});
  const { activeMenu, setActiveMenu } = useStateContext();

  if (!url || !token) {
    return <div>url and token are required</div>;
  }

  const onLeave = async () => {
    window.close();
  };

  const updateParticipantSize = (room) => {
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room) => {
    updateParticipantSize(room);

    if (
      recorder &&
      parseInt(recorder, 10) === 1 &&
      room.participants.size === 0
    ) {
      console.log("END_RECORDING");
    }
  };

  const updateOptions = (options) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  return (
    <div>
      <RoomContainer
        updateOptions={updateOptions}
        displayOptions={displayOptions}
        numParticipants={numParticipants}
        query={query}
        url={url}
        token={token}
        onConnected={onConnected}
        onLeave={onLeave}
        updateParticipantSize={updateParticipantSize}
        onParticipantDisconnected={onParticipantDisconnected}
      />
    </div>
  );
};

const getSymblConfig = async (room) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const participantId = room.localParticipant.identity;
  const participantName = room.localParticipant.name
    ? room.localParticipant.name
    : participantId;
  const meetingId = room.sid;
  const meetingName = room.name;
  return { meetingId, meetingName, participantId, participantName, stream };
};

async function onConnected(room, query) {
  window.currentRoom = room;

  if (isSet(query, "audioEnabled")) {
    const audioDeviceId = query.get("audioDeviceId");
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, "videoEnabled")) {
    const videoDeviceId = query.get("videoDeviceId");
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query, key) {
  return query.get(key) === "1" || query.get(key) === "true";
}

const RoomContainer = ({
  updateOptions,
  displayOptions,
  numParticipants,
  query,
  url,
  token,
  onConnected,
  onLeave,
  updateParticipantSize,
  onParticipantDisconnected,
}) => (
  <div className="roomContainer !mx-auto md:mt-12 max-w-screen-lg ">
    <div className="topBar">
      <div className="right">
        <div>
          <input
            id="showStats"
            type="checkbox"
            onChange={(e) => updateOptions({ showStats: e.target.checked })}
          />
          <label htmlFor="showStats">Show Stats</label>
        </div>
        <div>
          <button
            className="iconButton"
            disabled={displayOptions.stageLayout === "grid"}
            onClick={() => {
              updateOptions({ stageLayout: "grid" });
            }}
          >
            <FontAwesomeIcon height={32} icon={faThLarge} />
          </button>
          <button
            className="iconButton"
            disabled={displayOptions.stageLayout === "speaker"}
            onClick={() => {
              updateOptions({ stageLayout: "speaker" });
            }}
          >
            <FontAwesomeIcon height={32} icon={faSquare} />
          </button>
        </div>
        <div className="participantCount">
          <FontAwesomeIcon icon={faUserFriends} />
          <span>{numParticipants}</span>
        </div>
      </div>
    </div>
    <LiveKitRoom
      url={url}
      token={token}
      onConnected={(room) => {
        onConnected(room, query);

        room.on("participantConnected", () => updateParticipantSize(room));
        room.on("participantDisconnected", () =>
          onParticipantDisconnected(room)
        );
        updateParticipantSize(room);
      }}
      connectOptions={{
        adaptiveStream: isSet(query, "adaptiveStream"),
        dynacast: isSet(query, "dynacast"),
        videoCaptureDefaults: {
          resolution: VideoPresets.hd.resolution,
        },
        publishDefaults: {
          videoEncoding: VideoPresets.hd.encoding,
          simulcast: isSet(query, "simulcast"),
        },
        logLevel: "debug",
      }}
      onLeave={onLeave}
    />
  </div>
);
