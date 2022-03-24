import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program, Variable } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Store {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program
    const variable = program.variables.get(line.varName as string) as Variable

    const varPosition = variable.memoryPosition as number
    const currentAccumulator = this.machineState.memory[0] as number

    this.machineState.memory[varPosition] = currentAccumulator
  }
}
