import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

    rows = 10;
    cols = 10;

    constructor() { }

    ngOnInit(): void {
    }

}
