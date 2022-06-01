import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { PrimeNgModule } from '../prime-ng/prime-ng.module'

import { HomeComponent } from './views/home/home.component'

import { MemoryItemPipe } from './pipes/memory-item.pipe'
import { ParseProgramMap } from './pipes/parse-program-map.pipe'

//Services
import { MachineStateService } from './services/machine-state.service'
import { FileService } from './services/file.service'
import { CodeService } from './services/code.service'
import { ProgramExecutionService } from './services/program-execution.service'

//Components
import { MemoryTableComponent } from './components/memory-table/memory-table.component'
import { LabelsTableComponent } from './components/labels-table/labels-table.component'
import { VariablesTableComponent } from './components/variables-table/variables-table.component'
import { ProgramsTableComponent } from './components/programs-table/programs-table.component'
import { CodeErrorsTableComponent } from './components/code-errors-table/code-errors-table.component'
import { PrinterComponent } from './components/printer/printer.component'
import { MonitorComponent } from './components/monitor/monitor.component'
import { CodeOptionsComponent } from './components/code-options/code-options.component'
import { ExecutionOptionsComponent } from './components/execution-options/execution-options.component'
import { MachineOptionsComponent } from './components/machine-options/machine-options.component'
import { ProgramOptionsModalComponent } from './components/program-options-modal/program-options-modal.component'
import { PlanningDataTableComponent } from './components/planning-data-table/planning-data-table.component'
import { MachineConditionalOptionsModalComponent } from './components/machine-conditional-options-modal/machine-conditional-options-modal.component'
import { LogsMonitor } from './components/logs-monitor/logs-monitor.component'
import { MemoryPartitionsComponent } from './components/memory-partitions/memory-partitions.component'

//Rules
import { RuleNew } from './services/rules/rule-new.service'
import { RuleLabel } from './services/rules/rule-label.service'
import { RuleLoad } from './services/rules/rule-load.service'
import { RuleStore } from './services/rules/rule-store.service'
import { RuleRead } from './services/rules/rule-read.service'
import { RuleAdd } from './services/rules/rule-add.service'
import { RuleSubtract } from './services/rules/rule-subtract.service'
import { RuleMultiply } from './services/rules/rule-multiply.service'
import { RuleDivision } from './services/rules/rule-division.service'
import { RuleExponentiation } from './services/rules/rule-exponentiation.service'
import { RuleModule } from './services/rules/rule-module.service'
import { RuleConcatenate } from './services/rules/rule-concatenate.service'
import { RuleDelete } from './services/rules/rule-delete.service'
import { RuleExtract } from './services/rules/rule-extract.service'
import { RuleAND } from './services/rules/rule-and.service'
import { RuleOR } from './services/rules/rule-or.service'
import { RuleNOT } from './services/rules/rule-not.service'
import { RuleShow } from './services/rules/rule-show.service'
import { RulePrint } from './services/rules/rule-print.service'
import { RuleGo } from './services/rules/rule-go.service'
import { RuleGoIf } from './services/rules/rule-go-if.service'
import { RuleReturn } from './services/rules/rule-return.service'

//Operations
import { Add } from './services/operations/add.service'
import { AND } from './services/operations/and.service'
import { Concatenate } from './services/operations/concatenate.service'
import { Delete } from './services/operations/delete.service'
import { Division } from './services/operations/division.service'
import { Exponentiation } from './services/operations/exponentation.service'
import { Extract } from './services/operations/extract.service'
import { GoIf } from './services/operations/go-if.service'
import { Go } from './services/operations/go.service'
import { Load } from './services/operations/load.service'
import { Module } from './services/operations/module.service'
import { Multiply } from './services/operations/multiply.service'
import { NOT } from './services/operations/not.service'
import { OR } from './services/operations/or.service'
import { Print } from './services/operations/print.service'
import { Read } from './services/operations/read.service'
import { Return } from './services/operations/return.service'
import { Show } from './services/operations/show.service'
import { Store } from './services/operations/store.service'
import { Subtract } from './services/operations/subtract.service'

@NgModule({
  declarations: [
    MemoryItemPipe,
    ParseProgramMap,
    HomeComponent,
    MemoryTableComponent,
    LabelsTableComponent,
    VariablesTableComponent,
    ProgramsTableComponent,
    CodeErrorsTableComponent,
    PrinterComponent,
    MonitorComponent,
    CodeOptionsComponent,
    ExecutionOptionsComponent,
    MachineOptionsComponent,
    ProgramOptionsModalComponent,
    PlanningDataTableComponent,
    MachineConditionalOptionsModalComponent,
    LogsMonitor,
    MemoryPartitionsComponent,
  ],
  imports: [CommonModule, PrimeNgModule, FormsModule],
  exports: [HomeComponent],
  providers: [
    MachineStateService,
    FileService,
    CodeService,
    ProgramExecutionService,
    //Rules
    RuleNew,
    RuleLabel,
    RuleLoad,
    RuleStore,
    RuleRead,
    RuleAdd,
    RuleSubtract,
    RuleMultiply,
    RuleDivision,
    RuleExponentiation,
    RuleModule,
    RuleConcatenate,
    RuleDelete,
    RuleExtract,
    RuleAND,
    RuleOR,
    RuleNOT,
    RuleShow,
    RulePrint,
    RuleGo,
    RuleGoIf,
    RuleReturn,
    //Operations
    Add,
    AND,
    Concatenate,
    Delete,
    Division,
    Exponentiation,
    Extract,
    GoIf,
    Go,
    Load,
    Module,
    Multiply,
    NOT,
    OR,
    Print,
    Read,
    Return,
    Show,
    Store,
    Subtract,
  ],
})
export class GeneralModule {}
