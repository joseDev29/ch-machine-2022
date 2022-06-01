import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-memory-partitions',
  templateUrl: 'memory-partitions.component.html',
})
export class MemoryPartitionsComponent {
  constructor(public readonly machineState: MachineStateService) {}
}
