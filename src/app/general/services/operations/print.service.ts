import { Injectable } from '@angular/core'
import { OperationExecParams } from '../../interfaces/execution.interfaces'
import { Program, Variable } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Print {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    if (line.var1Name === 'acumulador') {
      this.machineState.printer.push(`${this.machineState.memory[0]}\n`)
      return
    }

    const program = this.machineState.programs.get(line.programID) as Program
    const variable = program.variables.get(line.varName as string) as Variable

    const varValue = this.machineState.memory[
      variable.memoryPosition as number
    ] as number

    this.machineState.printer.push(`${varValue}\n`)
  }
}
