import { Injectable } from '@angular/core';

import { ExpandableInputComponent } from './expandable-input.component';

@Injectable({ providedIn: 'root' })
export class InputsManagerService {
  private groups: { [key: string]: ExpandableInputComponent[] } = {};

  registerComponent(cmp: ExpandableInputComponent) {
    if (cmp.group) {
      if (!this.groups[cmp.group]) {
        this.groups[cmp.group] = [];
      }
      this.groups[cmp.group].push(cmp);
    }
  }

  deregisterComponent(cmp: ExpandableInputComponent) {
    if (cmp.group) {
      const ix = this.groups[cmp.group].findIndex((c) => c === cmp);
      if (ix > -1) {
        this.groups[cmp.group].splice(ix, 1);
      }
    }
  }

  onOpen(cmp: ExpandableInputComponent) {
    if (cmp.group) {
      this.groups[cmp.group].forEach((c) => {
        if (c !== cmp && c.isOpen) {
          c.close();
        }
      });
    }
  }
}
