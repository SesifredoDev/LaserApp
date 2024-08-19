import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email:any;
  public password:any;

  constructor(
    public router:Router,
    public fireService:FirebaseService
  ) { }

  ngOnInit() {
  }


  login(){
    this.fireService.loginWithEmail({email:this.email,password:this.password}).then((res: any)=>{
      console.log(res);
      if(res?.user?.uid){
        let uid = res.user.uid;
        
        this.fireService.getDetails(res.user.uid).subscribe((res: any)=>{
          console.log(uid)
          localStorage.setItem("uid", uid);
          this.fireService.changedAuth.next(uid);
          this.router.navigateByUrl('')
        },err=>{
          alert(err.message);
        });
      }
    },err=>{
      alert(err.message)
      console.log(err);
    })
  }


  signup(){
    this.router.navigateByUrl('signup');
  }
}