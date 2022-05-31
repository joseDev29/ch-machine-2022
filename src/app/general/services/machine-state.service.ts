import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'
import { NOT_ASSIGNED_CELL } from '../constants/machine.constants'

import {
  ButtonsState,
  ExecutionMode,
  Log,
  MachineConditionalOptionsModalState,
  MachineState,
  PROCESS_PLANNING_METHOD,
  ProgramOptionsModalState,
  ReadOperationInput,
} from '../interfaces/machine.interfaces'
import {
  CodeError,
  Label,
  Program,
  Variable,
  VARIABLE_TYPE,
} from '../interfaces/program.interfaces'

interface SetConditionalOptionsParams {
  quantum: number
}

const INITIAL_BUTTONS_STATE: ButtonsState = {
  initMachine: true,
  resetMachine: false,
  planningMethod: true,
  kernel: true,
  memory: true,
  codeEditor: false,
  uploadCode: false,
  downloadCode: false,
  analyzeCode: false,
  runNotPause: false,
  runStepByStep: false,
  resetMemoryPosition: false,
  nextInstruction: false,
}

const DEFAULT_MEMORY_COUNT: number = 150
const DEFAULT_KERNEL_COUNT: number = 30 /*109*/

const INITIAL_READ_OPERATION_INPUT: ReadOperationInput = {
  active: false,
  value: '',
  memoryPosition: 0,
  varType: VARIABLE_TYPE.chain,
}

@Injectable()
export class MachineStateService {
  public MAX_MEMORY_COUNT: number = 10100
  public MIN_MEMORY_COUNT: number = 80
  public MIN_KERNEL_COUNT: number = 25

  public buttonsState: ButtonsState = INITIAL_BUTTONS_STATE

  public state: MachineState = 'NO INICIADA'
  public memoryCount: number = DEFAULT_MEMORY_COUNT
  public kernelCount: number = DEFAULT_KERNEL_COUNT

  public processPlanningMethod: PROCESS_PLANNING_METHOD =
    PROCESS_PLANNING_METHOD.fcfs

  public fileName: string = ''
  public rawCode: string = ''
  public code: string[][] = []

  public quantum: number = 0

  public machineConditionalOptionsModalState: MachineConditionalOptionsModalState =
    {
      visible: false,
    }

  public programOptionsModalState: ProgramOptionsModalState = {
    visible: false,
    programID: '',
  }

  public time: number = 0

  public memory: Array<string | number> = [0]
  public lastMemoryAssignedPosition = 0
  public programs: Map<string, Program> = new Map()
  public memoryRunningPosition: number = 0
  public programInExecution: string = ''
  public executionMode: ExecutionMode = ''

  public allVariables: Variable[] = []
  public allLabels: Label[] = []

  public programsInReview: Map<string, Program> = new Map()

  public codeErrors: CodeError[] = []

  public logs: Log[] = []
  public monitor: string[] = []
  public printer: string[] = []

  public readOperationInput: ReadOperationInput = INITIAL_READ_OPERATION_INPUT

  constructor(private readonly messageService: MessageService) {}

  initMachine = () => {
    if (this.kernelCount >= this.memoryCount)
      return this.messageService.add({
        severity: 'danger',
        summary: 'Error al iniciar la maquina',
        detail: 'El valor del kernel no debe ser mayor al de la memoria',
      })

    this.memory = Array.from({ length: this.memoryCount }, (_, index) => {
      if (index === 0) return 0

      if (index <= this.kernelCount) return `Kernel`

      return NOT_ASSIGNED_CELL
    })

    this.lastMemoryAssignedPosition += this.kernelCount

    this.state = 'KERNEL'

    this.memoryRunningPosition += this.kernelCount

    if (this.processPlanningMethod === PROCESS_PLANNING_METHOD.roundRobin) {
      this.machineConditionalOptionsModalState = {
        visible: true,
      }
      return
    }

    this.onFinishInit()
  }

  setConditionalOptions = ({ quantum }: SetConditionalOptionsParams) => {
    this.quantum = quantum
    this.onFinishInit()
  }

  onFinishInit = () => {
    this.buttonsState = {
      ...this.buttonsState,
      initMachine: false,
      planningMethod: false,
      resetMachine: true,
      memory: false,
      kernel: false,
      analyzeCode: true,
      uploadCode: true,
      downloadCode: true,
      codeEditor: true,
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Maquina iniciada exitosamente',
    })
  }

  resetMachine = () => {
    this.buttonsState = INITIAL_BUTTONS_STATE
    this.state = 'NO INICIADA'
    this.memoryCount = DEFAULT_MEMORY_COUNT
    this.kernelCount = DEFAULT_KERNEL_COUNT
    this.processPlanningMethod = PROCESS_PLANNING_METHOD.fcfs
    this.fileName = ''
    this.rawCode = ''
    this.code = []
    this.memory = [0]
    this.lastMemoryAssignedPosition = 0
    this.programs = new Map()
    this.allVariables = []
    this.allLabels = []
    this.programsInReview = new Map()
    this.codeErrors = []
    this.logs = []
    this.monitor = []
    this.printer = []
    this.memoryRunningPosition = 0
    this.programInExecution = ''
    this.executionMode = ''
    this.readOperationInput = INITIAL_READ_OPERATION_INPUT

    this.messageService.add({
      severity: 'success',
      summary: 'Maquina reseteada exitosamente',
    })
  }
}
