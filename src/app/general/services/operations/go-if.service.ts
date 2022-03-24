import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class GoIf {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program

    const label1 = program.labels.get(line.label1Name as string)
    const label2 = program.labels.get(line.label2Name as string)

    const currentAccumulator = this.machineState.memory[0]

    if (currentAccumulator > 0) {
      this.machineState.memoryRunningPosition =
        (label1?.memoryPosition as number) - 1
    } else if (currentAccumulator < 0) {
      this.machineState.memoryRunningPosition =
        (label2?.memoryPosition as number) - 1
    }
  }
}
