import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorResponse } from '../../../../../common/auth';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    form = new FormGroup({
        username:  new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
        password:  new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
    })

    constructor(private auth: AuthService, private router: Router) {}

    get username() {
        return this.form.get("username") as FormGroup;
    }

    get password() {
        return this.form.get("password") as FormGroup;
    }

    ngOnInit(): void {

    }

    login() {
        this.auth.login(this.form.value).subscribe(
            res => {
                if(res.ok) {
                    this.router.navigate(["/main"]);
                } 
            },
            (err: ErrorResponse) => {
                this.form.setErrors({ authError: err.errorCode });
            }
        )
    }

}
