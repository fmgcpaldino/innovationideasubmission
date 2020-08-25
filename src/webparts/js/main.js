//$(document).ready(function(){
 //   alert('ran');
  //  hookupUI();
//});

//TODO
//====figure out how to do doc .rdy
//====add people picker

//=======Navigation
function backToList()
{
    $('#div_details').fadeOut();
    $('#div_mainlist').fadeIn();
}

function newRequest()
{
    //clear out values
  
    $('#div_mainlist').fadeOut();
    $('#div_details').fadeIn();
}


//=====Form Functions
function submitForm()
{
    //get values

    //ajax to save here


    backToList();
}

//=====UI Functions
function showHideTextArea(textarea)
{
    if($('#'+textarea).is(":visible")){
        $('#'+textarea).fadeOut();
    } else{
        $('#'+textarea).fadeIn();
    }
}


//=====Table Functions

function addRow()
{
    var tr = document.createElement('TR');
    var td_name = document.createElement('TD');
    var td_task = document.createElement('TD');
    var td_hours = document.createElement('TD');
    var input_text_name = document.createElement("input");
    var input_text_task = document.createElement("input");
    var input_text_hours = document.createElement("input");


    td.style.borderStyle = "none";
    
    input_text_name.setAttribute("type","text");
    input_text_task.setAttribute("type","text");
    input_text_hours.setAttribute("type","number");


    input_text_name.setAttribute("size",50);
    input_text_task.setAttribute("size",200);
    input_text_hours.setAttribute("size",10);

    input_text_name.setAttribute('required','required');
    input_text_task.setAttribute('required','required');
    input_text_hours.setAttribute('required','required');

   
    td_name.appendChild(input_text_name);
    td_task.appendChild(input_text_task);
    td_hours.appendChild(input_text_hours);
    tr_data.appendChild(td_name);
    tr_data.appendChild(td_task);
    tr_data.appendChild(td_hours);


}

function calculateTotal()
{
    $("#label_totalhours").text("0");
    var total = 0;
    $(".col_hours").each(function(){
        if($(this).val() != null && $(this).val() > 0)
        {
            total += parseInt($(this).val(),10);
        }
    });

    $("#label_totalhours").text(total);
}