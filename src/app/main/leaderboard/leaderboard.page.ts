import { Component, OnInit } from '@angular/core';
import { WorkerService } from 'src/app/shared/services/worker.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  leaderboard: any[] = []

  constructor(private scocketService: WorkerService) { }

  ngOnInit() {
    if(!this.scocketService.isConnected){
      this.scocketService.socketConnect();
    }

    
    this.scocketService.leaderboard.subscribe((data)=>{
        
      this.leaderboard = data;
      console.log(data)
    })

    this.scocketService.getLeaderboard();
  }

}
