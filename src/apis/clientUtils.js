import { AccessToken } from 'livekit-server-sdk';

export const createTokenClientSide = async (meetingCode,username) => {
  // Simulate token creation on the client-side
  const roomName = meetingCode; // Use the meeting code as the room name
  const participantName = username;
console.log(`Room Name: ${roomName}`)
  const at = new AccessToken('APIKgzKeRaAsJRs', 'NvdsoZKFAjRptmTK8t2IveOCCjxFHJnaO63t0qgF9YU', {
    identity: participantName,
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};
