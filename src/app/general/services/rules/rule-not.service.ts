import { Injectable } from '@angular/core'
import {
  LINE_TYPE,
  Program,
  VARIABLE_TYPE,
} from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleNOT {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const var1Name = line[1]
    const var2Name = line[2]

    if (!var1Name || !var2Name)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: 'Se hace una declaracion "NO" pero no se especifican las 3 variable requeridas',
      })

    if (line.length > 3)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Sintaxis no reconocida ${line[4]}`,
      })

    const variable1 = program.variables.get(var1Name)
    const varibale2 = program.variables.get(var2Name)

    if (!variable1 || !varibale2)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Una de las variables especificadas en la sentencia NO, no existe en el programa`,
      })

    if (
      variable1.type !== VARIABLE_TYPE.bool ||
      varibale2.type !== VARIABLE_TYPE.bool
    )
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Una de las variables especificadas en la sentencia NO, no tiene un tipo no valido para realizar la operacion`,
      })

    program.memoryBlock.push({
      programID,
      var1Name,
      var2Name,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.NOT,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
