import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

    constructor(private auth: AuthService) { }

    ngOnInit(): void {
    }

}
