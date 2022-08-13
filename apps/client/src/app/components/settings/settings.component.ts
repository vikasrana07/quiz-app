import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlertService, LoaderService } from '../../_services';
import { SettingsService } from './settings.service';
import { Setting } from '../../_models';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'quiz-app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputTextModule],
  providers: [SettingsService]
})
export class SettingsComponent implements OnInit {
  isSubmitted!: boolean;
  settingForm: FormGroup | any;
  settings!: Array<Setting>;
  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.createSettingForm();
    this.getSettings();
  }
  createSettingForm() {
    this.settingForm = new FormGroup({
      timePerQuestion: new FormControl('', [Validators.required]),
      coinPerAnswer: new FormControl('', [Validators.required])
    });
  }

  getSettings() {
    this.loaderService.start();
    this.settingsService
      .getSettings()
      .subscribe({
        next: (response: any) => {
          const setting: any = {};
          response.data.forEach((element: { key: string | number; value: any; }) => {
            setting[element.key] = element.value;
          });

          this.settingForm.patchValue(setting);
          this.loaderService.stop();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }

  get formControls(): any { return this.settingForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.settingForm.invalid) {
      return;
    }

    const data: any = [{
      key: "timePerQuestion",
      value: this.formControls.timePerQuestion.value,
    }, {
      key: "coinPerAnswer",
      value: this.formControls.coinPerAnswer.value
    }]
    this.updateSetting(data);
  }

  updateSetting(data: any) {
    this.loaderService.start();
    this.settingsService
      .updateSetting(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
}
