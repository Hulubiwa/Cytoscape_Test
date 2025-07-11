import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

/**
 * @class NodeDialogComponent
 * @description
 *   Dialog component for editing the class name and attributes of a node.
 *   Used by GraphComponent to create or edit nodes in the Cytoscape graph.
 */
@Component({
  selector: 'app-node-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './node-dialog.html'
})
export class NodeDialogComponent {
  /** The class name (node ID) being edited */
  className: string;
  /** The attributes of the node as a key-value map */
  attributes: { [key: string]: string } = {};

  /**
   * @constructor
   * @param data - Injected node data from the parent component
   * @param dialogRef - Reference to the dialog instance
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NodeDialogComponent>
  ) {
    this.className = data.id;
    this.attributes = data.attributes || [];
  }

  /**
   * @method save
   * @description
   *   Saves the node data and closes the dialog.
   *   Called when the user clicks the save button.
   */
  save(): void {
    this.dialogRef.close({
      attributes: this.attributes
    });
  }

  /**
   * @method trackByKey
   * @description
   *   TrackBy function for ngFor to optimize rendering.
   * @param index - Index of the item in the array
   * @param item - The item object with key and value properties
   * @returns The unique key for the item
   */
  trackByKey(index: number, item: { key: string; value: string }): string {
    return item.key;
  }

  /**
   * @method cancel
   * @description
   *   Cancels the dialog without saving changes.
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
