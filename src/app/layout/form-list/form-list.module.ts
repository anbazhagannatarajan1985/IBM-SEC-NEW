import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { MyDatePickerModule } from 'mydatepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PageHeaderModule } from './../../shared';
import { FormListRoutingModule } from '../../layout/form-list/form-list.routing.module';
import { FormListComponent } from '../../layout/form-list/form-list.component';



@NgModule({
    imports: [CommonModule, FormListRoutingModule, PageHeaderModule,
        NgbModule],
    declarations: [FormListComponent],
    providers: [DatePipe]
})
export class FormListModule { }
