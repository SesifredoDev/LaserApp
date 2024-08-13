import { Injectable } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { WorkerService } from './worker.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    // private socket: WorkerService
  ) {}
  loginWithEmail(data: any) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  signup(data: any) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  logout(){
    this.auth.signOut();
    // this.socket.disconnectSocket();

  }
  saveDetails(data: any) {
    return this.firestore.collection("users").doc(data.uid).set(data);
  }
  getDetails(data: any) {
    return this.firestore.collection("users").doc(data).get();
  }

  getCurrentUser() {
    let userSub = this.auth.currentUser.then(user => {
      console.log(user)
      return user
    });
    // .subscribe(user => {
    //   userSub.unsubscribe();
    //   console.log("User:", user);
    //   return user;
    // });
  }

  getOwnedGames(data: any) {
    return this.firestore.collection("games", ref => ref.where("owner", "==", data));
  }





  

}
