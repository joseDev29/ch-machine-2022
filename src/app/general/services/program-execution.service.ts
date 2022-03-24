import { Injectable } from '@angular/core'
import {
  MEMORY_LINE_SEPARATOR,
  NOT_ASSIGNED_CELL,
} from '../constants/machine.constants'
import { CompoundMemoryItem, LINE_TYPE } from '../interfaces/program.interfaces'

import { MachineStateService } from './machine-state.service'

//Operations
import { Add } from './operations/add.service'
import { AND } from './operations/and.service'
import { Concatenate } from './operations/concatenate.service'
import { Delete } from './operations/delete.service'
import { Division } from './operations/division.service'
import { Exponentiation } from './operations/exponentation.service'
import { Extract } from './operations/extract.service'
import { GoIf } from './operations/go-if.service'
import { Go } from './operations/go.service'
import { Load } from './operations/load.service'
import { Module } from './operations/module.service'
import { Multiply } from './operations/multiply.service'
import { NOT } from './operations/not.service'
import { OR } from './operations/or.service'
import { Print } from './operations/print.service'
import { Read } from './operations/read.service'
import { Return } from './operations/return.service'
import { Show } from './operations/show.service'
import { Store } from './operations/store.service'
import { Subtract } from './operations/subtract.service'

@Injectable()
export class ProgramExecutionService {
  constructor(
    private readonly machineState: MachineStateService,
    private readonly operationAdd: Add,
    private readonly operationAND: AND,
    private readonly operationConcatenate: Concatenate,
    private readonly operationDelete: Delete,
    private readonly operationDivision: Division,
    private readonly operationExponentation: Exponentiation,
    private readonly operationExtract: Extract,
    private readonly operationGoIf: GoIf,
    private readonly operationGo: Go,
    private readonly operationLoad: Load,
    private readonly operationModule: Module,
    private readonly operationMultiply: Multiply,
    private readonly operationNOT: NOT,
    private readonly operationOR: OR,
    private readonly operationPrint: Print,
    private readonly operationRead: Read,
    private readonly operationReturn: Return,
    private readonly operationShow: Show,
    private readonly operationStore: Store,
    private readonly operationSubtract: Subtract,
  ) {}

  runProgram = (): any => {
    this.machineState.memoryRunningPosition += 1

    let lineInExecution: string | number | CompoundMemoryItem =
      this.machineState.memory[this.machineState.memoryRunningPosition]

    let nextLine: string | number | CompoundMemoryItem =
      this.machineState.memory[this.machineState.memoryRunningPosition + 1]

    const isValidLine = lineInExecution
      .toString()
      .includes(MEMORY_LINE_SEPARATOR)

    if (!isValidLine && nextLine === NOT_ASSIGNED_CELL) return

    const isValidNextLine = nextLine.toString().includes(MEMORY_LINE_SEPARATOR)

    if (!isValidLine && !isValidNextLine) return this.runProgram()

    nextLine = JSON.parse(
      nextLine.toString().split(MEMORY_LINE_SEPARATOR)[0],
    ) as CompoundMemoryItem

    if (
      !isValidLine &&
      nextLine.programID !== this.machineState.programInExecution
    ) {
      this.machineState.memory[0] = 0
      this.machineState.monitor = ''
      this.machineState.printer = ''

      return this.finalizeInstruction()
    }

    lineInExecution = JSON.parse(
      lineInExecution.toString().split(MEMORY_LINE_SEPARATOR)[0],
    ) as CompoundMemoryItem

    switch (lineInExecution.lineType) {
      case LINE_TYPE.add:
        this.operationAdd.exec({ line: lineInExecution })
        break
      case LINE_TYPE.AND:
        this.operationAND.exec({ line: lineInExecution })
        break
      case LINE_TYPE.concatenate:
        this.operationConcatenate.exec({ line: lineInExecution })
        break
      case LINE_TYPE.delete:
        this.operationDelete.exec({ line: lineInExecution })
        break
      case LINE_TYPE.division:
        this.operationDivision.exec({ line: lineInExecution })
        break
      case LINE_TYPE.exponentiation:
        this.operationExponentation.exec({ line: lineInExecution })
        break
      case LINE_TYPE.extract:
        this.operationExtract.exec({ line: lineInExecution })
        break
      case LINE_TYPE.goIf:
        this.operationGoIf.exec({ line: lineInExecution })
        return this.finalizeInstruction()
      case LINE_TYPE.go:
        this.operationGo.exec({ line: lineInExecution })
        return this.finalizeInstruction()
      case LINE_TYPE.load:
        this.operationLoad.exec({ line: lineInExecution })
        break
      case LINE_TYPE.module:
        this.operationModule.exec({ line: lineInExecution })
        break
      case LINE_TYPE.multiply:
        this.operationMultiply.exec({ line: lineInExecution })
        break
      case LINE_TYPE.NOT:
        this.operationNOT.exec({ line: lineInExecution })
        break
      case LINE_TYPE.OR:
        this.operationOR.exec({ line: lineInExecution })
        break
      case LINE_TYPE.print:
        this.operationPrint.exec({ line: lineInExecution })
        break
      case LINE_TYPE.read:
        this.operationRead.exec({ line: lineInExecution })
        return
      case LINE_TYPE.return:
        this.operationReturn.exec({ line: lineInExecution })
        break
      case LINE_TYPE.show:
        this.operationShow.exec({ line: lineInExecution })
        break
      case LINE_TYPE.store:
        this.operationStore.exec({ line: lineInExecution })
        break
      case LINE_TYPE.subtract:
        this.operationSubtract.exec({ line: lineInExecution })
        break
    }

    return this.finalizeInstruction()
  }

  finalizeInstruction = () => {
    if (this.machineState.executionMode === 'not-pause') {
      return this.runProgram()
    } else if (this.machineState.executionMode === 'step-by-step') {
      this.machineState.buttonsState = {
        ...this.machineState.buttonsState,
        nextInstruction: true,
      }
      return
    }
  }
}
