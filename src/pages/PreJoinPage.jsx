import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from 'react-aspect-ratio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { AudioSelectButton, ControlButton, VideoRenderer, VideoSelectButton } from 'livekit-react';
import { createLocalVideoTrack } from 'livekit-client';
import { useStateContext } from '../contexts/ContextProvider';
import { createTokenClientSide } from '../apis/clientUtils';
import {useSelector} from 'react-redux'
import copyIcon from "../data/iconmonstr-copy-lined.svg";
export const PreJoinPage = (props) => {
    const { userInfo } = useSelector((state) => state.auth);
    const { activeMenu } = useStateContext();
    const [url, setUrl] = useState('wss://taskmt-prjcu7kw.livekit.cloud');
    const [token, setToken] = useState('');
    const [simulcast, setSimulcast] = useState(true);
    const [dynacast, setDynacast] = useState(true);
    const [adaptiveStream, setAdaptiveStream] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [connectDisabled, setConnectDisabled] = useState(true);
    const [videoTrack, setVideoTrack] = useState();
    const [audioDevice, setAudioDevice] = useState();
    const [videoDevice, setVideoDevice] = useState();
    const [meetingCode, setMeetingCode] = useState('');
    const [showTooltip, setShowTooltip] = useState(false); // State to control tooltip visibility
 

    const navigate = useNavigate();

    useEffect(() => {
        
        fetchToken();
        if (token && url) {
            setConnectDisabled(false);
        } else {
            setConnectDisabled(true);
        }
    }, [token, url]);
  useEffect(()=>{
    generateMeetingCode();
  },[])
  

    const generateMeetingCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setMeetingCode(result);
    };
    const fetchToken = async () => {
        try {
            // Pass the meetingCode to createTokenClientSide function
            const token = await createTokenClientSide(meetingCode, userInfo.name);
            setToken(token);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(meetingCode);
        setShowTooltip(true); // Show tooltip
        setTimeout(() => {
            setShowTooltip(false); // Hide tooltip after 2 seconds
        }, 2000);
    };
    const handleMeetingCodeChange = (e) => {
        setMeetingCode(e.target.value);
        fetchToken(); // Fetch token when meeting code changes
    };

    const toggleVideo = async () => {
        if (videoTrack) {
            videoTrack.stop();
            setVideoEnabled(false);
            setVideoTrack(undefined);
        } else {
            try {
                const track = await createLocalVideoTrack({
                    deviceId: videoDevice?.deviceId,
                });
                setVideoEnabled(true);
                setVideoTrack(track);
            } catch (error) {
                console.error('Error toggling video:', error);
            }
        }
    };
    
    const toggleAudio = () => {
        setAudioEnabled(!audioEnabled);
    };
    
    const selectVideoDevice = (device) => {
        setVideoDevice(device);
        if (videoTrack) {
            if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
                return;
            }
            videoTrack.stop();
        }
    };
    
    const connectToRoom = async () => {
        if (videoTrack) {
            videoTrack.stop();
        }
    
        if (window.location.protocol === 'https:' && url.startsWith('ws://') && !url.startsWith('ws://localhost')) {
            alert('Unable to connect to insecure websocket from https');
            return;
        }
    
        const params = {
            url,
            token,
            videoEnabled: videoEnabled ? '1' : '0',
            audioEnabled: audioEnabled ? '1' : '0',
            simulcast: simulcast ? '1' : '0',
            dynacast: dynacast ? '1' : '0',
            adaptiveStream: adaptiveStream ? '1' : '0',
        };
        if (audioDevice) {
            params.audioDeviceId = audioDevice.deviceId;
        }
        if (videoDevice) {
            params.videoDeviceId = videoDevice.deviceId;
        } else if (videoTrack) {
            const deviceId = await videoTrack.getDeviceId();
            if (deviceId) {
                params.videoDeviceId = deviceId;
            }
        }
        navigate({
            pathname: '/room',
            search: "?" + new URLSearchParams(params).toString()
        });
    };
    
    let videoElement;
    if (videoTrack) {
        videoElement = <VideoRenderer track={videoTrack} isLocal={true} />;
    } else {
        videoElement = <div className="placeholder" />;
    }

    return (
        <>
            {!activeMenu ? (
                <div style={{ width: '100vw', height: '90vh' }}>
                    <div className="prejoin bg-white text-black ">
                    <main>
                        <h2>LiveKit Video</h2>
                        <hr />
                        <div className="entrySection">
                           
                            
                        <div className="flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0 md:mr-4">
            <div className="label">Meeting Code</div>
            <div className="flex items-center">
                <input type="text" name="meetingCode" value={meetingCode} onChange={handleMeetingCodeChange}   className=" px-3 py-2 mr-2" />
                <img src={copyIcon} alt="Copy icon" className="copyIcon cursor-pointer hover:bg-gray-200" style={{ width: '24px', height: '24px' }} onClick={copyToClipboard} />
                {showTooltip && (
            <div className=" bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm z-10 ">
              copied!
            </div>
        )}    
            </div>
            
        </div>  </div>
                           
                        </div>

                        <div className="videoSection">
                            <AspectRatio ratio={16 / 9}>
                                {videoElement}
                            </AspectRatio>
                        </div>

                        <div className="controlSection">
                            <div>
                                <AudioSelectButton
                                    isMuted={!audioEnabled}
                                    onClick={toggleAudio}
                                    onSourceSelected={setAudioDevice}
                                />
                                <VideoSelectButton
                                    isEnabled={videoTrack !== undefined}
                                    onClick={toggleVideo}
                                    onSourceSelected={selectVideoDevice}
                                />
                            </div>
                            <div className="right">
                                <ControlButton
                                    label="Connect"
                                    disabled={connectDisabled}
                                    icon={faBolt}
                                    onClick={connectToRoom} />
                            </div>
                        </div>
                    </main>
                    <footer>
                        This page is built with <a href="https://github.com/livekit/livekit-react">LiveKit React</a>&nbsp;
                        (<a href="https://github.com/livekit/livekit-react/blob/master/example/src/PreJoinPage.tsx">source</a>)
                    </footer>
                </div>
                </div>
            ) : (
                <div className="prejoin bg-white text-black ">
                    <main>
                        <h2>LiveKit Video</h2>
                        <hr />
                        <div className="entrySection">
                           
                            
                        <div className="flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0 md:mr-4">
            <div className="label">Meeting Code</div>
            <div className="flex items-center">
                <input type="text" name="meetingCode" value={meetingCode} onChange={handleMeetingCodeChange}   className=" px-3 py-2 mr-2" />
                <img src={copyIcon} alt="Copy icon" className="copyIcon cursor-pointer hover:bg-gray-200" style={{ width: '24px', height: '24px' }} onClick={copyToClipboard} />
                {showTooltip && (
            <div className=" bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm z-10 ">
              copied!
            </div>
        )}    
            </div>
            
        </div>  </div>
                           
                        </div>

                        <div className="videoSection">
                            <AspectRatio ratio={16 / 9}>
                                {videoElement}
                            </AspectRatio>
                        </div>

                        <div className="controlSection">
                            <div>
                                <AudioSelectButton
                                    isMuted={!audioEnabled}
                                    onClick={toggleAudio}
                                    onSourceSelected={setAudioDevice}
                                />
                                <VideoSelectButton
                                    isEnabled={videoTrack !== undefined}
                                    onClick={toggleVideo}
                                    onSourceSelected={selectVideoDevice}
                                />
                            </div>
                            <div className="right">
                                <ControlButton
                                    label="Connect"
                                    disabled={connectDisabled}
                                    icon={faBolt}
                                    onClick={connectToRoom} />
                            </div>
                        </div>
                    </main>
                    <footer>
                        This page is built with <a href="https://github.com/livekit/livekit-react">LiveKit React</a>&nbsp;
                        (<a href="https://github.com/livekit/livekit-react/blob/master/example/src/PreJoinPage.tsx">source</a>)
                    </footer>
                </div>
            )}
        </>
    );
};


