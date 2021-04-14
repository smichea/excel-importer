import { LitElement, html, css } from "lit-element";
import "mv-table";
export class MvSpreadsheet extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true },
      spreadsheet: { type: Object, attribute: false, reflect: true }
    };
  }

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
    this.theme = "dark";
  }

  render() {
    const { theme, spreadsheet } = this;
    return html`
        <mv-table .theme="${theme}" .columns="${spreadsheet.columns}" .rows="${spreadsheet.rows}" >
        </mv-table>
    `;
  }

}

customElements.define("mv-spreadsheet", MvSpreadsheet);