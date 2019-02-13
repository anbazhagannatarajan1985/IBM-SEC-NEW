import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as models from '../shared/models';
import { ServiceProvider } from '../shared/services/service-provider';
import { LocalStorageService } from '../shared/LocalStorage.service';
import { MenuService } from '../shared/services/menu.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(private router: Router, private serviceProvider: ServiceProvider,
        private localStorageService: LocalStorageService, private menuService: MenuService) { }

    loginForm: FormGroup;
    private failedLogin: boolean = false;

    ngOnInit() {
        this.addFormControls();
        this.menuService.setUserType('-1');
        this.menuService.setLoggedIn(false);
    }

    addFormControls() {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    login() {
        this.failedLogin = false;
        const data: models.UserModel = {};
        data.username = this.loginForm.get('username').value;
        data.password = this.loginForm.get('password').value;
        this.serviceProvider.login(data).subscribe(
            result => {
                localStorage.setItem('token', result['Authorization']);
                this.getUserDetails(data.username);
                localStorage.setItem('isLoggedin', 'true');
                this.router.navigate(['/home']);
            },
            err => {
                this.failedLogin = true;
            },
            () => {

            }
        );


    }

    getUserDetails(username: string) {
        this.serviceProvider.getUserById(username).subscribe(
            result => {
                const currentUser: models.UserModel = result;
                localStorage.setItem('current_user', currentUser.username);
                localStorage.setItem('current_user_name', currentUser.fullName);
                localStorage.setItem('user_type', currentUser.userType);
                this.menuService.setUserType(currentUser.userType);
                this.menuService.setLoggedIn(true);


            },
            err => {

            },
            () => {

            }
        );
    }
}
