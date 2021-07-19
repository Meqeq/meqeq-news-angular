import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResizeObserverService, RESIZE_OPTION_BOX } from '@ng-web-apis/resize-observer';
import { Subscription } from 'rxjs';
import { PanelsService } from 'src/app/services/panels.service';
import { Panel } from '../../../../../common/rss';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    providers: [
        ResizeObserverService,
        { provide: RESIZE_OPTION_BOX, useValue: 'border-box' }
    ]
})
export class SummaryComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    private resizeSubscription;

    rows = 10;
    cols = 10;

    totalSize = [0, 0];

    panels: Panel[] = [];

    editable = false;

    constructor(private resizeObserver: ResizeObserverService, private panelsService: PanelsService) { 
        this.resizeSubscription = resizeObserver.subscribe(res => {
            const size = res[0].borderBoxSize as unknown as ResizeObserverSize;
            this.totalSize = [size.inlineSize, size.blockSize];
        });
    }

    ngOnInit(): void {
        this.subscriptions.add(this.panelsService.getPanels().subscribe(res => {
            this.panels = res;
        }));
    }

    handlePanelResize(index: number, newSize: (number | number)[]) {
        if(newSize[0] > this.cols) newSize[0] = this.cols;
        if(newSize[1] > this.rows) newSize[1] = this.rows;

        this.panels[index].size = newSize;
    }

    handlePosChange(index: number, newPos: (number | number)[]) {
        if(newPos[0] < 1) newPos[0] = 1;
        if(newPos[1] < 1) newPos[1] = 1;

        if(newPos[0] > this.cols) newPos[0] = this.cols;
        if(newPos[1] > this.rows) newPos[1] = this.rows;

        this.panels[index].pos = newPos;
    }

    save() {
        this.subscriptions.add(this.panelsService.savePanels(this.panels).subscribe(res => {
            console.log(res);
            this.editable = false;
        }));
    }

    add() {
        this.panels = [...this.panels, { pos: [1, 1], size: [3, 3], src: ""}];
    }

    handlePanelRemove(index: number) {
        this.panels = [
            ...this.panels.slice(0, index),
            ...this.panels.slice(index+1)
        ]
    }

    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
        this.subscriptions.unsubscribe();
    }

}
