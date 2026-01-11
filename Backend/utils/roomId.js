// Backend/utils/roomId.js
export const getRoomId = (doctorId, patientId) => {
  // Consistent roomId: doctorId_patientId
  return `${doctorId}_${patientId}`;
};
