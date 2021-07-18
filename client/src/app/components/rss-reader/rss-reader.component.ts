import { Component, Input, OnInit } from '@angular/core';
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

    feed: RssItem[] = [];
    loading = true;

    constructor(private rss: RssService) {
        
    }

    ngOnInit(): void {
        this.subscriptions.add(this.rss.getRss("https://www.polsatnews.pl/rss/wszystkie.xml").subscribe(res => {
            this.feed = res;
            this.loading = false;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
