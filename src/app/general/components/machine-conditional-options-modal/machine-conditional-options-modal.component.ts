import { Component } from '@angular/core'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-machine-conditional-options-modal',
  templateUrl: 'machine-conditional-options-modal.component.html',
})
export class MachineConditionalOptionsModalComponent {
  public quantum: number = 0

  constructor(public readonly machineState: MachineStateService) {}

  onSave = () => {
    this.machineState.setConditionalOptions({ quantum: this.quantum })
    this.machineState.machineConditionalOptionsModalState = {
      visible: false,
    }
  }
}
