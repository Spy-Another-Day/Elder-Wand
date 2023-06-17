import io from 'socket.io-client';

import {createContext} from 'react';

export const socket = io.connect(import.meta.env.VITE_SERVER_URL);
export const SocketContext = createContext(socket);
