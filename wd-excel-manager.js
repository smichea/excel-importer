import { LitElement, html, css } from "lit-element";
import "mv-container";
import "mv-header";
import "mv-footer";
import "mv-input";
import "./mv-excel-import.js";
import "./mv-spreadsheet.js";
export class WdExcelManager extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true },
      spreadsheet: { type: Object, attribute: false, reflect: true },
      idcolumn : {type: String, attribute: false },
      columnOptions : {type: Array, attribute: false }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
        --mv-header-height: 66px;
        --mv-footer-height: 40px;
        --mv-menu-panel-width: 300px;
        --mv-container-margin: 50px auto 20px auto;
      }
      .container {
        height: 500px;
        width: 960px;
        margin: 0 auto;
        border: 1px solid #dddddd;
      }
      
      legend {
        font-weight: 500;
        color: red;
      }
    `;
  }

  constructor() {
    super();
    this.theme = "dark";
    this.spreadsheet = null;
    this.detailUrl = "https://mysite.com/detail.php?id=\${col1}";
  }

  render() {
    const { theme, spreadsheet } = this;
    return html`
        <mv-header slot="header" .theme="${theme}">
          <mv-header item>Spreadsheet Import</mv-header>
        </mv-header>
        <mv-excel-import .theme="${theme}" @spreadsheet-load="${this.spreadsheetLoad}"></mv-excel-import>
        ${(spreadsheet==null) ? html`` :
          html`
          <form>
           <mv-input  type="text" id="detail-url" name="detail-url" 
            value="${this.detailUrl}"
            @input-change="${this.detailUrlChanged}"></mv-input>
          <mv-spreadsheet .spreadsheet="${spreadsheet}"></mv-spreadsheet>`}
        <mv-footer slot="footer" .theme="${theme}">
          <mv-footer item>Webdrone 2021</mv-footer>
        </mv-footer>
    `;
  }


  connectedCallback() {
    super.connectedCallback()
    console.log("element is ready")
    this.dispatchEvent(new CustomEvent("componentReady",{}));
  }
  
  setTestSuite(testSuite){
    this.detailUrl = testSuite.detailUrl
    this.spreadsheet = testSuite.spreadsheet;
  }

  detailUrlChanged(e){
    this.detailUrl = e.detail.value;
    this.testSuiteUpdated();
  }

  spreadsheetLoad(e){
    if((this.spreadsheet == null) || confirm("Replace existing spreadsheet ?")){
      let headers = e.detail.rows.shift();
      let i=0;
      let columns = headers.map(val => {
        if(val==null){
          return {
            name: "col"+i,
            title: "col"+(i++),
            tooltip: "missing column header",
            type: "TEXT"
          }
        } else {
          return {
            name: "col"+i,
            title: val+"[col"+(i++)+"]",
            tooltip: "",
            type: "TEXT"
          }
        }
      })
      let rows = e.detail.rows.map(val=>{
        let r = {};
        for(i=0;i<val.length;i++){
          r["col"+i]=val[i];
        }
        return r;
      });
      
      this.spreadsheet={columns:columns,rows:rows};
      this.columnOptions=columns.map(col =>{
        return {label:col.title,value:col.name}
      })
      this.testSuiteUpdated();
    };
  }

  testSuiteUpdated(){
    this.dispatchEvent(
      new CustomEvent("testSuiteUpdated", {
        detail:{
          spreadsheet: this.spreadsheet,
          detailUrl: this.detailUrl 
        },
      }));
  }

  changeTheme = originalEvent => {
    const { target: { value } } = originalEvent;
    this.theme = value;
  };

}

customElements.define("wd-excel-manager", WdExcelManager);