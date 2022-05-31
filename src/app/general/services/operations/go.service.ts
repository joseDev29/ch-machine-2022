import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Label, Program } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Go {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program
    const label = program.labels.get(line.labelName as string) as Label

    // this.machineState.memoryRunningPosition =
    //   (label?.memoryPosition as number) - 1

    program.executionPosition = label.programPosition - 1

    this.machineState.programs.set(program.id, program)
  }
}
