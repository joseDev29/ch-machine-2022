import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-logs-monitor',
  templateUrl: 'logs-monitor.component.html',
})
export class LogsMonitor {
  constructor(public readonly machineState: MachineStateService) {}

  onClearLogs = () => {
    this.machineState.logs = []
  }
}
