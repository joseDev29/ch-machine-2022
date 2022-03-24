import { Pipe, PipeTransform } from '@angular/core'

import { Program } from '../interfaces/program.interfaces'

@Pipe({ name: 'parseProgramMap' })
export class ParseProgramMap implements PipeTransform {
  transform(value: Map<string, Program>): any[] {
    return Array.from(value.values())
  }
}
