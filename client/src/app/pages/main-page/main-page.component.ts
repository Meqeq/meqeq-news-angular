import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

    constructor(private auth: AuthService) { }

    username = this.auth.username;

    menuOpen = false;

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    ngOnInit(): void {

    }

}
