import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-variables-table',
  templateUrl: 'variables-table.component.html',
})
export class VariablesTableComponent {
  constructor(public readonly machineState: MachineStateService) {}
}
