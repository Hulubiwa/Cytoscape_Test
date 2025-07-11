import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import cytoscape from 'cytoscape';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NodeDialogComponent } from '../node-dialog/node-dialog';
import { FormsModule } from '@angular/forms';

import bilkent from 'cytoscape-cose-bilkent';
import { EdgeDialogComponent } from '../edge-dialog/edge-dialog';
import { NONE_TYPE } from '@angular/compiler';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
cytoscape.use(bilkent);

/**
 * @class GraphComponent
 * @description
 *   Angular component responsible for rendering and managing a Cytoscape graph.
 *   Handles ontology loading, element search, and user interactions.
 */
@Component({
  selector: 'app-graph',
  templateUrl: './graph.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonToggleModule],
  styleUrls: ['./graph.css']
})
export class GraphComponent implements AfterViewInit {

  //////////////////////////////////////////////////////////////////////////////
  // Cytoscape Styles Definitions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @constant nodeStyle
   * @description Style configuration for all nodes in the Cytoscape graph.
   */
  readonly nodeStyle = {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'shape': 'roundrectangle',
      'background-color': '#ffffff',
      'border-color': '#000000',
      'border-width': 1,
      'text-valign': 'center',
      'text-halign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': '150px',
      'padding': '10px',
      'width': 'label',
      'height': 'label',
      'font-family': 'monospace'
    }
  } as const;

  /**
   * @constant edgeStyleEquivalence
   * @description Style for equivalence edges (≡).
   */
  readonly edgeStyleEquivalence = {
    selector: 'edge[label="≡"]',
    style: {
      'label': 'data(label)',
      'text-background-opacity': 1,
      'text-background-color': '#ffffff',
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2px',
      'line-style': 'solid',
      'curve-style': 'bezier',
      'source-arrow-shape': 'triangle',
      'source-arrow-fill': 'filled',
      'source-arrow-color': 'black',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'target-arrow-color': 'black',
      'line-color': 'black',
      'width': 2
    }
  } as const;

  /**
   * @constant edgeStyleDisjoint
   * @description Style for disjoint edges.
   */
  readonly edgeStyleDisjoint = {
    selector: 'edge[label="disjoint"]',
    style: {
      'label': 'data(label)',
      'line-style': 'dashed',
      'text-background-opacity': 1,
      'text-background-color': '#ffffff',
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2px',
      'target-arrow-shape': 'none',
      'line-color': 'black',
    }
  } as const;

  /**
   * @constant edgeStyleInheritance
   * @description Style for inheritance edges.
   */
  readonly edgeStyleInheritance = {
    selector: 'edge[label="inherits"]',
    style: {
      'label': 'data(label)',
      'text-background-opacity': 1,
      'text-background-color': '#ffffff',
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2px',
      'line-style': 'solid',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'target-arrow-color': '#000000',
      'line-color': '#000000',
      'width': 2
    }
  } as const;

  /**
   * @constant cyBlinkerStyle
   * @description Style for blinking effect on nodes.
   */
  readonly cyBlinkerStyle = {
    selector: '.cy-blinker',
    style: {
      'background-color': 'yellow',
      'border-color': 'red',
      'border-width': 4
    }
  } as const;

  //////////////////////////////////////////////////////////////////////////////
  // Component State
  //////////////////////////////////////////////////////////////////////////////

  // Search query for node ID
  searchQueryID = '';
  // Search query for node name
  searchQueryName = '';
  // Interval ID for blinking effect
  intervalId: number | null = null;
  // Cytoscape instance
  private cyInstance!: cytoscape.Core;

  /**
   * @constructor
   * @param http Angular HttpClient for loading ontology data.
   * @param dialog Angular Material Dialog service for node dialogs.
   */
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  /**
   * @lifecycle AfterViewInit
   * @description Loads ontology and initializes Cytoscape after view is initialized.
   */
  ngAfterViewInit(): void {
    this.loadOntology();
  }

  /**
   * @method loadOntology
   * @description Loads ontology data from JSON and initializes Cytoscape elements.
   */
  loadOntology(): void {
    this.http.get<any>('/assets/ontology.json').subscribe(ontology => {
      const elements = this.transformOntologyToElements(ontology);
      this.initCytoscape(elements);
    });
  }

  /**
   * @method transformOntologyToElements
   * @description Transforms ontology JSON into Cytoscape elements.
   * @param ontology Ontology data object.
   * @returns Array of Cytoscape elements.
   */
  transformOntologyToElements(ontology: any): any[] {
    const elements: any[] = [];

    // Add nodes (classes)
    ontology.classes.forEach((cls: any) => {
      elements.push({
        data: {
          id: cls.id,
          label: cls.label,
          attributes: cls.attributes
        }
      });
    });

    // Add edges (relations)
    ontology.relations.forEach((rel: any, index: number) => {
      let edge: any = {
        data: {
          id: `${rel.source}_${rel.type}_${rel.target}_${index}`,
          type: rel.type,
          source: rel.source,
          target: rel.target,
          label: ''
        }
      };

      if (rel.type === 'inheritance') {
        edge.data.label = 'inherits';
      } else if (rel.type === 'equivalence') {
        edge.data.label = '≡';
      } else if (rel.type === 'disjoint') {
        edge.data.label = 'disjoint';
      }

      if (!edge.data.label) {
        edge.data.label = edge.data.type;
      }

      elements.push(edge);
    });

    return elements;
  }

  /**
   * @method startBlinking
   * @description Starts blinking effect on specified Cytoscape elements.
   * @param elements Cytoscape collection to blink.
   */
  startBlinking(elements: cytoscape.Collection) {
    let isActive = false;

    this.intervalId = setInterval(() => {
      this.cyInstance.batch(() => {
        if (isActive) {
          elements.removeClass('cy-blinker');
        } else {
          elements.addClass('cy-blinker');
        }
      });

      // Force a full style re-render
      this.cyInstance.style().update();

      isActive = !isActive;
    }, 1000);
  }

  /**
   * @method stopBlinking
   * @description Stops blinking effect on all Cytoscape elements.
   */
  stopBlinking(): void {
    clearInterval(this.intervalId!);
    if (this.cyInstance) {
      this.cyInstance.elements().removeClass('cy-blinker');
    }
  }

  /**
   * @method searchElements
   * @description Searches for elements in the Cytoscape graph by name or ID.
   * @param type Search type: 'name' or 'id'.
   */
  searchElements(type: string): void {
    // Stop any ongoing blinking effect
    this.stopBlinking();

    if (type === 'name') {
      if (!this.cyInstance) return;

      const query = this.searchQueryName.trim();
      if (!query) return;

      // Find nodes by their type (case-insensitive)
      const queryLower = query.toLowerCase();
      const elements = this.cyInstance.nodes().filter(node =>
        (node.data('label') || '').toLowerCase() === queryLower
      );

      if (elements.length > 0) {
        console.log('Element found:', elements);
        this.startBlinking(elements); // Start blinking effect
      } else {
        console.log('No element found with this name.');
      }

      // Center and fit the graph to the found elements
      this.cyInstance.center(elements);
      this.cyInstance.fit(elements, 200);

    } else if (type === 'id') {
      if (!this.cyInstance) return;

      const query = this.searchQueryID.trim();
      if (!query) return;

      // Retrieve element by its ID
      const element = this.cyInstance.getElementById(query);

      if (element && element.nonempty()) {
        console.log('Element found:', element);

        this.cyInstance.center(element);  // Center on the element
        this.cyInstance.fit(element, 200); // Adjust zoom for visibility
        this.startBlinking(element); // Start blinking effect
      } else {
        console.log('No element found with this ID.');
      }
    }
  }

  /**
   * @method initCytoscape
   * @description Initializes Cytoscape instance with provided elements and styles.
   * @param elements Array of Cytoscape elements.
   */
  initCytoscape(elements: any[]): void {
    this.cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
      style: [
        this.nodeStyle,
        this.edgeStyleEquivalence,
        this.edgeStyleDisjoint,
        this.edgeStyleInheritance,
        this.cyBlinkerStyle
      ],
      layout: {
        name: 'cose-bilkent',
        animate: 'end',
        nodeRepulsion: 10000,
        idealEdgeLength: 200,
        gravity: 0.25,
        tile: true,
        fit: true,
        componentSpacing: 100,
      } as any
    });

    // Register node double-click event to open dialog
    this.cyInstance.on('dblclick', 'node', (event) => {
      const node = event.target;
      const data = node.data();

      this.dialog.open(NodeDialogComponent, {
        data: data,
        panelClass: 'my-dialog-panel'
      });
    });

    // Register edge double-click event to open dialog
    this.cyInstance.on('dblclick', 'edge', (event) => {
      const edge = event.target;
      const data = edge.data();
      const relationsTypes = Array.from(new Set(
        elements
          .filter(el => !!el.data.type)
          .map(el => el.data.type)
      ));

      const dialogRef = this.dialog.open(EdgeDialogComponent, {

        data: {
          id: data.id,
          type: 'Edge',
          relations: relationsTypes,
          relation: data.type || ''
        },
        panelClass: 'my-dialog-panel'
      });

      // Handle dialog close event
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          // If the relation is NONE_TYPE, delete the edge
          if (result.relation === NONE_TYPE) {
            this.cyInstance.remove(edge);
          } else {

            // Update edge data with new relation
            edge.data({
              type: result.relation,
              label: result.relation === 'equivalence' ? '≡' : result.relation
            });
          } 
        }
      });
    });

    // Removed edgehandles and all edge-adding logic

  }
}
