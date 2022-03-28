import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'

import { LINE_TYPE, Program } from '../interfaces/program.interfaces'
import { MEMORY_LINE_SEPARATOR } from '../constants/machine.constants'
import { MachineStateService } from './machine-state.service'

//Rules
import { RuleAdd } from './rules/rule-add.service'
import { RuleAND } from './rules/rule-and.service'
import { RuleConcatenate } from './rules/rule-concatenate.service'
import { RuleDelete } from './rules/rule-delete.service'
import { RuleDivision } from './rules/rule-division.service'
import { RuleExponentiation } from './rules/rule-exponentiation.service'
import { RuleExtract } from './rules/rule-extract.service'
import { RuleGoIf } from './rules/rule-go-if.service'
import { RuleGo } from './rules/rule-go.service'
import { RuleLabel } from './rules/rule-label.service'
import { RuleLoad } from './rules/rule-load.service'
import { RuleModule } from './rules/rule-module.service'
import { RuleMultiply } from './rules/rule-multiply.service'
import { RuleNew } from './rules/rule-new.service'
import { RuleNOT } from './rules/rule-not.service'
import { RuleOR } from './rules/rule-or.service'
import { RulePrint } from './rules/rule-print.service'
import { RuleRead } from './rules/rule-read.service'
import { RuleReturn } from './rules/rule-return.service'
import { RuleShow } from './rules/rule-show.service'
import { RuleStore } from './rules/rule-store.service'
import { RuleSubtract } from './rules/rule-subtract.service'

@Injectable()
export class CodeService {
  constructor(
    private readonly messageService: MessageService,
    private readonly machineState: MachineStateService,
    private readonly ruleNew: RuleNew,
    private readonly ruleLabel: RuleLabel,
    private readonly ruleLoad: RuleLoad,
    private readonly ruleStore: RuleStore,
    private readonly ruleRead: RuleRead,
    private readonly ruleAdd: RuleAdd,
    private readonly ruleSubtract: RuleSubtract,
    private readonly ruleMultiply: RuleMultiply,
    private readonly ruleDivision: RuleDivision,
    private readonly ruleExponentiation: RuleExponentiation,
    private readonly ruleModule: RuleModule,
    private readonly ruleConcatenate: RuleConcatenate,
    private readonly ruleDelete: RuleDelete,
    private readonly ruleExtract: RuleExtract,
    private readonly ruleAND: RuleAND,
    private readonly ruleOR: RuleOR,
    private readonly ruleNOT: RuleNOT,
    private readonly ruleShow: RuleShow,
    private readonly rulePrint: RulePrint,
    private readonly ruleGo: RuleGo,
    private readonly ruleGoIf: RuleGoIf,
    private readonly ruleReturn: RuleReturn,
  ) {}

  analyzeAndLoad = () => {
    this.machineState.code = []
    this.machineState.programsInReview.clear()
    this.machineState.codeErrors = []

    if (!this.machineState.rawCode) return

    this.orderCode()

    const programID = (
      Math.floor(Math.random() * (9999 - 999)) + 999
    ).toString()
    const programLength = this.machineState.code.length
    const programName = this.machineState.fileName

    this.machineState.programsInReview.set(programID, {
      id: programID,
      length: programLength,
      name: programName,
      memoryBlock: [],
      variables: new Map(),
      labels: new Map(),
      initialPosition: null,
      lastPosition: null,
    })

    this.analyzeCode({ programID })

    const isValidProgram = this.verifyErrors({ programID })

    if (!isValidProgram) return

    this.loadToMemory({ programID })

    this.machineState.buttonsState = {
      ...this.machineState.buttonsState,
      runNotPause: true,
      runStepByStep: true,
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Programa cargado en memoria',
      detail: 'El programa se ha cargado correctamente en la memoria',
    })

    // console.log('ERRORS: ', this.machineState.codeErrors)

    // console.log('MEMORY: ', this.machineState.memory)

    // this.machineState.programs.forEach((value, key) => {
    //   console.log(`------------> Program: ${key} <-----------`)

    //   console.log(value)

    //   console.log('              ------> Variables <------               ')
    //   value.variables.forEach((value, key) =>
    //     console.log(`VAR[ ${key} ] = `, value),
    //   )

    //   console.log('              ------> Labels <------               ')
    //   value.labels.forEach((value, key) =>
    //     console.log(`LABEL[ ${key} ] = `, value),
    //   )
    // })

    // this.machineState.programsInReview.forEach((value, key) => {
    //   console.log(`------------> Program: ${key} <-----------`)

    //   console.log(value)

    //   console.log('              ------> Variables <------               ')
    //   value.variables.forEach((value, key) =>
    //     console.log(`VAR[ ${key} ] = `, value),
    //   )

    //   console.log('              ------> Labels <------               ')
    //   value.labels.forEach((value, key) =>
    //     console.log(`LABEL[ ${key} ] = `, value),
    //   )
    // })
  }

  orderCode = () => {
    let result: string[] | string[][] = this.machineState.rawCode
      .trim()
      .split('\n')

    result = result.map((line) => {
      return line
        .trim()
        .split(' ')
        .filter((word) => word !== '' && word !== ' ')
    })

    result = result.filter((line) => line.length > 0)

    if (!result.length) return

    result = result.filter((line) => line[0].substring(0, 2) !== '//')

    const cleanRawCode: string = result.reduce((prev, curr) => {
      const line = curr.join(' ')
      return prev ? `${prev}\n${line}` : line
    }, '')

    this.machineState.rawCode = cleanRawCode
    this.machineState.code = result
  }

  analyzeCode = ({ programID }: { programID: string }) => {
    this.machineState.code.forEach((line, linePosition) => {
      if (line[0] === LINE_TYPE.label) {
        this.ruleLabel.check({ programID, linePosition })
      }
    })

    this.machineState.code.forEach((line, linePosition) => {
      switch (line[0].toLowerCase()) {
        case LINE_TYPE.new:
          this.ruleNew.check({ programID, linePosition })
          break

        case LINE_TYPE.label:
          const program = this.machineState.programsInReview.get(
            programID,
          ) as Program

          if (program.labels.get(line[1])) {
            program.memoryBlock.push({
              programID,
              lineText: `${line.join(' ')}`,
              lineType: LINE_TYPE.label,
              labelName: line[1],
              labelValue: Number(line[2]),
              memoryPosition: null,
            })

            this.machineState.programsInReview.set(programID, program)
          }
          break

        case LINE_TYPE.load:
          this.ruleLoad.check({ programID, linePosition })
          break

        case LINE_TYPE.store:
          this.ruleStore.check({ programID, linePosition })
          break

        case LINE_TYPE.read:
          this.ruleRead.check({ programID, linePosition })
          break

        case LINE_TYPE.add:
          this.ruleAdd.check({ programID, linePosition })
          break

        case LINE_TYPE.subtract:
          this.ruleSubtract.check({ programID, linePosition })
          break

        case LINE_TYPE.multiply:
          this.ruleMultiply.check({ programID, linePosition })
          break

        case LINE_TYPE.division:
          this.ruleDivision.check({ programID, linePosition })
          break

        case LINE_TYPE.exponentiation:
          this.ruleExponentiation.check({ programID, linePosition })
          break

        case LINE_TYPE.module:
          this.ruleModule.check({ programID, linePosition })
          break

        case LINE_TYPE.concatenate:
          this.ruleConcatenate.check({ programID, linePosition })
          break

        case LINE_TYPE.delete:
          this.ruleDelete.check({ programID, linePosition })
          break

        case LINE_TYPE.extract:
          this.ruleExtract.check({ programID, linePosition })
          break

        case LINE_TYPE.AND.toLowerCase():
          this.ruleAND.check({ programID, linePosition })
          break

        case LINE_TYPE.OR.toLowerCase():
          this.ruleOR.check({ programID, linePosition })
          break

        case LINE_TYPE.NOT.toLowerCase():
          this.ruleNOT.check({ programID, linePosition })
          break

        case LINE_TYPE.show:
          this.ruleShow.check({ programID, linePosition })
          break

        case LINE_TYPE.print:
          this.rulePrint.check({ programID, linePosition })
          break

        case LINE_TYPE.go:
          this.ruleGo.check({ programID, linePosition })
          break

        case LINE_TYPE.goIf:
          this.ruleGoIf.check({ programID, linePosition })
          break

        case LINE_TYPE.return:
          this.ruleReturn.check({ programID, linePosition })
          break

        default:
          this.machineState.codeErrors.push({
            programID,
            line: linePosition + 1,
            text: `La linea iniciada con "${line[0]}" no fue reconocida como sintaxis valida del sistema`,
          })
          break
      }
    })
  }

  verifyErrors = ({ programID }: { programID: string }): boolean => {
    if (this.machineState.codeErrors.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ups, hay errores en tu codigo!',
        detail:
          'Hay errores en su codigo, verifique y realice nuevamente un analisis',
      })

      return false
    }

    const program = this.machineState.programsInReview.get(programID) as Program

    if (
      program.length >
      this.machineState.memoryCount -
        this.machineState.lastMemoryAssignedPosition
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Memoria insuficiente!',
        detail:
          'El tamaño del programa excede la capacidad de memoria disponible',
      })

      return false
    }

    return true
  }

  loadToMemory = ({ programID }: { programID: string }) => {
    const program = this.machineState.programsInReview.get(programID) as Program

    program.initialPosition = this.machineState.lastMemoryAssignedPosition + 1
    program.lastPosition =
      this.machineState.lastMemoryAssignedPosition + program.length

    this.machineState.lastMemoryAssignedPosition += program.length

    program.variables.forEach((variable, varName) => {
      variable.memoryPosition =
        this.machineState.lastMemoryAssignedPosition -
        program.variables.size +
        variable.declarationOrder

      program.variables.set(varName, variable)

      program.memoryBlock.push(variable.value)

      this.machineState.allVariables.push(variable)
    })

    program.labels.forEach((label, labelName) => {
      label.memoryPosition =
        <number>program.initialPosition + label.programPosition

      program.labels.set(labelName, label)

      this.machineState.allLabels.push(label)
    })

    this.machineState.memory.splice(
      this.machineState.lastMemoryAssignedPosition + 1 - program.length,
      program.length,
      ...program.memoryBlock.map((item) => {
        if (typeof item === 'string' || typeof item === 'number') return item
        return `${JSON.stringify(item)}${MEMORY_LINE_SEPARATOR}${item.lineText}`
      }),
    )

    this.machineState.programs.set(programID, program)
    this.machineState.programsInReview.clear()
    this.machineState.code = []
  }
}
