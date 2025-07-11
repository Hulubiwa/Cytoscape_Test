import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NONE_TYPE } from '@angular/compiler';

/**
 * @class EdgeDialogComponent
 * @description
 *   Dialog component for editing the relation type of an edge.
 *   Used by GraphComponent to create or edit edges in the Cytoscape graph.
 */
@Component({
  selector: 'app-edge-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelect
  ],
  templateUrl: './edge-dialog.html',
  styleUrls: ['./edge-dialog.css']
})
export class EdgeDialogComponent {
  /** The edge identifier being edited */
  className: string;
  /** List of possible relation types for the edge */
  relations: string[] = [];
  /** The currently selected relation type */
  relation: string;

  /**
   * @constructor
   * @param data - Injected edge data from the parent component
   * @param dialogRef - Reference to the dialog instance
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EdgeDialogComponent>
  ) {
    this.className = data.id;
    this.relations = data.relations || [];
    this.relation = data.relation || '';
  }

  /**
   * @method save
   * @description
   *   Saves the edge data and closes the dialog.
   *   Called when the user clicks the save button.
   */
  save(): void {
    this.dialogRef.close({
      relation : this.relation,
      relations: this.relations
    });
  }

  /**
   * @method delete
   * @description
   *   Deletes the edge and closes the dialog.
   *   Called when the user clicks the delete button.
   */
  delete(): void {
    this.dialogRef.close({
      relation: NONE_TYPE,
      relations: this.relations
    });
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
