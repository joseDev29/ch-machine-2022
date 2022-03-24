import { Injectable } from '@angular/core'

import {
  LINE_TYPE,
  VARIABLE_TYPE,
  Program,
} from '../../interfaces/program.interfaces'
import { CheckParams } from '../../interfaces/rule.interfaces'

import { MachineStateService } from '../machine-state.service'

@Injectable()
export class RuleNew {
  constructor(private readonly machineState: MachineStateService) {}

  check = ({ programID, linePosition }: CheckParams) => {
    const line = this.machineState.code[linePosition]

    if (line.length > 4)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `La declaracion de un nueva variable solo debe tener maximo parametros, se encontro un parametro extra: ${line[4]}`,
      })

    const varName = line[1]
    const varType = line[2]

    let varValue: string | number = line[3]

    if (!varName)
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `Se declara la iniciacion de una variable pero no se especifica su nombre`,
      })

    if (
      !/[a-zA-Z]/.test(varName[0]) &&
      varName[0] !== '$' &&
      varName[0] !== '_'
    )
      return `La palabra '${varName}' no es valida para nombrar un variable, el nombre de una variable solo puede iniciar con una letra o alguno de los siguientes simbolos '$' o '_'`

    if (
      !varType &&
      varType !== VARIABLE_TYPE.integer &&
      varType !== VARIABLE_TYPE.chain &&
      varType !== VARIABLE_TYPE.real &&
      varType !== VARIABLE_TYPE.bool
    )
      return this.machineState.codeErrors.push({
        programID,
        line: linePosition + 1,
        text: `El tipo de la variable ${varName} no es valido`,
      })

    switch (varType) {
      case VARIABLE_TYPE.integer:
        varValue = !varValue ? 0 : Number(varValue)

        if (Number.isNaN(varValue) || !Number.isInteger(varValue))
          return this.machineState.codeErrors.push({
            programID,
            line: linePosition + 1,
            text: `El valor de la variable ${varName} declarada como entero 'I' no es entero`,
          })

        break

      case VARIABLE_TYPE.chain:
        varValue = !varValue ? '' : String(varValue)
        break

      case VARIABLE_TYPE.real:
        varValue = !varValue ? 0 : Number(varValue)

        if (Number.isNaN(varValue))
          return this.machineState.codeErrors.push({
            programID,
            line: linePosition + 1,
            text: `El valor de la variable ${varName} declarada como real 'R' no es real`,
          })

        break

      case VARIABLE_TYPE.bool:
        varValue = !varValue ? 0 : Number(varValue)

        if (Number.isNaN(varValue) || (varValue !== 0 && varValue !== 1))
          return this.machineState.codeErrors.push({
            programID,
            line: linePosition + 1,
            text: `El valor de la variable ${varName} declarada como logico 'L' no es logico`,
          })
        break

      default:
        return this.machineState.codeErrors.push({
          programID,
          line: linePosition + 1,
          text: `El tipo de la variable ${varName} no es valido`,
        })
    }

    const program = this.machineState.programsInReview.get(programID) as Program

    program.variables.set(varName, {
      programID,
      name: varName,
      type: varType,
      value: varValue,
      declarationOrder: program?.variables.size + 1,
      programPosition: program.length,
      memoryPosition: null,
    })

    program.memoryBlock.push({
      programID,
      varName,
      varType,
      varValue,
      lineText: `${line.join(' ')}`,
      lineType: LINE_TYPE.new,
      programPosition: program.length,
      memoryPosition: null,
    })

    program.length += 1

    return this.machineState.programsInReview.set(programID, program)
  }
}
