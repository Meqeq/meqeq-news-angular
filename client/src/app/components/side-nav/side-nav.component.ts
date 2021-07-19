import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
    @Input() menuOpen = false;
    @Output() menuToggle = new EventEmitter();

    toggleMenu() {
        this.menuToggle.emit();
    }

    username = this.auth.username;

    constructor(private auth: AuthService, private  router: Router) { }

    ngOnInit(): void {
    }

    logout() {
        this.auth.logout();
        console.log("ddddd");
        this.router.navigate(["/"]);
    }

}
