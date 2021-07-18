import { Injectable } from '@angular/core';
import { Panel } from '../../../../common/rss';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PanelsService {

    constructor(private auth: AuthService) {

    }

    getPanels() {
        return this.auth.fetchApiGet<Panel[]>("/panels");
    }
}
