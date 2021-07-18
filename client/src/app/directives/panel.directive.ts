import { Directive, ElementRef, EventEmitter, Host, HostBinding, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResizeObserverService, RESIZE_OPTION_BOX } from '@ng-web-apis/resize-observer';

@Directive({
    selector: '[appPanel]',
    providers: [
        ResizeObserverService,
        { provide: RESIZE_OPTION_BOX, useValue: 'border-box' }
    ]
})
export class PanelDirective implements OnInit, OnDestroy {
    private _pos = [0, 0];
    private _size = [0, 0];
    private _editable = false;
    private resizeSubscription;

    @Input() set pos(value: (number | number)[]) {
        this._pos = value;

        this.gridColumn = this.pos[0] + ' / span ' + this.size[0];
        this.gridRow = this.pos[1] + ' / span ' + this.size[1];
    }

    @Input() set size(value: (number | number)[]) {
        this._size = value;

        this.gridColumn = this.pos[0] + ' / span ' + this.size[0];
        this.gridRow = this.pos[1] + ' / span ' + this.size[1];
    }

    @Input() set editable(value: boolean) {
        this._editable = value;
        this.resizeProperty = value ? "both" : "none";
        this.draggable = value;
    }

    @Input() blockSize = [0, 0];

    @Output() resize = new EventEmitter<(number | number)[]>();
    @Output() changePos = new EventEmitter<(number | number)[]>();


    get pos() { return this._pos }
    get size() { return this._size }
    get editable() { return this._editable }

    @HostBinding("style.grid-column") gridColumn = "";
    @HostBinding("style.gridRow") gridRow = "";
    @HostBinding("style.resize") resizeProperty = "none";
    @HostBinding("style.overflow") overflow = "hidden";
    @HostBinding("draggable") draggable = false;

    constructor(private el: ElementRef, private resizeObserver: ResizeObserverService) { 
        this.resizeSubscription = resizeObserver.subscribe(res => {
            const size = res[0].borderBoxSize as unknown as ResizeObserverSize;
            this.handleResize(size.inlineSize, size.blockSize);
        });
    }

    handleResize(width: number, height: number) {
        if(!width || !height || !this.blockSize[0] || !this.blockSize[1]) return;

        let newSizeX = width;
        let newSizeY = height;

        newSizeY -= 0.1; newSizeX -= 0.1;

        newSizeX = Math.floor(newSizeX / this.blockSize[0]) + 1;
        newSizeY = Math.floor(newSizeY / this.blockSize[1]) + 1;

        if(newSizeX > 0 && newSizeY > 0 && (newSizeX !== this.size[0] || newSizeY !== this.size[1]))
            this.resize.emit(([newSizeX, newSizeY]));
    }

    @HostListener('mouseup') resizeEnd() {
        this.el.nativeElement.style.width = "100%";
        this.el.nativeElement.style.height = "100%";
    }

    @HostListener('dragstart', ["$event"]) dragStart(event: DragEvent) {
        event.dataTransfer?.setData('offsetX', event.screenX + "");
        event.dataTransfer?.setData('offsetY', event.screenY + "");
    } 

    @HostListener('dragend', ['$event']) dragEnd(event: DragEvent) {
        event.preventDefault();
        
        const offsetX = Number(event.dataTransfer?.getData("offsetX"));
        const offsetY = Number(event.dataTransfer?.getData("offsetY"));

        let x = event.screenX - offsetX - 0.1;
        let y = event.screenY - offsetY - 0.1;

        const newPosX = Math.floor(x / this.blockSize[0]);  
        const newPosY = Math.floor(y / this.blockSize[1]);

        this.changePos.emit([newPosX + this.pos[0], newPosY + this.pos[1]]);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }

}
