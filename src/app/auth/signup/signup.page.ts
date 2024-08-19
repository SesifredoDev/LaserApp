import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  public email: any;
  public password: any;
  public name: any;
  public profileImage: File | null = null;
  public uploadPercent?: Observable<number>;
  public downloadURL?: Observable<string>;

  constructor(
    public fireService: FirebaseService,
    private storage: AngularFireStorage
  ) { }

  onFileSelected(event: any) {
    this.profileImage = event.target.files[0];
  }
  

  signup() {
    this.fireService.signup({ email: this.email, password: this.password }).then(res => {
      if (res?.user?.uid) {
        const uid = res.user.uid;

        // Upload profile image
        if (this.profileImage) {
          const filePath = `profile_images/${uid}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.profileImage);

          // Observe percentage changes
          this.uploadPercent = task.percentageChanges().pipe(
            filter((percentage): percentage is number => percentage !== undefined)
          );

          task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe(url => {
                this.saveUserDetails(uid, url);
              });
            })
          ).subscribe();
        } else {
          // Save user details without profile image
          this.saveUserDetails(uid, null);
        }
      }
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }

  saveUserDetails(uid: string, profileImageUrl: string | null) {
    let data = {
      email: this.email,
      name: this.name,
      uid: uid,
      isAdmin: false,
      avatar: profileImageUrl || '',  // Save the image URL or empty string if not provided,
      totalScore: 0
    };

    this.fireService.saveDetails(data).then(res => {
      alert('Account Created!');
    }, err => {
      console.log(err);
    });
  }
}
