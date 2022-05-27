import { Component } from '@angular/core'

import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-code-errors-table',
  templateUrl: 'code-errors-table.component.html',
})
export class CodeErrorsTableComponent {
  constructor(public readonly machineState: MachineStateService) {}
}
