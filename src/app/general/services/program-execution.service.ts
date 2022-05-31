import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'
import {
  MEMORY_LINE_SEPARATOR,
  NOT_ASSIGNED_CELL,
} from '../constants/machine.constants'
import { PROCESS_PLANNING_METHOD } from '../interfaces/machine.interfaces'
import {
  CompoundMemoryItem,
  LINE_TYPE,
  Program,
} from '../interfaces/program.interfaces'

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
    private readonly messageService: MessageService,
    //Operations
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

  onNonExecutionLine = () => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program
    program.executionPosition += 1
    this.machineState.programs.set(programID, program)

    this.runProgram()
  }

  finalizeInstruction = () => {
    if (this.machineState.executionMode === 'not-pause') {
      setTimeout(() => this.runProgram(), 200)
    } else if (this.machineState.executionMode === 'step-by-step') {
      this.machineState.buttonsState = {
        ...this.machineState.buttonsState,
        nextInstruction: true,
      }
    }
  }

  onFinishAllProcess = () => {
    this.machineState.programInExecution = ''
    this.messageService.add({
      severity: 'success',
      summary: 'Todos los programas han finalizado su ejecucion',
    })
  }

  defineProgramInExecution = () => {
    const programList = Array.from(this.machineState.programs.values())
    const program = programList.find(
      (item) => !item.executionCompleted,
    ) as Program

    if (!program) return this.onFinishAllProcess()

    this.machineState.programInExecution = program.id

    switch (this.machineState.processPlanningMethod) {
      case PROCESS_PLANNING_METHOD.roundRobin: {
        program.avalaibleBursts = this.machineState.quantum
        break
      }
    }

    this.machineState.programs.set(program.id, program)

    this.runProgram()
  }

  FCFS = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    if (!program.executionCompleted) {
      !breakProcess && this.finalizeInstruction()
      return
    }

    const programList = Array.from(this.machineState.programs.values())
    const programIndex = programList.findIndex((item) => item.id === programID)

    const nextProgram = programList.find(
      (item, index) => index > programIndex && !item.executionCompleted,
    )

    if (!nextProgram) return this.onFinishAllProcess()

    this.machineState.programInExecution = nextProgram.id

    !breakProcess && this.finalizeInstruction()
  }

  roundRobin = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    program.avalaibleBursts -= 1

    this.machineState.programs.set(programID, program)

    if (program.avalaibleBursts > 0 && !program.executionCompleted) {
      !breakProcess && this.finalizeInstruction()
      return
    }

    const programList = Array.from(this.machineState.programs.values())
    const programIndex = programList.findIndex((item) => item.id === programID)

    let nextProgram = programList.find(
      (item, index) =>
        index > programIndex &&
        item.arrivalTime <= this.machineState.time &&
        !item.executionCompleted,
    )

    if (!nextProgram) {
      nextProgram = programList.find(
        (item, index) =>
          index < programIndex &&
          item.arrivalTime <= this.machineState.time &&
          !item.executionCompleted,
      )
    }

    if (!nextProgram && !program.executionCompleted) {
      nextProgram = program
    }

    if (!nextProgram) return this.onFinishAllProcess()

    nextProgram.avalaibleBursts = this.machineState.quantum
    this.machineState.programs.set(nextProgram.id, nextProgram)
    this.machineState.programInExecution = nextProgram.id

    !breakProcess && this.finalizeInstruction()
  }

  SJF = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    if (!program.executionCompleted) {
      !breakProcess && this.finalizeInstruction()
      return
    }

    const programList = Array.from(this.machineState.programs.values())

    let nextProgram: Program | null = null

    for (let item of programList) {
      if (!nextProgram) {
        nextProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      const currentRemainingBursts =
        nextProgram.length -
        nextProgram.executionPosition -
        nextProgram.variables.size * 2

      const itemRemainingBursts =
        item.length - item.executionPosition - item.variables.size * 2

      if (currentRemainingBursts > itemRemainingBursts) {
        nextProgram = item
      } else if (nextProgram.executionCompleted && !item.executionCompleted) {
        nextProgram = item
      } else if (
        currentRemainingBursts === itemRemainingBursts &&
        nextProgram.priority < item.priority
      ) {
        nextProgram = item
      }
    }

    if (!nextProgram || nextProgram.executionCompleted) {
      return this.onFinishAllProcess()
    }

    this.machineState.programInExecution = nextProgram.id

    !breakProcess && this.finalizeInstruction()
  }

  SJFExpropiative = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    const programList = Array.from(this.machineState.programs.values())

    if (!program.executionCompleted) {
      const remainingBursts =
        program.length - program.executionPosition - program.variables.size * 2

      const nextProgram = programList.find((item) => {
        const itemRemainingBursts =
          item.length - item.executionPosition - item.variables.size

        return (
          item.arrivalTime === this.machineState.time &&
          itemRemainingBursts < remainingBursts
        )
      })

      if (nextProgram) {
        this.machineState.programInExecution = nextProgram.id
      }

      !breakProcess && this.finalizeInstruction()
      return
    }

    let nextProgram: Program | null = null

    for (let item of programList) {
      if (!nextProgram) {
        nextProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      const currentRemainingBursts =
        nextProgram.length -
        nextProgram.executionPosition -
        nextProgram.variables.size * 2

      const itemRemainingBursts =
        item.length - item.executionPosition - item.variables.size * 2

      if (currentRemainingBursts > itemRemainingBursts) {
        nextProgram = item
      } else if (nextProgram.executionCompleted && !item.executionCompleted) {
        nextProgram = item
      } else if (
        currentRemainingBursts === itemRemainingBursts &&
        nextProgram.priority < item.priority
      ) {
        nextProgram = item
      }
    }

    if (!nextProgram || nextProgram.executionCompleted) {
      return this.onFinishAllProcess()
    }

    this.machineState.programInExecution = nextProgram.id

    !breakProcess && this.finalizeInstruction()
  }

  priority = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    if (!program.executionCompleted) {
      !breakProcess && this.finalizeInstruction()
      return
    }

    const programList = Array.from(this.machineState.programs.values())

    let nextProgram: Program | null = null

    for (let item of programList) {
      if (!nextProgram) {
        nextProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      if (nextProgram.priority < item.priority) {
        nextProgram = item
      } else if (nextProgram.executionCompleted && !item.executionCompleted) {
        nextProgram = item
      } else if (
        nextProgram.priority === item.priority &&
        nextProgram.arrivalTime > item.arrivalTime
      ) {
        nextProgram = item
      }
    }

    if (!nextProgram || nextProgram.executionCompleted) {
      return this.onFinishAllProcess()
    }

    this.machineState.programInExecution = nextProgram.id

    let minorPriorityProgram: Program | null = null

    for (let item of programList) {
      if (!minorPriorityProgram) {
        minorPriorityProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      if (minorPriorityProgram.priority > item.priority) {
        minorPriorityProgram = item
      } else if (
        minorPriorityProgram.executionCompleted &&
        !item.executionCompleted
      ) {
        minorPriorityProgram = item
      } else if (
        minorPriorityProgram.priority === item.priority &&
        minorPriorityProgram.arrivalTime > item.arrivalTime
      ) {
        minorPriorityProgram = item
      }
    }

    if (minorPriorityProgram) {
      minorPriorityProgram.priority += 1

      this.machineState.programs.set(
        minorPriorityProgram.id,
        minorPriorityProgram,
      )
    }

    !breakProcess && this.finalizeInstruction()
  }

  priorityExpropiative = ({ breakProcess }: { breakProcess: boolean }) => {
    const programID = this.machineState.programInExecution
    const program = this.machineState.programs.get(programID) as Program

    const programList = Array.from(this.machineState.programs.values())

    if (!program.executionCompleted) {
      const nextProgram = programList.find((item) => {
        return (
          item.arrivalTime === this.machineState.time &&
          item.priority > program.priority
        )
      })

      if (nextProgram) {
        this.machineState.programInExecution = nextProgram.id
      }

      !breakProcess && this.finalizeInstruction()
      return
    }

    let nextProgram: Program | null = null

    for (let item of programList) {
      if (!nextProgram) {
        nextProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      if (nextProgram.priority < item.priority) {
        nextProgram = item
      } else if (nextProgram.executionCompleted && !item.executionCompleted) {
        nextProgram = item
      } else if (
        nextProgram.priority === item.priority &&
        nextProgram.arrivalTime > item.arrivalTime
      ) {
        nextProgram = item
      }
    }

    if (!nextProgram || nextProgram.executionCompleted) {
      return this.onFinishAllProcess()
    }

    this.machineState.programInExecution = nextProgram.id

    let minorPriorityProgram: Program | null = null

    for (let item of programList) {
      if (!minorPriorityProgram) {
        minorPriorityProgram = item
        continue
      }

      if (item.executionCompleted) continue
      if (item.arrivalTime > this.machineState.time) continue

      if (minorPriorityProgram.priority > item.priority) {
        minorPriorityProgram = item
      } else if (
        minorPriorityProgram.executionCompleted &&
        !item.executionCompleted
      ) {
        minorPriorityProgram = item
      } else if (
        minorPriorityProgram.priority === item.priority &&
        minorPriorityProgram.arrivalTime > item.arrivalTime
      ) {
        minorPriorityProgram = item
      }
    }

    if (minorPriorityProgram) {
      minorPriorityProgram.priority += 1

      this.machineState.programs.set(
        minorPriorityProgram.id,
        minorPriorityProgram,
      )
    }

    !breakProcess && this.finalizeInstruction()
  }

  runProgram = () => {
    const programID = this.machineState.programInExecution

    if (!programID) return this.defineProgramInExecution()

    const program = this.machineState.programs.get(programID) as Program

    const memoryPosition =
      (program?.initialPosition as number) + program.executionPosition

    this.machineState.memoryRunningPosition = memoryPosition

    let lineInExecution: string | number | CompoundMemoryItem =
      this.machineState.memory[memoryPosition]

    lineInExecution = JSON.parse(
      lineInExecution.toString().split(MEMORY_LINE_SEPARATOR)[0],
    ) as CompoundMemoryItem

    this.machineState.memory[0] = program.savedAccumulator

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
        break

      case LINE_TYPE.go:
        this.operationGo.exec({ line: lineInExecution })
        break

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
        break

      case LINE_TYPE.return:
        program.executionCompleted = true
        this.machineState.programs.set(programID, program)
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

      default:
        return this.onNonExecutionLine()
    }

    this.machineState.logs.push({
      programID,
      memoryPosition,
      time: this.machineState.time,
      lineText: lineInExecution.lineText,
    })

    program.savedAccumulator = this.machineState.memory[0]
    this.machineState.memory[0] = 0

    this.machineState.time += 1

    if (
      lineInExecution.lineType !== LINE_TYPE.go &&
      lineInExecution.lineType !== LINE_TYPE.goIf
    ) {
      program.executionPosition += 1
    }

    this.machineState.programs.set(programID, program)

    const breakProcess = lineInExecution.lineType === LINE_TYPE.read

    //PROCCESS PLANNING METHODS
    switch (this.machineState.processPlanningMethod) {
      case PROCESS_PLANNING_METHOD.fcfs:
        return this.FCFS({ breakProcess })

      case PROCESS_PLANNING_METHOD.roundRobin:
        return this.roundRobin({ breakProcess })

      case PROCESS_PLANNING_METHOD.sjf:
        return this.SJF({ breakProcess })

      case PROCESS_PLANNING_METHOD.sjfExpropiative:
        return this.SJFExpropiative({ breakProcess })

      case PROCESS_PLANNING_METHOD.priority:
        return this.priority({ breakProcess })

      case PROCESS_PLANNING_METHOD.priorityExpropiative:
        return this.priorityExpropiative({ breakProcess })
    }
  }
}
