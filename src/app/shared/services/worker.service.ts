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
  isConnected: boolean = false;
  socket: any;
  heatmapValues: Subject<any[]> = new Subject<any[]>()
  leaderboard: Subject<any[]> = new Subject<any[]>()

  constructor(private ls: LocationService, private fireService: FirebaseService) { }
  socketConnect(){
    try{
      
      this.socket = io(environment.socketUrl, {reconnection: true});
      this.socket.connect();
      this.isConnected = true;

      // Test
      this.socket.on("connectedNewUser" ,(data: any)=>{
        this.socket.emit("userData", localStorage.getItem("uid"))
      })

      // HeatMap Update

      this.socket.on("heatUpdate", (data:any) =>{
          let pointsArray: any[] = []
          console.log(data)
          for(let point of data){
            point[2] = point[2]*0.15
            pointsArray.push(point);
          }

          this.heatmapValues.next(pointsArray);
      })

      this.socket.on("leadUpdate", (data:any) =>{
        this.leaderboard.next(data.leaderboard);
      })

      this.socket.on("takeDamage", (data:any)=>{
        
      })

    }catch(e){
      console.error(e);
      
    }
  }

  async sendGotShot() {
    let coordinates = await this.ls.getCurrentCoords();
    this.socket.emit("gotshot", {data: {id:"FF45C8", location: coordinates.coords, time: coordinates.timestamp}})
  }

  getHeatMapValues(){
    this.socket.emit("getHeat", {});
  }
  getLeaderboard(){
    this.socket.emit("getLead", {});
  }
  async getHeatMapValuesSub(){

    return this.heatmapValues;
  }

  disconnectSocket(){
    this.socket.disconnectSocket();
  }


}
 