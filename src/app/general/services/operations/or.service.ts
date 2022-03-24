import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program, Variable } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class OR {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program

    const variable1 = program.variables.get(line.var1Name as string) as Variable
    const variable2 = program.variables.get(line.var2Name as string) as Variable
    const variable3 = program.variables.get(line.var3Name as string) as Variable

    const var1Value = this.machineState.memory[
      variable1.memoryPosition as number
    ] as number
    const var2Value = this.machineState.memory[
      variable2.memoryPosition as number
    ] as number

    const result = var1Value || var2Value

    this.machineState.memory[variable3.memoryPosition as number] = result
  }
}
