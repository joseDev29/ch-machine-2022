import { Injectable } from '@angular/core'
import {
  LINE_TYPE,
  Program,
  VARIABLE_TYPE,
} from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleReturn {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const value = line[1] as string | number | null

    if (line.length > 2)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Sintaxis no reconocida ${line[2]}`,
      })

    if (linePosition + 1 !== program.length - program.variables.size)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La instruccion "retorne" debe ser la ultima en el programa`,
      })

    if (!value && value !== 0) {
      program.memoryBlock.push({
        programID,
        value: null,
        varName: '',
        lineText: `${line.join(' ')}`,
        lineType: LINE_TYPE.return,
      })
      return this.machineState.programsInReview.set(programID, program)
    } else if (Number.isInteger(Number(value))) {
      program.memoryBlock.push({
        programID,
        value: null,
        varName: '',
        lineText: `${line.join(' ')}`,
        lineType: LINE_TYPE.return,
      })
      return this.machineState.programsInReview.set(programID, program)
    }

    const variable = program.variables.get(value as string)

    if (!variable)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La variable ${value} indicada en la declaracion de retorno, no existe en el programa`,
      })

    if (variable.type !== VARIABLE_TYPE.integer)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La variable ${value} indicada en la declaracion de retorno, no es de un tipo valido para la operacion`,
      })

    program.memoryBlock.push({
      programID,
      varName: value as string,
      value: null,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.return,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
