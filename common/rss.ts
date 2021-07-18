export interface RssRequest {
    path: string;
}

export interface RssItem {
    title: string;
    description: string;
    link: string;
    pubDate: Date;
    enclosure: string | undefined | null;
}

export interface RssResponse {
    text: string;
}

export interface Panel {
    pos: (number | number)[];
    size: (number | number)[];
    src: string;
}