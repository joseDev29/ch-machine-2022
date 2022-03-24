import { Pipe, PipeTransform } from '@angular/core'
import { MEMORY_LINE_SEPARATOR } from '../constants/machine.constants'

@Pipe({ name: 'memoryItem' })
export class MemoryItemPipe implements PipeTransform {
  transform(value: string | number): string | number {
    if (typeof value !== 'string' || !value.includes(MEMORY_LINE_SEPARATOR))
      return value

    return value.split(MEMORY_LINE_SEPARATOR)[1]
  }
}
