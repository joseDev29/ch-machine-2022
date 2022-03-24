import { Injectable } from '@angular/core'
import { LINE_TYPE, Program } from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleGo {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const labelName = line[1]

    if (!labelName)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: 'Se hace una declaracion "vaya" pero no se especifica la etiqueta requerida',
      })

    if (line.length > 2)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Sintaxis no reconocida ${line[2]}`,
      })

    const label = program.labels.get(labelName)

    if (!label)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La etiqueta ${labelName} indicada en la declaracion vaya, no existe en el programa`,
      })

    program.memoryBlock.push({
      programID,
      labelName,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.go,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
