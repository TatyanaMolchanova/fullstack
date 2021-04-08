import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MaterialService } from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      console.log('params', params)
      if (params['registered']) {
        //Now you can enter to system with your data
        MaterialService.toast('Now you can enter to system with your data')
      } else if (params['accessDenied']) {
        // Please login to system
        MaterialService.toast('Please login to system')
      } else if (params['sessionExpired']) {
        MaterialService.toast('Please login to system again')
      }
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    // const user = {
    //   email: this.form.value.email,
    //   password: this.form.value.password
    // }
    // this.auth.login(user)

    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      // () => console.log('Login success'),
      () => this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message)
        // console.warn(error)
        this.form.enable()
      }
    )
  }

}
