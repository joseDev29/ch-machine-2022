import { Injectable } from '@angular/core'
import { LINE_TYPE, Program } from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'
import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleGoIf {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]
    const program = this.machineState.programsInReview.get(programID) as Program

    const label1Name = line[1]
    const label2Name = line[2]

    if (!label1Name || !label2Name)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: 'Se hace una declaracion "vayasi" pero no se especifican las 2 etiquetas requeridas',
      })

    if (line.length > 3)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Sintaxis no reconocida ${line[2]}`,
      })

    const label1 = program.labels.get(label1Name)
    const label2 = program.labels.get(label2Name)

    if (!label1 || !label2)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Una de las etiquetas ${label1Name} o ${label2Name} indicadas en la declaracion "vayasi", no existe en el programa`,
      })

    program.memoryBlock.push({
      programID,
      label1Name,
      label2Name,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.goIf,
    })

    return this.machineState.programsInReview.set(programID, program)
  }
}
