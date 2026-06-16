import jwt from 'jsonwebtoken';

export function initSocket(io) {
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; 
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  
  io.on('connection', (socket) => {
    const { userId, role } = socket.user;

    console.log(`Socket connected: userId=${userId}, role=${role}`);

   
    socket.join(`user:${userId}`);

    
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: userId=${userId}`);
    });
  });
}