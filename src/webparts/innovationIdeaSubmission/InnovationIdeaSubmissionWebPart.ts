import { UrlQueryParameterCollection, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './InnovationIdeaSubmissionWebPart.module.scss';
import * as strings from 'InnovationIdeaSubmissionWebPartStrings';

import * as $ from 'jquery';

import { SPComponentLoader } from '@microsoft/sp-loader';
import pnp, { sp, Item, ItemAddResult, ItemUpdateResult, Web } from 'sp-pnp-js';

//require('bootstrap');
let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
SPComponentLoader.loadCss(cssURL);
SPComponentLoader.loadScript("https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js");

//Main css and script
require("mainJS");
require("../../webparts/css/main.css");

const image_situation: any = require('../../webparts/images/situation.png');

//====SP List Reqs
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface SPList {
  value: SPListItem[];
}

export interface SPListItem {
  Title: string;
  Situation: string;
  Potential_x0020_Outcome: string;
  Users_x0020_Impacted: string;
  Financial_x0020_Potential: boolean;
  Reputational_x0020_Potential: boolean;
  B_x0020_Corp_x0020_Potential: boolean;
  Other_x0020_Potential: boolean;
  Human_x0020_Subjects: boolean;
  Client_x0020_Data: boolean;
  Resources: boolean;
  Non_x002d_labor_x002f_Field_x002: string;
  Non_x002d_labor_x002f_Field_x0020: string;
  Toal_x0020_Cost: number; //change to total on making public
  Weeks_x0020_Needed: number;
}

//==============

export interface IInnovationIdeaSubmissionWebPartProps {
  description: string;
}

export default class InnovationIdeaSubmissionWebPart extends BaseClientSideWebPart<IInnovationIdeaSubmissionWebPartProps> 
{

  private getListData(): Promise<SPList> 
  {
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('InnovativeIdeaSubmissions')/Items",
        SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => 
        {
            return response.json();
        });
  }

  private renderList(): void 
  {
    this.getListData().then((response) => 
    {
      let html: string = '';
      html += '<table border=1 width=100% style="border-collapse: collapse;">';
      html += '<th>Title</th>';
      html += '<th>Weeks Needed</th>';

      response.value.forEach((item: SPListItem) => 
      {
        html += '<tr>';
        html += '<td>${item.Title}</td>';
        html += '<td>${item.Weeks_x0020_Needed}</td>';
        html += '</tr>';
      });

      html += '</table>';

      const listContainer: Element = this.domElement.querySelector('#div_splist');
      listContainer.innerHTML = html;
    });
  }

  public render(): void 
  {
    this.domElement.innerHTML = `<p>This SPFx webpart is using jQuery ${$.fn.jquery}</p>
      
      <div class="${ styles.innovationIdeaSubmission }">
        <div id="div_details">
          <div class="${ styles.container }" style="background-color:transparent;">
            <input type="button" class="button" value="Back" onclick="backToList()"></input>
            <div class="${ styles.row } row_override"  style="padding:0px;">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label style="background-color:orange; width:100%; font-size:large; padding:5px; text-align:center;">
                  IR&D Innovative Submission
                </label>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6" style="padding-right:10px;">
                <label>Project Name</label>
                <input type='textbox' name='input_title' id='input_title' class="form-control" value="" placeholder="" >
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                  <div class="ms-Grid-col ms-sm12 ms-xl4">
                    <img class="img-responsive"src="${image_situation}" alt=""></img>
                  </div>
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <label>Situation</label>
                    <p>What is the situation, context, problem, or impetus for the need for innovation—that made the idea surface in the first place?  
                    </p>
                  </div>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <textarea name='text_situation' id='text_situation' rows=5 class="form-control" value="" placeholder="" ></textarea>
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label>Potential Outcome</label>
                <p>Once in place, what will this innovation enable us to do? In other words, what is the solution it will provide or the opportunity will it help us seize? 
                </p>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <textarea name='text_outcome' id='text_outcome' rows=5 class="form-control" value="" placeholder="" ></textarea>
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label>Users</label>
                <p>Who will be the primary FMG users and/or beneficiaries of this innovation?
                </p>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <textarea name='text_users' id='text_users' rows=5 class="form-control" value="" placeholder="" ></textarea>
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label>Extended Potential</label>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <div class="${ styles.row } row_override">
                  <input type="checkbox" id="check_financialpotential" onclick="showHideTextArea('text_financialpotential')" name="check_financialpotential" value="financial"><span class="span_checkbox">&nbsp;Financial Potential:</span><span>&nbsp;It will generate revenue or reduce costs to FMG. (If checked, briefly describe in what ways and to what degree.)</span>
                  <textarea name='text_financialpotential' id='text_financialpotential' rows=5 class="form-control" value="" placeholder="" style="display: none;" ></textarea>
                </div>
                <div class="${ styles.row } row_override">
                  <input type="checkbox" id="check_reputationpotential" onclick="showHideTextArea('text_reputationpotential')" name="check_reputationpotential" value="reputation"><span class="span_checkbox">&nbsp;Reputational Potential:</span><span>&nbsp;It will enhance FMG’s reputation by its potential to be published, covered by the press, attract new business. or to render a competitive advantage. (If checked, please briefly describe the type of reputational potential.)</span>
                  <textarea name='text_reputationpotential' id='text_reputationpotential' rows=5 class="form-control" value="" placeholder="" style="display: none;"></textarea>
                  </div>
                <div class="${ styles.row } row_override">
                  <input type="checkbox" id="check_bcorppotential" onclick="showHideTextArea('text_bcorppotential')" name="check_bcorppotential"  style="visible: hidden;"value="bcorp"><span class="span_checkbox">&nbsp;B Corp Potential:</span><span>&nbsp;It will support our B Corp affiliation. (If checked, please briefly describe how it might do this.)</span>
                  <textarea name='text_bcorppotential' id='text_bcorppotential' rows=5 class="form-control" value="" placeholder="" style="display: none;"></textarea>
                </div>
                <div class="${ styles.row } row_override">
                  <input type="checkbox" id="check_otherpotential" onclick="showHideTextArea('text_otherpotential')" name="check_otherpotential" value="other"><span class="span_checkbox">&nbsp;Other Potential:</span><span>&nbsp;(If checked, please briefly describe what that potential would be, such as evaluating or developing a method or capability.)</span>
                  <textarea name='text_otherpotential' id='text_otherpotential' rows=5 class="form-control" value="" placeholder="" style="display: none;"></textarea>
                </div>         
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label>Additional Characteristics</label>
                <p>Check “yes” or “no” for each of the descriptions to the right.
                </p>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                  <div class="${ styles.row } row_override"  style="height:10px; max-height:10px;background-color:transparent;">
                    <p>Does your innovation use human subjects? (Check one.)</p>
                    <div class="ms-Grid-col ms-sm12 ms-xl6">
                        <input type="radio" name="group1" id="additional_humansubjects_yes" name="additional_humansubjects_yes" value="yes"> <label for="additional_humansubjects_yes">Yes</label>
                        <input type="radio" name="group1" id="additional_humansubjects_no" name="additional_humansubjects_no value="no"> <label for="additional_humansubjects_no">No</label>
                    </div>
                   </div>
                   <br />
                  <div class="${ styles.row } row_override">
                  <br />  
                  <p>Does your innovation involve collection or use of client data? (Check one.)
                    </p>
                    <div class="ms-Grid-col ms-sm12 ms-xl6">
                        <input type="radio" name="group2" id="additional_clientdata_yes" name="additional_clientdata_yes" value="yes"> <label for="additional_clientdata_yes">Yes</label>
                        <input type="radio" name="group2" id="additional_clientdata_no" name="additional_clientdata_no" value="no"> <label for="additional_clientdata_no">No</label>
                    </div>
                  </div>
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <label>Resources and Timing</label>
                <p>What kind of resources will you need to complete the project? In your response, <u><b>include:</b></u> labor (who will be working, on what tasks, and for how many hours), non-labor costs, and total time needed.
                </p>
              </div>
              <div class="ms-Grid-col ms-sm12 ms-x16">
                <input id="button_addrow" type=button onclick="addRow()" value="Add Row"></input>
                <br />
                <table >
                  <thead>
                    <th><span style="padding-left:5px;">Name</span></th>
                    <th><span style="padding-left:5px;">Task</span></th>
                    <th><span style="padding-left:5px;">Hours</span></th>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type='textbox' class="form-control" size="50" value="" placeholder="" ></td>
                      <td><input type='textbox' class="form-control" size="200" value="" placeholder="" ></td>
                      <td><input type='number' class="form-control col_hours" onchange="calculateTotal()"; size="10" value="" min="0" placeholder="0" ></td>
                    </tr>
                    <tr>
                      <td><input type='textbox' class="form-control"  size="50" value="" placeholder="" ></td>
                      <td><input type='textbox' class="form-control"  size="200" value="" placeholder="" ></td>
                      <td><input type='number' class="form-control col_hours" onchange="calculateTotal()";  size="10" value="" min="0" placeholder="0" ></td>
                    </tr>
                    <tr>
                      <td><input type='textbox' class="form-control"  size="50" value="" placeholder="" ></td>
                      <td><input type='textbox' class="form-control"  size="200" value="" placeholder="" ></td>
                      <td><input type='number' class="form-control col_hours" onchange="calculateTotal()";  size="10" value="" min="0" placeholder="0" ></td>
                    </tr>
                    <tr>
                      <td><input type='textbox' class="form-control"  size="50" value="" placeholder="" ></td>
                      <td><input type='textbox' class="form-control"  size="200" value="" placeholder="" ></td>
                      <td><input type='number' class="form-control col_hours" onchange="calculateTotal()"; size="10" value="" min="0" placeholder="0" ></td>
                    </tr>
                    <tr>
                      <td><input type='textbox' class="form-control"  size="50" value="" placeholder="" ></td>
                      <td><input type='textbox' class="form-control"  size="200" value="" placeholder="" ></td>
                      <td><input type='number' class="form-control col_hours" onchange="calculateTotal()"; value="" min="0" placeholder="0" ></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="2" style="text-align:right;"><label>Total :</label></th>
                        <td style="text-align:center;"><label id="label_totalhours">0</label></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
              </div>  
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                <div class="${ styles.row } row_override">
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <label class="label_smaller">Non-labor/Field costs (describe, if any):</label>
                  </div>
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <input type='textbox' class="form-control" style="text-align:center;" value="" size="10" placeholder="$0.00" >
                  </div> 
                </div>
                <div class="${ styles.row } row_override">
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <label class="label_smaller">Total Costs (non-labor/field + labor)</label>
                  </div>
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <input type='textbox' class="form-control" style="text-align:center;" value="" size="10" placeholder="$0.00" >
                  </div> 
                </div>
                <div class="${ styles.row } row_override">
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <label class="label_smaller">Timing from commencement to completion (in weeks)</label>
                  </div>
                  <div class="ms-Grid-col ms-sm12 ms-xl6">
                    <input type='number' class="form-control" value="" size="10" min="0" placeholder="0" >
                  </div> 
                </div>
              </div>
            </div>
            <div class="${ styles.row } row_override" style="text-align:center;">
              <input id="button_submitform" type="button" class="button" onclick="submitForm()" value="Submit"></input>
              <input type="button" class="button" onclick="backToList()" value="Cancel"></input>
            </div>
          </div>
        </div>
        <br /><br /><br />
        <div id="div_mainlist" class="${ styles.container }">
          <div class="${ styles.container }">
            <div class="${ styles.row } row_override">
              <div class="ms-Grid-col ms-sm12 ms-xl6">
                  <input type="button" value="Open a new request" class="button" onclick="newRequest()"></button>
              </div>
            </div>
          </div>
          <br></br>
          <div id="div_splist">
          </div>
        </div>
      </div>
     `;
     
      document.getElementById('button_submitform').addEventListener('click', () => this.submitForm());
    
      this.renderList();

  } 



    private submitForm()
    {
        var userId = -1;

        pnp.sp.web.lists.getByTitle('InnovativeIdeaSubmissions').items.add(
          {
            Title: "test_from_spfx",
            Situation: "sit",
            Potential_x0020_Outcome: "potout",
            Users_x0020_Impacted: "",
            Financial_x0020_Potential: true,
            Reputational_x0020_Potential: true,
            B_x0020_Corp_x0020_Potential: true,
            Other_x0020_Potential: false,
            Human_x0020_Subjects: false,
            Client_x0020_Data: false,
            Resources: false,
            Non_x002d_labor_x002f_Field_x002: "$30.00",
            Non_x002d_labor_x002f_Field_x0020: "$40.00",
            Toal_x0020_Cost: 20,
            Weeks_x0020_Needed: 5
          }
        );


    }

    
    protected get dataVersion(): Version 
    {
      return Version.parse('1.0');
    }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
