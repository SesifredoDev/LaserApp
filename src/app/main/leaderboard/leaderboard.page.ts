import { Component, OnInit } from '@angular/core';
import { WorkerService } from 'src/app/shared/services/worker.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  leaderboard: any[] = []
  subscriptionMade = false;
  leaderboardReqest: any;

  constructor(private socketService: WorkerService) { 
    
  }
  ngOnInit(): void {
    
      this.leaderboardReqest =  this.socketService.leaderboard.subscribe((data)=>{
        
        this.leaderboard = data;
        console.log(this.leaderboard);
      })

      this.socketService.getLeaderboard();
  
  }


}
