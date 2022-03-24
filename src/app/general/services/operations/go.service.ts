import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Go {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program
    const label = program.labels.get(line.labelName as string)

    this.machineState.memoryRunningPosition =
      (label?.memoryPosition as number) - 1
  }
}
