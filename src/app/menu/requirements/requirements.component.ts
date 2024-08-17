import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IGameRequirements } from 'src/app/shared/models/game-info.model';
import { GameService } from 'src/app/shared/services';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent{

  code: string = "";
  requirements: IGameRequirements= {};

  form: FormGroup;

  constructor(private gameService: GameService, private fb: FormBuilder, private modalCtrl: ModalController) {
    this.form = this.fb.group({
      requiredEmail: [
        '',
        this.requirements.isEmail ? [Validators.required, Validators.email] : []
      ],
      requiredId: [
        '',
        this.requirements.isId ? [Validators.required] : []
      ],
      customName: [
        '',
        this.requirements.isCustomName? [Validators.required] : []
      ],
      radar: [
        false,
        this.requirements.isRadar? [Validators.required] : []
      ] 
    });
  }
  // ngOnInit() {
  //   // this.initializeForm();
  // }
  // initializeForm() {
  //   this.form = this.fb.group({
  //     requiredEmail: [
  //       '',
  //       this.requirements.isEmail ? [Validators.required, Validators.email] : []
  //     ],
  //     requiredId: [
  //       '',
  //       this.requirements.isId ? [Validators.required] : []
  //     ],
  //     customName: [
  //       '',
  //       this.requirements.isCustomName ? [Validators.required] : []
  //     ]
  //   });
  // }
  connect(){
    let formValue = this.form.value;

    formValue.confirmedRequirements = true;

    this.gameService.connectToGame(this.code, formValue);

    this.modalCtrl.dismiss();
    
  }

  cancel(){
    this.modalCtrl.dismiss();
  }

  

}
