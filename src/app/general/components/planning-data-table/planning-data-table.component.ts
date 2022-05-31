import { Component } from '@angular/core'

import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-planning-data-table',
  templateUrl: 'planning-data-table.component.html',
})
export class PlanningDataTableComponent {
  constructor(public readonly machineState: MachineStateService) {}

  getArrayPrograms = () => Array.from(this.machineState.programs.values())
}
