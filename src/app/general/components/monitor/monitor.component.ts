import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-monitor',
  templateUrl: 'monitor.component.html',
})
export class MonitorComponent {
  constructor(public readonly machineState: MachineStateService) {}

  onClearMonitor = () => (this.machineState.monitor = [])
}
