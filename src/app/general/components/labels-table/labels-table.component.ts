import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-labels-table',
  templateUrl: 'labels-table.component.html',
})
export class LabelsTableComponent {
  constructor(public readonly machineState: MachineStateService) {}
}
