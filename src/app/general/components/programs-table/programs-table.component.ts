import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-programs-table',
  templateUrl: 'programs-table.component.html',
})
export class ProgramsTableComponent {
  constructor(public readonly machineState: MachineStateService) {}

  getArrayPrograms = () => Array.from(this.machineState.programs.values())
}
