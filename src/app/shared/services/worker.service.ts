import { EnvironmentProviders, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {io} from 'socket.io-client';
import { LocationService } from './location.service';
import { Subject } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  isConnected: Subject<boolean> = new Subject<boolean>();
  activeGame: Subject<{activeCode:string, isConnected: boolean}> = new Subject<{activeCode:string, isConnected: boolean}>();
  
  socket: any;
  heatmapValues: Subject<any[]> = new Subject<any[]>();


  currentLeaderboard: any[] = [];
  leaderboard: Subject<any[]> = new Subject<any[]>();

  activeCode: string = "";



  constructor(private ls: LocationService, private fireService: FirebaseService) { }
  socketConnect(){
    try{
      
      this.socket = io(environment.socketUrl, {reconnection: true});
      this.socket.connect();

      
      this.socket.on("disconnect", ()=>{
        this.isConnected.next(false);
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
        this.activeGame.next({activeCode: data.code, isConnected: true});
        this.activeCode = data.code;
        
        console.log("Connected to game", data);
        this.leaderboard.next(data.leaderboard)
        this.currentLeaderboard = data.leaderboard;
      })  

      this.socket.on("disconnectGame", (data: any) =>{
        this.activeGame.next({activeCode: "", isConnected: false});
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
    if(user && result){
      
      this.socket.emit("joinGame", result);
    }else{
      console.log(user, result)
    }
  }

  disconnectSocket(){
    this.socket.disconnectSocket();
  }


}
 