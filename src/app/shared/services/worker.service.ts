import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { LocationService } from './location.service';
import { Subject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { IGame, IGameRequirements } from '../models/game-info.model';
import { ModalController } from '@ionic/angular';
import { RequirementsComponent } from 'src/app/menu/requirements/requirements.component';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  isConnected = new Subject<boolean>();
  activeGame = new Subject<IGame>();
  playerData = new Subject<any>();
  heatmapValues = new Subject<any[]>();
  leaderboard = new Subject<any[]>();

  private socket!: Socket;
  private currentLeaderboard: any[] = [];
  private activeCode = '';

  constructor(
    private ls: LocationService,
    private fireService: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  socketConnect() {
    try {
      this.initializeSocket();

      this.socket.on('connect', () => this.handleConnect());
      this.socket.on('disconnect', () => this.handleDisconnect());
      this.socket.on('connect_error', (err: any) => this.handleError(err));

      // Event Listeners
      this.socket.on('connectedNewUser', () => this.handleNewUser());
      this.socket.on('connectGame', (data: any) => this.handleConnectGame(data));
      this.socket.on('gameRequirements', (data: any) => this.handleGameRequirements(data));
      this.socket.on('disconnectGame', () => this.handleDisconnectGame());
      this.socket.on('heatUpdate', (data: any) => this.handleHeatUpdate(data));
      this.socket.on('leadUpdate', (data: any) => this.handleLeadUpdate(data));
      this.socket.on('playerUpdate', (data: any) => this.handlePlayerUpdate(data));
      this.socket.on('takeDamage', (data: any) => this.handleTakeDamage(data));

    } catch (e) {
      this.handleError(e);
    }
  }

  private initializeSocket() {
    this.socket = io(environment.socketUrl, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 5000,
    });
  }

  private handleConnect() {
    console.log('Connected to server');
    this.isConnected.next(true);
  }

  private handleDisconnect() {
    console.warn('Disconnected from server');
    this.isConnected.next(false);
    this.activeGame.next({ gameCode: '', isConnected: false });
    this.activeCode = '';
    this.leaderboard.next([]);
  }

  private handleError(err: any) {
    console.error('Socket.IO Error:', err);
    this.isConnected.next(false);
  }

  private handleNewUser() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      this.socket.emit('userData', uid);
    }
  }

  private handleConnectGame(data: any) {
    console.log('Connected to game', data);
    this.activeCode = data.gameCode;
    this.currentLeaderboard = data.leaderboard;
    this.activeGame.next({ 
      gameCode: data.gameCode, 
      isConnected: true, 
      name: data.name, 
      playerCount: data.playerCount 
    });
    this.leaderboard.next(data.leaderboard);
  }

  private async handleGameRequirements(data: any) {
    console.log('Game requirements received', data);
    const modal = await this.modalCtrl.create({
      component: RequirementsComponent,
      componentProps: {
        code: data.gameCode,
        requirements: data.requirements,
      },
      backdropDismiss: false,
    });
    await modal.present();
  }

  private handleDisconnectGame() {
    console.log('Disconnected from game');
    this.activeGame.next({ gameCode: '', isConnected: false });
    this.activeCode = '';
    this.leaderboard.next([]);
  }

  private handleHeatUpdate(data: any) {
    const pointsArray = data.map((point: any) => [point[0], point[1], point[2] * 0.15]);
    this.heatmapValues.next(pointsArray);
  }

  private handleLeadUpdate(data: any) {
    console.log('Leaderboard updated', data);
    this.currentLeaderboard = data.leaderboard;
    this.leaderboard.next(data.leaderboard);
  }

  private handlePlayerUpdate(data: any) {
    console.log('Player data updated', data);
    this.playerData.next(data);
  }

  private handleTakeDamage(data: any) {
    console.log('Player took damage', data);
    // Implement damage handling logic here if needed
  }

  async sendGotShot(gunCode: string) {
    try {
      const location = await this.ls.getLocation();
      if (location) {
        console.log('Sending got shot event', { gunCode, location });
        this.socket.emit('gotShot', {
          data: { id: gunCode, location: location, time: location.time },
        });
      } else {
        console.warn('Could not retrieve location');
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
    }
  }

  getIsConnected() {
    return this.isConnected;
  }

  getHeatMapValues() {
    this.socket.emit('getHeat', {});
  }

  getLeaderboard() {
    this.leaderboard.next(this.currentLeaderboard);
  }

  getHeatMapValuesSub() {
    return this.heatmapValues;
  }

  createGame(game: any) {
    this.socket.emit('createGame', game);
  }

  joinGame(code: string, user: any) {
    if (user) {
      const result = { gameCode: code, playerInfo: user };
      console.log('Joining game', result);
      this.socket.emit('joinGame', result);
    } else {
      console.warn('User data is missing, cannot join game');
    }
  }

  disconnectGame() {
    this.socket.emit('disconnectGame');
    this.handleDisconnectGame();
  }

  disconnectSocket() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      console.log('Socket disconnected manually');
    }
  }
}
