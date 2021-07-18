import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatIconModule } from '@angular/material/icon'; 
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

import { WrapperComponent } from './components/wrapper/wrapper.component';
import { BackgroundComponent } from './components/background/background.component';
import { AuthErrorsPipe } from './pipes/auth-errors.pipe';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SummaryComponent } from './components/summary/summary.component';
import { PanelComponent } from './components/panel/panel.component';
import { PanelDirective } from './directives/panel.directive';
import { RssReaderComponent } from './components/rss-reader/rss-reader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BackgroundComponent,
    LoginPageComponent,
    WrapperComponent,
    RegisterPageComponent,
    AuthErrorsPipe,
    MainPageComponent,
    HeaderComponent,
    SideNavComponent,
    SummaryComponent,
    PanelComponent,
    PanelDirective,
    RssReaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
