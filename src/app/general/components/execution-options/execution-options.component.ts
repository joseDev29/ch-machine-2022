import { Component } from '@angular/core'
import {
  MEMORY_LINE_SEPARATOR,
  PROCESS_PLANNING_METHODS_OPTIONS,
} from '../../constants/machine.constants'
import {
  CompoundMemoryItem,
  VARIABLE_TYPE,
} from '../../interfaces/program.interfaces'
import { MachineStateService } from '../../services/machine-state.service'
import { ProgramExecutionService } from '../../services/program-execution.service'

@Component({
  selector: 'app-execution-options',
  templateUrl: 'execution-options.component.html',
})
export class ExecutionOptionsComponent {
  public planningMethods: any = null

  constructor(
    public readonly machineState: MachineStateService,
    private readonly programExecutionService: ProgramExecutionService,
  ) {
    this.planningMethods = PROCESS_PLANNING_METHODS_OPTIONS
  }

  getInExecutionLine = () => {
    return this.machineState.memoryRunningPosition === 0
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

  onRunNotPause = () => {
    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      runNotPause: false,
      runStepByStep: false,
      nextInstruction: false,
    }
    this.machineState.executionMode = 'not-pause'
    this.programExecutionService.runProgram()
  }

  onRunStepByStep = () => {
    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      // runNotPause: false,
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
}
