import { Component, ElementRef, ViewChild } from '@angular/core'
import { MessageService } from 'primeng/api'
import {
  MEMORY_LINE_SEPARATOR,
  PROCESS_PLANNING_METHODS_OPTIONS,
} from '../../constants/machine.constants'
import { ProcessPlanningMethodOption } from '../../interfaces/machine.interfaces'
import {
  CompoundMemoryItem,
  VARIABLE_TYPE,
} from '../../interfaces/program.interfaces'

import { CodeService } from '../../services/code.service'
import { FileService } from '../../services/file.service'
import { MachineStateService } from '../../services/machine-state.service'
import { ProgramExecutionService } from '../../services/program-execution.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  // @ViewChild('fileInput')
  // public fileInput: ElementRef<HTMLInputElement> | null = null

  constructor(
    private readonly messageService: MessageService,
    public readonly machineState: MachineStateService,
    public readonly fileService: FileService,
    public readonly codeService: CodeService,
    public readonly programExecutionService: ProgramExecutionService,
  ) {}

  getStringCode = () => JSON.stringify(this.machineState.code)
}
