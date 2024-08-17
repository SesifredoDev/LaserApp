import { Component, OnInit } from '@angular/core';
import { BluetoothService, GameService, WorkerService } from '../shared/services';
import { IGame } from '../shared/models/game-info.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  socketConnection: boolean = false;
  activeGame: IGame = {gameCode: "", isConnected: false};
  bluetoothConnection: boolean = false;

  constructor( 
   private gameService: GameService,
   private socketService: WorkerService,
  
  ) {
    this.socketService.activeGame.subscribe(game =>{
      this.getInfo();
    })

   }
   ngOnInit(): void {
     this.getInfo();
   }


   connect(code: any){
    // console.log(code)
    this.gameService.connectToGame(code, {confirmedRequirements: false});
   }

   disconnect(){
   this.gameService.disconnectFromGame();
   }

   getInfo(){
    this.bluetoothConnection = this.gameService.bluetoothConnection;
    this.activeGame = this.gameService.activeGame;
    this.socketConnection = this.gameService.socketConnection;
   }






}
