import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverComponent } from './recover/recover.component';
import { UsersRoutingModule } from './users-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {
  MatInputModule
} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { EnterComponent } from './enter/enter.component';
@NgModule({
  declarations: [LoginComponent, RegisterComponent, RecoverComponent, EnterComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    MatInputModule, MatFormFieldModule,
    MatButtonModule,
    UsersRoutingModule
  ],
  exports: [EnterComponent]
})
export class UsersModule { }
