import { Pipe, PipeTransform } from '@angular/core';
import { AuthCodes } from '../../../../common/auth';

@Pipe({
    name: 'authErrors'
})
export class AuthErrorsPipe implements PipeTransform {

    transform(value: AuthCodes): string {
        switch(value) {
            case AuthCodes.Success: return "";
            case AuthCodes.MissingParam: return "Za mało parametrów";
            case AuthCodes.DiffrentPasswords: return "Hasła są różne";
            case AuthCodes.UsernameTaken: return "Nazwa użytkownika jest zajęta";
            case AuthCodes.EmailTaken: return "Email jest zajęty";
            case AuthCodes.ServerError: return "Błąd serwera";
            case AuthCodes.UserNotFound: return "Nie znaleziono użytkownika";
            case AuthCodes.WrongPassword: return "Złe hasło";
            default: return "Nieznany błąd";
        }
    }
}
