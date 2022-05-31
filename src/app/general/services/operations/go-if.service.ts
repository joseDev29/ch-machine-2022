import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Label, Program } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class GoIf {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program

    const label1 = program.labels.get(line.label1Name as string) as Label
    const label2 = program.labels.get(line.label2Name as string) as Label

    const currentAccumulator = this.machineState.memory[0]

    // if (currentAccumulator > 0) {
    //   this.machineState.memoryRunningPosition =
    //     (label1?.memoryPosition as number) - 1
    // } else if (currentAccumulator < 0) {
    //   this.machineState.memoryRunningPosition =
    //     (label2?.memoryPosition as number) - 1
    // }

    if (currentAccumulator > 0) {
      program.executionPosition = label1.programPosition - 1
    } else if (currentAccumulator < 0) {
      program.executionPosition = label2.programPosition - 1
    } else {
      program.executionPosition += 1
    }

    this.machineState.programs.set(program.id, program)
  }
}
