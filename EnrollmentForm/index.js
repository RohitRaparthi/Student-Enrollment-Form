/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var DBName = "SCHOOL_DB";
var RelationName = "STUDENT_TABLE";
var connToken = "90931519|-31949302659200190|90960273";
var isUpdate=false;
$("#rollno").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getRollnoAsJsonObj(){
    var rollno = $('#rollno').val();
    var jsonStr = {
        "Roll_No": rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.Full_Name);
    $("#class").val(record.Class);
    $("#birthdate").val(record.Birth_Date);
    $("#address").val(record.Address);
    $("#enrollmentdate").val(record.Enrollment_Date);
    if(record.Roll_No!==''){
        isUpdate=true;
    }
    else{
        isUpdate=false;
    }
}

function resetForm(){
    $('#rollno').val("");
    $('#fullname').val("");
    $('#class').val("");
    $('#birthdate').val("");
    $('#address').val("");
    $('#enrollmentdate').val("");
    $('#rollno').prop("disabled", false);
    $('#Save').prop("disabled", true);
    $('#Update').prop("disabled", true);
    $('#Reset').prop("disabled", true);
    $('#rollno').focus();
}

function validateData(){
    var rollno, fullname, Class, birthdate, address, enrollmentdate;
    rollno = $('#rollno').val();
    fullname = $('#fullname').val();
    Class = $('#class').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollmentdate = $('#enrollmentdate').val();
    
    if (rollno === ''){
        alert('Roll-No missing');
        $('#rollno').focus();
        return "";
    }
    if (fullname === ''){
        alert('Full-Name missing');
        $('#fullname').focus();
        return "";
    }
    if (Class === ''){
        alert('Class missing');
        $('#class').focus();
        return "";
    }
    if (birthdate === ''){
        alert('Birth-Date missing');
        $('#birthdate').focus();
        return "";
    }
    if (address === ''){
        alert('Address missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentdate === ''){
        alert('Enrollment-Date missing');
        $('#enrollmentdate').focus();
        return "";
    }
    
    var jsonStrObj = {
        Roll_No: rollno,
        Full_Name: fullname,
        Class: Class,
        Birth_Date: birthdate,
        Address: address,
        Enrollment_Date: enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}

function getstudentform(){
    var rollnoJsonObj = getRollnoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBName, RelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: false});
    if (resJsonObj.status === 400) {
        //$("#Save").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#fullname").focus();
        
    }else if (resJsonObj.status === 200) {
        
        $("#Update").prop("disabled", false);
        fillData(resJsonObj);
        
        $("#Update").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#fullname").focus();
    }
}


function isValid(){
    let rollno, fullname, Class, birthdate, address, enrollmentdate;
    rollno = $('#rollno').val();
    fullname = $('#fullname').val();
    Class = $('#class').val();
    birthdate = $('#birthdate').val();
    address = $('#address').val();
    enrollmentdate = $('#enrollmentdate').val();
    
    if (rollno !== '' || fullname !== '' ||
            Class!=='' || birthdate!=='' || 
            address!=='' || enrollmentdate!==''
            ){
        $("#Reset").prop("disabled", false);
        if(isUpdate===false){
            $("#Update").prop("disabled", true);
            $("#Save").prop("disabled", false);
        }
        
    }
    
    
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ''){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, DBName, RelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    alert('Data saved successfully.');
    resetForm();
    $('#rollno').focus();
}

function updateData(){
    $('#Update').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, DBName, RelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    alert('Data updated successfully.');
    resetForm();
    $('#rollno').focus();
}