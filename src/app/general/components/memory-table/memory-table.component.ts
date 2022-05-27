import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-memory-table',
  templateUrl: 'memory-table.component.html',
})
export class MemoryTableComponent {
  constructor(public readonly machineState: MachineStateService) {}
}
