import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPassword = (password: string, password2: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const c1 = control.get(password);
        const c2 = control.get(password2);

        if(c1 && c2 && c1.value === c2.value) 
            return null;
        else {
            c2?.setErrors({ confirmPassword: true }); // error state matcher 
            return { confirmPassword: true };
        }
    }
}