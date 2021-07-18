import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { RssItem, RssResponse } from '../../../../common/rss';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RssService {

    constructor(private auth: AuthService) {

    }

    getRss(url: string) {
        return this.auth.fetchApiPost<RssResponse>("/rss", { path: url }).pipe(map(this.parseRss))
    }

    parseRss(rssText: RssResponse, index: number) {

        const parser = new DOMParser();

        const xml = parser.parseFromString(rssText.text, "text/xml");

        const items = xml.querySelectorAll("item");

        const newFeed : RssItem[] = [];

        items.forEach(value => {
            const item : RssItem = {
                title: value.querySelector("title")?.textContent || "",
                description: value.querySelector("description")?.textContent || "",
                link: value.querySelector("link")?.textContent || "",
                pubDate: new Date(value.querySelector("pubDate")?.textContent || ""),
                enclosure: value.querySelector("enclosure")?.getAttribute("url")
            }

            newFeed.push(item);
        });

        return newFeed;
    }
}
