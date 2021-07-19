import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RssService } from 'src/app/services/rss.service';
import { RssItem } from '../../../../../common/rss';

@Component({
    selector: 'app-rss-reader',
    templateUrl: './rss-reader.component.html',
    styleUrls: ['./rss-reader.component.scss']
})
export class RssReaderComponent implements OnInit {
    private subscriptions = new Subscription();

    @Input() editable = false;
    @Input() src = "";

    @Output() onRemove = new EventEmitter();

    feed: RssItem[] = [];
    loading = true;

    constructor(private rss: RssService) {
        
    }

    ngOnInit(): void {
        if(this.src !== "")
            this.subscriptions.add(this.rss.getRss(this.src).subscribe(res => {
                this.feed = res;
                this.loading = false;
            }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    remove() {
        this.onRemove.emit();
    }

    refresh() {
        this.subscriptions.add(this.rss.getRss(this.src).subscribe(res => {
            this.feed = res;
            this.loading = false;
        }));
    }
}
