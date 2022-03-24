import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class NOT {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program

    const variable1 = program.variables.get(line.var1Name as string)
    const variable2 = program.variables.get(line.var2Name as string)

    const var1Value = this.machineState.memory[
      variable1?.memoryPosition as number
    ] as number

    const result = Number(!var1Value)

    this.machineState.memory[variable2?.memoryPosition as number] = result
  }
}
