import io from 'socket.io-client';

import {createContext} from 'react';

export const socket = io.connect('http://localhost:3000', { autoConnect: false });
export const SocketContext = createContext(socket);