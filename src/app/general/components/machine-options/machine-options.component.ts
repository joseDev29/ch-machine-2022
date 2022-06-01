import { Component } from '@angular/core'
import {
  MEMORY_MANAGEMENT_METHODS_OPTIONS,
  PROCESS_PLANNING_METHODS_OPTIONS,
} from '../../constants/machine.constants'
import {
  MemoryManagementMethodOption,
  ProcessPlanningMethodOption,
} from '../../interfaces/machine.interfaces'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-machine-options',
  templateUrl: 'machine-options.component.html',
})
export class MachineOptionsComponent {
  public planningMethodsOptions: ProcessPlanningMethodOption[] = Object.values(
    PROCESS_PLANNING_METHODS_OPTIONS,
  )
  public memoryManagementMethodsOptions: MemoryManagementMethodOption[] =
    Object.values(MEMORY_MANAGEMENT_METHODS_OPTIONS)

  constructor(public readonly machineState: MachineStateService) {}

  onResetMachine = () => {
    // const input = this.fileInput?.nativeElement as HTMLInputElement
    // input.files = null
    // input.value = ''
    this.machineState.resetMachine()
  }
}
