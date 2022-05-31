import { Component } from '@angular/core'
import { CodeService } from '../../services/code.service'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-program-options-modal',
  templateUrl: 'program-options-modal.component.html',
})
export class ProgramOptionsModalComponent {
  public priority: number = 0

  constructor(
    public readonly machineState: MachineStateService,
    private readonly codeService: CodeService,
  ) {}

  onSave = () => {
    this.codeService.setProgramOptions({
      programID: this.machineState.programOptionsModalState.programID,
      priority: this.priority,
    })

    this.machineState.programOptionsModalState = {
      programID: '',
      visible: false,
    }
  }
}
