import { NgModule } from '@angular/core'

import { MessageService } from 'primeng/api'

import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputNumberModule } from 'primeng/inputnumber'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { PanelModule } from 'primeng/panel'
import { CardModule } from 'primeng/card'
import { BadgeModule } from 'primeng/badge'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'

@NgModule({
  exports: [
    InputTextareaModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    PanelModule,
    CardModule,
    BadgeModule,
    TableModule,
    InputTextModule,
    DropdownModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
