import { Component, ElementRef, ViewChild } from '@angular/core'
import { MessageService } from 'primeng/api'
import { MEMORY_LINE_SEPARATOR } from '../../constants/machine.constants'
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
  @ViewChild('fileInput')
  public fileInput: ElementRef<HTMLInputElement> | null = null

  constructor(
    private readonly messageService: MessageService,
    public readonly machineState: MachineStateService,
    public readonly fileService: FileService,
    public readonly codeService: CodeService,
    public readonly programExecutionService: ProgramExecutionService,
  ) {}

  onChangeFile = (ev: any) => {
    const filePath = ev.target.value
    const file = ev.target.files[0]

    if (!filePath || !file) return

    this.fileService.verifyAndLoad({ file, filePath })
  }

  onDownloadFile = () => this.fileService.downloadCode()

  getStringCode = () => JSON.stringify(this.machineState.code)

  onAnalyzeCode = () => this.codeService.analyzeAndLoad()

  getArrayPrograms = () => Array.from(this.machineState.programs.values())

  getInExecutionLine = () =>
    this.machineState.memoryRunningPosition === 0
      ? 'Celda de acumulador'
      : this.machineState.memory[this.machineState.memoryRunningPosition] ===
        'Kernel'
      ? 'Celda de kernel'
      : !this.machineState.memory[this.machineState.memoryRunningPosition]
          .toString()
          .includes(MEMORY_LINE_SEPARATOR)
      ? 'Celda de variable'
      : (
          JSON.parse(
            this.machineState.memory[this.machineState.memoryRunningPosition]
              .toString()
              .split(MEMORY_LINE_SEPARATOR)[0],
          ) as CompoundMemoryItem
        ).lineText

  onRunNotPause = () => {
    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      runNotPause: false,
      runStepByStep: false,
    }
    this.machineState.executionMode = 'not-pause'
    this.programExecutionService.runProgram()
  }

  onRunStepByStep = () => {
    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      runNotPause: false,
      runStepByStep: false,
    }
    this.machineState.executionMode = 'step-by-step'
    this.programExecutionService.runProgram()
  }

  onNextInstruction = () => {
    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      nextInstruction: false,
    }
    this.programExecutionService.runProgram()
  }

  onReadValue = () => {
    const memoryPosition = this.machineState.readOperationInput.memoryPosition
    const value = this.machineState.readOperationInput.value

    this.machineState.memory[memoryPosition] = value

    this.machineState.readOperationInput = {
      active: false,
      value: '',
      memoryPosition: 0,
      varType: VARIABLE_TYPE.chain,
    }

    if (this.machineState.executionMode === 'step-by-step') {
      this.machineState.buttonsState = {
        ...this.machineState.buttonsState,
        nextInstruction: true,
      }
      return
    }

    return this.programExecutionService.runProgram()
  }
}