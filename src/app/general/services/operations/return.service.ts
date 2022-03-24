import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program, Variable } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Return {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    if (line.value === null && !line.varName) return

    if (line.varName) {
      const program = this.machineState.programs.get(line.programID) as Program
      const variable = program.variables.get(line.varName as string) as Variable

      const varValue =
        this.machineState.memory[variable.memoryPosition as number]

      this.machineState.monitor += `Retorno: ${varValue}`
      return
    }

    this.machineState.monitor += `Retorno: ${line.value}`
  }
}
