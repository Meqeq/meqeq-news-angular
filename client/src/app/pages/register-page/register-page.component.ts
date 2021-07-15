import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"


import { confirmPassword } from './confirm-password.validator';
import { AuthService } from 'src/app/services/auth.service';
import { AuthCodes, ErrorResponse } from '../../../../../common/auth';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
    form = new FormGroup({
        username:  new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
        password:  new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
        password2: new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
        nick:      new FormControl("", [ Validators.required, Validators.minLength(5), Validators.maxLength(30) ]),
        email:     new FormControl("", [ Validators.required, Validators.email ])
    }, {
        validators: confirmPassword("password", "password2")
    })

    authError: AuthCodes = AuthCodes.Success;

    constructor(private auth: AuthService, private router: Router) {}

    get username() {
        return this.form.get("username") as FormControl;
    }

    get email() {
        return this.form.get("email") as FormControl;
    }

    get password() {
        return this.form.get("password") as FormControl;
    }

    get password2() {
        return this.form.get("password2") as FormControl;
    }

    ngOnInit(): void {

    }

    register() {
        this.auth.register(this.form.value).subscribe( 
            res => {
                if(res.ok) {
                    this.router.navigate(["/login"]);
                } 
            },
            (err: ErrorResponse) =>{
                this.form.setErrors({ authError: err.errorCode });
            }
        );
    }
}
