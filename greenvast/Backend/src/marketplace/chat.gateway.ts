import {
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { FirebaseAdminService } from '../auth/firebase-admin.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        client.disconnect();
        return;
      }
      const auth = this.firebaseAdmin.getAuth();
      const decoded = auth
        ? await auth.verifyIdToken(token)
        : { uid: 'dev-user' };
      client.data.uid = decoded.uid;
    } catch (error) {
      this.logger.warn(`Chat connection rejected: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const room of client.rooms) {
      if (room !== client.id) {
        client.leave(room);
      }
    }
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: string },
  ) {
    client.join(payload.chatId);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: string; content: string },
  ) {
    if (!client.data.uid) {
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { firebaseUid: client.data.uid },
    });
    if (!user) {
      client.emit('error', { message: 'User not registered' });
      return;
    }
    const chat = await this.prisma.chatRoom.findUnique({
      where: { id: payload.chatId },
    });
    if (!chat) {
      client.emit('error', { message: 'Chat not found' });
      return;
    }

    const message = await this.prisma.message.create({
      data: {
        chatId: payload.chatId,
        senderId: user.id,
        content: payload.content,
      },
    });
    this.server.to(payload.chatId).emit('message', {
      id: message.id,
      chatId: payload.chatId,
      senderId: user.id,
      content: payload.content,
      createdAt: message.createdAt,
    });
  }
}
