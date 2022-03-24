import { Injectable } from '@angular/core'
import { LINE_TYPE, Program } from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RulePrint {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const varName = line[1]

    if (!varName)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: 'Se hace una declaracion "imprima" pero no se especifica la variable requerida',
      })

    if (line.length > 2)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Sintaxis no reconocida ${line[2]}`,
      })

    const variable = program.variables.get(varName)

    if (!variable && varName !== 'acumulador')
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La variable ${varName} indicada en la declaracion de imprimir, no existe en el programa`,
      })

    program.memoryBlock.push({
      programID,
      varName,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.print,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
