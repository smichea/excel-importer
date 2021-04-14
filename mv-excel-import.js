import { LitElement, html, css } from "lit-element";
import "mv-container";
export class MvExcelImport extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
      fieldset > label, label > input {
        cursor: pointer;
      }
      
      fieldset {
        width: 120px;
        margin-left: 10px;
        border:2px solid red;
        -moz-border-radius:8px;
        -webkit-border-radius:8px;	
        border-radius:8px;
        color: #818181;
      }
    `;
  }

  constructor() {
    super();
    this.theme = "dark";
  }

  importFile(e){
    readXlsxFile(e.srcElement.files[0]).then(function(rows) {
        this.dispatchEvent(
          new CustomEvent("spreadsheet-load", {
            detail:{rows: rows},
          })
    );
      }.bind(this))
  }

  render() {
    const { theme } = this;
    return html`
        <mv-container .theme="${theme}">
            <input type="file" id="excel_import" @change="${this.importFile}">
        </mv-container>
    `;
  }

}

customElements.define("mv-excel-import", MvExcelImport);