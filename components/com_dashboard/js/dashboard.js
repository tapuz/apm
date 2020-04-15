var urlToGetAllOpenBugs = "https://api.github.com/repos/tapuz/apm/issues?state=open&labels=bug";
var urlToGetAllOpenEnhancements = "https://api.github.com/repos/tapuz/apm/issues?state=open&labels=enhancement";
var urlToGetAllClosedIssues = "https://api.github.com/repos/tapuz/apm/issues?state=closed";
//var urlToGetAllOpenBugs = "https://api.github.com/repos/tapuz/apm/projects";
 
 
// /repos/:owner/:repo/projects

//var urlToGetAllOpenBugs =  'https://api.github.com/tapuz/repos'

//https://github.com/tapuz/apm/issues

$(document).ready(function () {
    $.getJSON(urlToGetAllOpenBugs, function (allIssues) {
        
        $.each(allIssues, function (i, issue) {
         
            
            html = "<tr>";
            html+="<td style='width:5%'><span class='label label-danger' >"+issue.labels[0].name+"</span></td>";
            html+="<td style='width:10%'>"+moment(issue.created_at).format('ll')+"</td>";
            html+="<td style='width:30%'><a target='blank' href='"+issue.html_url+"'>"+issue.title+"</a></td>";
            html+="<td style='width:40%'>"+issue.body+"</td>";
            html+="<td><b>"+issue.number+"</b></td>";
            html+="</tr>";
            
            $("#issues").append(html)
                
                
        });
    });

    $.getJSON(urlToGetAllOpenEnhancements, function (allIssues) {
      
        $.each(allIssues, function (i, issue) {
         
            
            html = "<tr>";
            html+="<td style='width:5%'><span class='label label-primary' >"+issue.labels[0].name+"</span></td>";
            html+="<td style='width:10%'>"+moment(issue.created_at).format('ll')+"</td>";
            html+="<td style='width:30%'><a target='blank' href='"+issue.html_url+"'>"+issue.title+"</a></td>";
            html+="<td style='width:40%'>"+issue.body+"</td>";
            html+="<td><b>"+issue.number+"</b></td>";
            html+="</tr>";
            
            $("#enhancements").append(html)
                
                
        });
    });

    $.getJSON(urlToGetAllClosedIssues, function (allIssues) {
        console.log('here are they!! ' + allIssues);
      
        $.each(allIssues, function (i, issue) {
         
            
            html = "<tr>";
            html+="<td style='width:5%'><span class='label label-primary' >done</span></td>";
            html+="<td style='width:10%'>"+moment(issue.created_at).format('ll')+"</td>";
            html+="<td style='width:30%'><a target='blank' href='"+issue.html_url+"'>"+issue.title+"</a></td>";
            html+="<td style='width:40%'>"+issue.body+"</td>";
            html+="<td><b>"+issue.number+"</b></td>";
            html+="</tr>";
            
            $("#done").append(html)
                
                
        });
    });




});


