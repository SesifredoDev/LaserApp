import { EnvironmentProviders, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {io} from 'socket.io-client';
import { LocationService } from './location.service';
import { Subject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { IGame, IGameRequirements } from '../models/game-info.model';
import { ModalController } from '@ionic/angular';
import { RequirementsComponent } from 'src/app/menu/requirements/requirements.component';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  isConnected: Subject<boolean> = new Subject<boolean>();
  activeGame: Subject<IGame> = new Subject<IGame>();
  
  socket: any;
  heatmapValues: Subject<any[]> = new Subject<any[]>();


  currentLeaderboard: any[] = [];
  leaderboard: Subject<any[]> = new Subject<any[]>();

  activeCode: string = "";



  constructor(private ls: LocationService, private fireService: FirebaseService, private modalCtrl: ModalController) { }
  socketConnect(){
    try{
      
      this.socket = io(environment.socketUrl, {reconnection: true});
      this.socket.connect();

      
      this.socket.on("disconnect", ()=>{
        this.isConnected.next(false);
        this.activeGame.next({gameCode: "", isConnected: false});
      })

      this.socket.on("connect_error", (err: any) => {
        
        this.isConnected.next(false);
        console.error("Socket.IO Error: ", err);
      });

      
      this.socket.on("connectedNewUser" ,(data: any)=>{
        this.socket.emit("userData", localStorage.getItem("uid"))
        
        this.isConnected.next(true);
      })

      // Connected To Game

      this.socket.on("connectGame", (data: any) =>{
        this.activeGame.next({gameCode: data.gameCode, isConnected: true, name: data.name, playerCount: data.playerCount  });
        this.activeCode = data.code;
        
        console.log("Connected to game", data);
        this.leaderboard.next(data.leaderboard)
        this.currentLeaderboard = data.leaderboard;
      });
      
      this.socket.on("gameRequirements", async (data: any)=>{
        let code = data.gameCode;
        console.log("requirements to game", data);
        let requirements: IGameRequirements = data.requirements;
        let requireModal = await this.modalCtrl.create({
          component: RequirementsComponent,
          componentProps: {
            code: code,
            requirements: requirements
          },
          backdropDismiss: false
        } )

        requireModal.present();
      })

      this.socket.on("disconnectGame", (data: any) =>{
        this.activeGame.next({gameCode: "", isConnected: false});
        this.activeCode = "";
      })



      // HeatMap Update

      this.socket.on("heatUpdate", (data:any) =>{
          let pointsArray: any[] = []
          for(let point of data){
            point[2] = point[2]*0.15
            pointsArray.push(point);
          }

          this.heatmapValues.next(pointsArray);
      })

      this.socket.on("leadUpdate", (data:any) =>{
        // console.log("Leaderboard updated", data.leaderboard)
        this.leaderboard.next(data.leaderboard);
        this.currentLeaderboard = data.leaderboard;
      })

      this.socket.on("takeDamage", (data:any)=>{
        
      })

    }catch(e){
      this.isConnected.next(false);
      console.error(e);
      
    }
  }

  getIsConnected(){
    return this.isConnected;
  }

  async sendGotShot(gunCode: string) {
    const location = await this.ls.getLocation();
      if (location) {
        this.socket.emit("gotshot", {data: {id:gunCode, location: location, time: location.time}})
      } else {
        console.log('Could not retrieve location');
      }
    } catch (error : any) {
      console.error('Error getting location:', error);
    }
    // let coordinates = await this.ls.getCurrentCoords();
    // this.socket.emit("gotshot", {data: {id:gunCode, location: coordinates.coords, time: coordinates.timestamp}})

  getHeatMapValues(){
    this.socket.emit("getHeat", {});
  }
  getLeaderboard(){
    this.leaderboard.next(this.currentLeaderboard);
  }
  async getHeatMapValuesSub(){

    return this.heatmapValues;
  }
  createGame(game: any){
    this.socket.emit("createGame", game);
  }
  joinGame(code: string, user: any){
    
    let result = {gameCode: code, playerInfo: user}
    console.log("Joining game", result);
    if(user && result){
      
      this.socket.emit("joinGame", result);
    }else{
      console.log(user, result)
    }
  }


  disconnectGame(){
    this.socket.emit("disconnectGame");
    this.activeGame.next({gameCode: "", isConnected: false});
  }

  disconnectSocket(){
    this.socket.disconnectSocket();
  }


}
 