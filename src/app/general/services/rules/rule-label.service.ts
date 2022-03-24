import { Injectable } from '@angular/core'

import { Program } from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleLabel {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const labelName = line[1]
    let labelValue: string | number = line[2]

    if (!labelName || !labelValue || line.length > 3)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La sintaxis de declaracion de la etiqueta no es valida`,
      })

    labelValue = Number(labelValue)

    if (Number.isNaN(labelValue) || !Number.isInteger(labelValue))
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `El valor indicado para la etiqueta ${labelName} no es valido`,
      })

    if (labelValue > program.length)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition,
        text: `La posicion de programa indicada en la etiqueta ${labelName} no existe en el programa`,
      })

    program.labels.set(labelName, {
      programID,
      name: labelName,
      programPosition: labelValue - 1,
      memoryPosition: null,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
