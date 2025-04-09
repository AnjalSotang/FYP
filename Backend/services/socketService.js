// In a new file called socketService.js
let io;

  module.exports = {
  initialize: (socketIo) => {
    io = socketIo;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized');
    }
    return io;
  }
};