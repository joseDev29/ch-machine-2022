import { Injectable } from '@angular/core'

import { OperationExecParams } from '../../interfaces/execution.interfaces'
import {
  Program,
  Variable,
  VARIABLE_TYPE,
} from '../../interfaces/program.interfaces'

import { MachineStateService } from '../machine-state.service'

@Injectable()
export class Read {
  constructor(private readonly machineState: MachineStateService) {}

  exec = ({ line }: OperationExecParams) => {
    const program = this.machineState.programs.get(line.programID) as Program
    const variable = program.variables.get(line.varName as string) as Variable

    this.machineState.readOperationInput = {
      active: true,
      value: '',
      memoryPosition: variable.memoryPosition as number,
      varType: variable.type as VARIABLE_TYPE,
    }
  }
}
