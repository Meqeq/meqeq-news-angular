import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor() { }

    @Output() menuToggle = new EventEmitter();

    toggle() {
        this.menuToggle.emit();
    }

    ngOnInit(): void {
    }

}
