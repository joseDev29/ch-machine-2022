import { Component } from '@angular/core'

import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-printer',
  templateUrl: 'printer.component.html',
})
export class PrinterComponent {
  constructor(public readonly machineState: MachineStateService) {}

  onClearPrinter = () => (this.machineState.printer = [])
}
