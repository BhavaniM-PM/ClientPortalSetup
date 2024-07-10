/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * 
 *
 * Author               : Utsav Singh
 * Start Date           : 16 March 2023
 * Last Modified Date   : 
 * 
 * Description          : Suitelet shows Client Portal login page
 * 			
 * 
 **/

define(['N/https', 'N/record', 'N/search', 'N/file', 'N/url', 'N/config', 'N/format', 'N/redirect', 'N/cache', 'N/render', 'N/runtime', 'N/email', 'N/util', 'N/encode', '/SuiteScripts/oauth_new1', '/SuiteScripts/secret_new1', '/SuiteScripts/cryptojs_new1'],

	function (https, record, search, file, url, config, format, redirect, cache, render, runtime, email, util, encode, oauth_new1, secret_new1, cryptojs_new1) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */
		var selfSuiteLetScript = ['customscript_tss_sl_client_portal_landin', 'customdeploy_tss_sl_client_portal_landin'];
		var closeProjectEmailTemplateId = 280;
		var deleteProjectEmailTemplateId = 281;
		var createTaskEmailTemplateId = 282;
		var PortalSupportEmployeeId = 118002;
		var landingPageStyleFile = 'Employee_Portal_CSS_File.css';
		var landingPageScriptFile = 'Employee_Portal_JS_File.js';
		var pageLoaderGif = 'Portal pre-loader.gif';
		var emp_Portal_SkyDoc = 'emp_portal_skydoc_logo.png';
		var emp_Portal_SkyDoc = 'emp_portal_skydoc_logo.png';
		var emp_Portal_SkyDoc = 'emp_portal_skydoc_logo.png';
		var tvaranaBanner = 'Tvarana Banner.png';
		var clientFolderName = 'Client Portal Scripts';
		var empFolderName = 'Employee Portal Folder - Do not Manipulate'
		var dashboardHtmlfile = 'Dashboard HTML.txt';
		var projectHtmlfile = 'TicketList_HTML.txt';
		var taskHtmlfile = 'client task page html file.txt';
		var reportHtmlfile = 'Client Report Html File.txt';
		var createtaskHtmlFile = 'client Create task page HTml file.txt';
		var projectviewHtmlfile = 'projectPage_HTML.txt.js';
		var viewprojecttaskHtmlfile = 'Project view Task Details Page Html File.txt';
		var editprojecttaskHtmlfile = 'Project edit  task details Html file.txt';
		var viewtaskthmlfile = 'View task page html file.txt';
		var edittaskHtmlfile = 'Edit of update task page html file.txt'


		function onRequest(context) {
			try {
				var loogedInCustomer = "";
				var encryptedText = context.request.parameters.e;
				log.debug("encryptedText", encryptedText)

				if (encryptedText != null && encryptedText != '') {
					/*var myCache = cache.getCache({
						name: encryptedText,
						scope: cache.Scope.PUBLIC
					});
					log.debug("myCache",myCache)*/

					var myCache = cache.getCache({
						name: encryptedText,
						scope: cache.Scope.PROTECTED
					});
					log.debug("myCache1", myCache)

					var loggedInClientId = myCache.get({ key: 'clientId' });

					if (loggedInClientId != '' && loggedInClientId != null) {
						myCache.put({ key: 'clientId', value: loggedInClientId, ttl: 1800 });


						var loggedinclient = 1;
						var selfSuiteLetUrl = url.resolveScript({
							scriptId: selfSuiteLetScript[0], deploymentId: selfSuiteLetScript[1], returnExternalUrl: true
						});

						log.debug("context.request.parameter", context.request.parameters)
						log.debug("context.request", context.request)

						var selectedAction = context.request.parameters.action;
						var filtersData = context.request.parameters.filtersData;

						log.debug("loggedInClientId", loggedInClientId)
						log.debug("selectedAction", selectedAction)
						log.debug("filtersData", filtersData)

						var customrecord_client_accessSearchObj = search.create({
							type: "customrecord_client_access",
							filters:
								[
									["internalid", "anyof", loggedInClientId]

								],
							columns:
								[
									search.createColumn({
										name: "name",
										sort: search.Sort.ASC,
										label: "Name"
									}),
									search.createColumn({ name: "scriptid", label: "Script ID" }),
									search.createColumn({ name: "custrecord_tss_email", label: "Email" }),
									search.createColumn({ name: "custrecord_tss_customer_name", label: "Customer" }),
									search.createColumn({ name: "internalid", label: "Internal ID" }),
									search.createColumn({ name: "internalid", join: "CUSTENTITY_TSS_CLIENT_ACCESS", label: "Internal ID" }),
									search.createColumn({ name: "custentity_selecting_contact", join: "CUSTENTITY_TSS_CLIENT_ACCESS", label: "Selecting Contact" })

								]
						});
						var customerdetails;
						var loggedinclientname;
						var projectInternalIDArr = [];
						var imgcontents = '';
						var customRecordDetails = customrecord_client_accessSearchObj.run().getRange({ start: 0, end: 1000 });
						if (customRecordDetails.length > 0) {
							for (var i = 0; i < customRecordDetails.length; i++) {
								loggedinclientname = customRecordDetails[i].getValue({ name: 'name', label: 'name' })
								var clientEmail = customRecordDetails[i].getValue({ name: "custrecord_tss_email", label: "Email" })
								customerdetails = customRecordDetails[i].getValue({ name: 'custrecord_tss_customer_name' });
								var searchlookup = search.lookupFields({
									type: search.Type.CUSTOMER,
									id: customerdetails,
									columns: ['custentity_company_logo']
								});
								var imgval = searchlookup.custentity_company_logo;
								if (imgval.length > 0) {
									var imgid = imgval[0].text;
									imgcontents = "https://6647300.app.netsuite.com/" + imgid
									log.debug("imgcontents", imgcontents);
								}

								loogedInCustomer = customRecordDetails[i].getText({ name: 'custrecord_tss_customer_name' });
								log.debug("customerdetails", loggedinclientname)
								var clientIdValue = customRecordDetails[i].getValue({ name: 'internalid' })
								var ContactName = customRecordDetails[i].getValue({ name: "custentity_selecting_contact", join: "CUSTENTITY_TSS_CLIENT_ACCESS" })

								var contactIdArr = ContactName.split(',')
								log.debug("contactIdArr", contactIdArr)

								for (var j = 0; j < contactIdArr.length; j++) {
									if (contactIdArr[j]) {
										if (contactIdArr[j] == loggedInClientId) {

											var projectInternalID = customRecordDetails[i].getValue({ name: "internalid", join: "CUSTENTITY_TSS_CLIENT_ACCESS" })
											log.debug("projectInternalID",projectInternalID);
											projectInternalIDArr.push(projectInternalID)
										}
										else {
											log.debug("The Task is not present in the logged in client")
										}
										log.debug("projectInternalIDArr",projectInternalIDArr);
									}
									// else{
									// 	var projectInternalID = customRecordDetails[i].getValue({name: "internalid", join: "CUSTENTITY_TSS_CLIENT_ACCESS"})
									// projectInternalIDArr.push(projectInternalID)
									// }
								}
							}
						}


						var fileSearch = search.create({
							type: search.Type.FOLDER,
							filters: [[['file.name', 'is', 'Client Portal Login HTML.txt'], 'OR', ['file.name', 'is', dashboardHtmlfile], 'OR', ['file.name', 'is', projectHtmlfile], 'OR', ['file.name', 'is', taskHtmlfile], 'OR', ['file.name', 'is', reportHtmlfile], 'OR', ['file.name', 'is', createtaskHtmlFile], 'OR', ['file.name', 'is', projectviewHtmlfile], 'OR', ['file.name', 'is', viewprojecttaskHtmlfile], 'OR', ['file.name', 'is', editprojecttaskHtmlfile], 'OR', ['file.name', 'is', viewtaskthmlfile], 'OR', ['file.name', 'is', edittaskHtmlfile], 'OR', ['file.name', 'is', landingPageStyleFile], 'OR', ['file.name', 'is', landingPageScriptFile], 'OR', ['file.name', 'is', pageLoaderGif], 'OR', ['file.name', 'is', emp_Portal_SkyDoc], 'OR', ['file.name', 'is', tvaranaBanner]], 'AND', [['name', 'is', empFolderName], 'OR', ['name', 'is', clientFolderName]]],
							columns: [{ name: 'internalid', join: 'file' }, { name: 'name', join: 'file' }, { name: 'url', join: 'file' }]
						});
						fileSearch = fileSearch.run().getRange({ start: 0, end: 1000 });
						if (fileSearch.length == 16) {
							var fileNameArray = new Array();
							var fileIdIdArray = new Array();
							var fileUrlArray = new Array();
							for (var count = 0; count < fileSearch.length; count++) {
								fileNameArray.push(fileSearch[count].getValue({ name: 'name', join: 'file' }));
								fileIdIdArray.push(fileSearch[count].getValue({ name: 'internalid', join: 'file' }));
								fileUrlArray.push(fileSearch[count].getValue({ name: 'url', join: 'file' }))
							}
						}


						var landingPageStyle = fileUrlArray[fileNameArray.indexOf(landingPageStyleFile)];
						var landingPageScript = fileUrlArray[fileNameArray.indexOf(landingPageScriptFile)];
						var pageLoaderUrl = fileUrlArray[fileNameArray.indexOf(pageLoaderGif)];
						var skyDocLogoUrl = fileUrlArray[fileNameArray.indexOf(emp_Portal_SkyDoc)];
						var companyBannerUrl = fileUrlArray[fileNameArray.indexOf(tvaranaBanner)];


						if (selectedAction == 'dashboard') {
							/*var landingPageContent = file.load({
								  id: 59230
							  }).getContents().toString();*/

							var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(dashboardHtmlfile)] }).getContents().toString();
							if (projectInternalIDArr.length > 0) {
								var projectStatusData = getProjectStatusData(projectInternalIDArr);
								landingPageContent = landingPageContent.replace('##PROJECT_STATUS_DATA##', projectStatusData);
								landingPageContent = landingPageContent.replace('imagedata', imgcontents);
							}
							else {
								landingPageContent = landingPageContent.replace('##PROJECT_STATUS_DATA##', '');
								landingPageContent = landingPageContent.replace('imagedata', '');

							}
							var updateclientDirectoryDetails = returnProjectListHTML(selfSuiteLetUrl, loggedInClientId, encryptedText);
							landingPageContent = landingPageContent.replace('tableData', updateclientDirectoryDetails);
						}
						if (selectedAction == 'projectpage')  {
							var projectinternalid = context.request.parameters.projectid;
							log.debug("projectinternalid", projectinternalid)
							/* var landingPageContent = file.load({
								  id: 59074
							  }).getContents().toString();*/
							var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(projectviewHtmlfile)] }).getContents().toString();
							landingPageContent = landingPageContent.replace('clientid', loggedInClientId);
							var clientname; var managername; var descriptionname; var statusname; var projectnameintask; var plannedwork; var actualtime; var startdate; var enddate;
							var jobSearchObj = search.create({
								type: "job", filters: [["internalid", "anyof", projectinternalid],"AND",["isinactive","is","F"]],
								columns: [
									search.createColumn({ name: "entitystatus", label: "Status" }),
									search.createColumn({ name: "comments", label: "Comments" }),
									search.createColumn({ name: "entityid", join: "customer", label: "Name" }),
									search.createColumn({ name: "entityid", join: "projectManager", label: "Name" }),
									search.createColumn({ name: "companyname", label: "Project Name" }),
									search.createColumn({ name: "plannedwork", label: "Planned Work" }),
									search.createColumn({ name: "startdate", label: "Start Date" }),
									search.createColumn({ name: "enddate", label: "Actual End Date" }),
									search.createColumn({ name: "actualtime", label: "Actual Work" })]

							});
							var jobSearchObjAllDetails = jobSearchObj.run().getRange({ start: 0, end: 1000 });
							if (jobSearchObjAllDetails.length > 0) {
								for (var i = 0; i < jobSearchObjAllDetails.length; i++) {
									clientname = jobSearchObjAllDetails[i].getValue({ name: 'entityid', join: 'customer' })
									managername = jobSearchObjAllDetails[i].getValue({ name: 'entityid', join: 'projectManager' })
									statusname = jobSearchObjAllDetails[i].getText({ name: 'entitystatus' })
									descriptionname = jobSearchObjAllDetails[i].getValue({ name: 'comments' })
									projectnameintask = jobSearchObjAllDetails[i].getValue({ name: 'companyname' })
									plannedwork = jobSearchObjAllDetails[i].getValue({ name: 'plannedwork' })
									startdate = jobSearchObjAllDetails[i].getValue({ name: 'startdate' })
									enddate = jobSearchObjAllDetails[i].getValue({ name: 'enddate' })
									actualtime = jobSearchObjAllDetails[i].getValue({ name: 'actualtime' })
								}
							}
							if (landingPageContent.indexOf('tableData') != -1) {
								var taskdata = fetchtaskpageDirectory(selfSuiteLetUrl, projectinternalid, loggedInClientId, encryptedText);
								landingPageContent = landingPageContent.replace('tableData', taskdata);
								//							landingPageContent = landingPageContent.replace('tplloggeduserrole',loggedRole);
								landingPageContent = landingPageContent.replace('My Tasks', projectnameintask);
								landingPageContent = landingPageContent.replace('projectnameid', projectinternalid);
								landingPageContent = landingPageContent.replace('projectnametask', JSON.stringify(projectnameintask));
								landingPageContent = landingPageContent.replace('clientprojectdata', JSON.stringify(clientname));
								landingPageContent = landingPageContent.replace('managerproject', JSON.stringify(managername));
								landingPageContent = landingPageContent.replace('statusproject', JSON.stringify(statusname));
								landingPageContent = landingPageContent.replace('startvalue', startdate);
								if ((descriptionname != null) || (descriptionname != undefined) || (descriptionname != '')) {
									landingPageContent = landingPageContent.replace('descriptionproject', descriptionname);
								} else {
									landingPageContent = landingPageContent.replace('descriptionproject', '');
								}
								if ((plannedwork != null) || (plannedwork != undefined) || (plannedwork != '')) {
									landingPageContent = landingPageContent.replace('plannedworkproject', Math.round(plannedwork));
								} else {
									landingPageContent = landingPageContent.replace('plannedworkproject', '');
								}

								if ((actualtime != null) || (actualtime != undefined) || (actualtime != '')) {
									landingPageContent = landingPageContent.replace('actualeffortvalue', actualtime);
								} else {
									landingPageContent = landingPageContent.replace('actualeffortvalue', '');
								}
								if ((enddate != null) || (enddate != undefined) || (enddate != '')) {
									landingPageContent = landingPageContent.replace('endvalue', enddate);


								} else {
									landingPageContent = landingPageContent.replace('endvalue', '');
								}
							}

							landingPageContent = landingPageContent.replace('actionUrl', selfSuiteLetUrl + '&action=projectpage');
							log.debug("actionUrl", selfSuiteLetUrl + '&action=projectpage')

						}
						if (selectedAction == 'projectList') {
							/*var landingPageContent = file.load({
								  id: 59053
							  }).getContents().toString();*/

							var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(projectHtmlfile)] }).getContents().toString();

							var updateclientDirectoryDetails = returnProjectListHTML(selfSuiteLetUrl, loggedInClientId, encryptedText);
							log.debug('updateclientDirectoryDetails',updateclientDirectoryDetails)
							landingPageContent = landingPageContent.replace('tableData', updateclientDirectoryDetails);
							landingPageContent = landingPageContent.replace('actionUrl', selfSuiteLetUrl + '&action=projectList');

						}
						if (selectedAction == 'taskdetailspage') {
							try {
								/*var landingPageContent = file.load({
									  id: 59082
								  }).getContents().toString();*/
								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(viewprojecttaskHtmlfile)] }).getContents().toString();

								var taskiddetails;
								log.debug("context.request.paramters", context.request.parameters)
								taskiddetails = context.request.parameters.taskid
								var sourcetaskname = search.lookupFields({ type: search.Type.PROJECT_TASK, id: taskiddetails, columns: ['title'] });
								var tasknameintask = sourcetaskname.title;
								landingPageContent = landingPageContent.replace('TaskDetails', tasknameintask);
								var sourcetaskname = search.lookupFields({ type: search.Type.PROJECT_TASK, id: taskiddetails, columns: ['title'] });
								var tasknamedetails = sourcetaskname.title;
								landingPageContent = landingPageContent.replace('tasknamevalue', JSON.stringify(tasknamedetails));
								if ((taskiddetails == '') || (taskiddetails == null) || (taskiddetails == undefined)) {
									taskiddetails = context.request.parameters.taskdataid;
								}
								var resourcetaskArr = [];
								var calculatedworkArr = [];
								var unitcostArr = [];
								var statusoption = '';
								var taskobjRecord = record.load({ type: record.Type.PROJECT_TASK, id: taskiddetails, isDynamic: true, });
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var tasknamedata = JSON.stringify(taskname)
								var projectid = taskobjRecord.getValue({ fieldId: 'company' });
								var managersearchobj = search.create({
									type: "job",
									filters: [["internalid", "anyof", projectid],"AND",["isinactive","is","F"]],
									columns: [search.createColumn({ name: "entityid", join: "projectManager", label: "Name" }),]
								});
								var managersearch = managersearchobj.run().getRange({ start: 0, end: 100 });
								var managervalue;
								for (var m = 0; m < managersearch.length; m++) {
									managervalue = managersearch[m].getValue({ name: "entityid", join: "projectManager" })
								}
								/*var projectname = taskobjRecord.getText({fieldId: 'company'});
									 var splitprojectname=projectname.split(":")
									 var splitdata=splitprojectname[1];*/
								var projectsplitData = '';
								var projectname = taskobjRecord.getText({ fieldId: 'company' })
								log.debug("projectname", projectname)
								if (projectname.indexOf(":") > 0) {
									var splitprojectname = projectname.split(":")
									projectsplitData = splitprojectname[1]

								}
								else {
									projectsplitData = projectname
								}
								var projectnamedata = JSON.stringify(projectsplitData)
								var statusvalue = taskobjRecord.getText({ fieldId: 'custevent_task_status' });
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var descriptionvalue = taskobjRecord.getValue({ fieldId: 'message' });
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var taskcommentText = taskobjRecord.getValue({ fieldId: 'custevent_update_comment' });
								var parenttask = taskobjRecord.getText({ fieldId: 'custevent_tss_parent_task' })
								log.debug("taskcommentText", taskcommentText)
								var actualvalue = taskobjRecord.getValue({ fieldId: 'actualwork' });
								var createdbytext = taskobjRecord.getValue({ fieldId: 'custevent_created_by' });

								var TicketVal = taskobjRecord.getValue({ fieldId: 'custevent_ticket_no' });


								var numLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });
								log.debug("numLines", numLines)

								var tasktabledata = ''; var samplearr = [];
								var resourcesublistFieldValue; var resourceFieldValue
								landingPageContent = landingPageContent.replace('managernamevalue', JSON.stringify(managervalue));
								landingPageContent = landingPageContent.replace('projectnamevalue', projectnamedata);
								landingPageContent = landingPageContent.replace('statusdata', JSON.stringify(statusvalue));
								landingPageContent = landingPageContent.replace('descriptiondata', descriptionvalue);
								landingPageContent = landingPageContent.replace('effortvalue', Math.round(plannedworkvalue));
								landingPageContent = landingPageContent.replace('parenttaskvalue', JSON.stringify(parenttask));
								landingPageContent = landingPageContent.replace('loggedeffortvalue', JSON.stringify(actualvalue));
								landingPageContent = landingPageContent.replace('createdbydata', JSON.stringify(createdbytext));
								landingPageContent = landingPageContent.replace('ticketdata', TicketVal);

								for (var i = 0; i < numLines; i++) {
									resourceFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									log.debug("resourceFieldValue", resourceFieldValue);
									samplearr.push(resourceFieldValue);

									log.debug("samplearr", samplearr);
									resourcesublistFieldValue = taskobjRecord.getSublistText({ sublistId: 'assignee', fieldId: 'resource', line: i });
									var s = resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1);
									log.debug("s", s);
									resourcetaskArr.push(resourcesublistFieldValue);
									var calculatedworksublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'calculatedwork', line: i });
									var calculatedworkfixed = calculatedworksublistFieldValue.toFixed(2);
									calculatedworkArr.push(calculatedworkfixed);
									var unitcostsublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									unitcostArr.push(unitcostsublistFieldValue);
								}
								var projecttaskSearchObj = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "T"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});
								var resultIndex = 0;
								var resultSet = '';
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									log.debug("resultSet", resultSet.length);
									var actualworkvalue; var actualArr = []
									var actualJson = {}; var empvalue;
									for (var i = 0; i < resultSet.length; i++) {

										actualworkvalue = resultSet[i].getValue({ name: "durationdecimal", summary: "SUM" })
										empvalue = resultSet[i].getValue({ name: "employee", summary: "GROUP" })
										log.debug("empvalue", empvalue)

										if ((actualworkvalue == "") || (actualworkvalue == undefined) || (actualworkvalue == null)) {
											actualworkvalue = "0"
										}
										actualJson[empvalue] = actualworkvalue
										actualArr.push(actualworkvalue);

									}

									log.debug("resultSet", resultSet)
									resultIndex += 1000;
								} while (resultSet.length >= 1000);





								var Nonbillablesearch = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "F"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});
								var resultIndex1 = 0;
								var resultSet1 = '';
								do {
									resultSet1 = Nonbillablesearch.run().getRange({
										start: resultIndex1,
										end: resultIndex1 + 1000
									});
									log.debug("resultSet", resultSet1.length);
									var actualnonbillworkvalue; var actualnonbillArr = []
									var actualnonbillJson = {}; var empnamevalue;
									for (var m = 0; m < resultSet1.length; m++) {
										actualnonbillworkvalue = resultSet1[m].getValue({ name: "durationdecimal", summary: "SUM" })
										empnamevalue = resultSet1[m].getValue({ name: "employee", summary: "GROUP" })

										if ((actualnonbillworkvalue == "") || (actualnonbillworkvalue == undefined) || (actualnonbillworkvalue == null)) {
											actualnonbillworkvalue = "0"
										}
										actualnonbillJson[empnamevalue] = actualnonbillworkvalue
										actualnonbillArr.push(actualnonbillworkvalue);

									}

									log.debug("resultSet", resultSet1)
									resultIndex1 += 1000;
								} while (resultSet1.length >= 1000);






								//resourcesublistFieldValue = taskobjRecord.getSublistText({sublistId: 'assignee',fieldId: 'resource',line: i});
								//	resourcesublistFieldValue.substring(0, resourcesublistFieldValue.indexOf(' ')); 
								//	var s=resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1); 
								//	log.debug("s",s)
								//resourcetaskArr.push(s);



								if (numLines == 0) {
									log.debug("entered");

									landingPageContent = landingPageContent.replace('tableData', '');
								}


								var arrayOfFilters = [];


								var projecttaskSearchObj = search.create({
									type: "projecttask",
									filters:
										[
										 ["job.internalid","anyof",projectid],"AND",["job.isinactive","is","F"],"AND",
										 ["internalid","anyof",taskiddetails],
										 "AND", 
										 ["custrecord_comments_task.custrecord_comments_html_details","isnotempty",""]											      
										 ],
										 columns:
											 [
											  search.createColumn({ name: "custrecord_comments_date", join: "CUSTRECORD_COMMENTS_TASK", label: "Date" }),
											  search.createColumn({ name: "custrecord_comments_user", join: "CUSTRECORD_COMMENTS_TASK", label: "Commented By" }),
											  search.createColumn({ name: "custrecord_comments_html_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details " }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "internalid", join: "CUSTRECORD_COMMENTS_TASK", label: "Internal ID" }),
											  search.createColumn({ name: "custrecord_comments_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details" })




											  ]
								});
								var CommentArr=[];
								var resultIndex = 0;
								var resultSet='';
								var CommentDate;
								var CommentDetails;
								var CommentName;
								var CommentSkyDocResponse;
								var Commentdetails;
								var MapRecordId;
								var skydocid;
								var skydocKeyArr=[];
								var skydocfilenameArr=[];
								var skydocJson={};
								var escapedInput;
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									for (var i = 0; i < resultSet.length; i++) {
										CommentDate=	resultSet[i].getValue({name:'custrecord_comments_date',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentName=resultSet[i].getValue({name:'custrecord_comments_user',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentDetails=	resultSet[i].getValue({name:'custrecord_comments_html_details',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentSkyDocResponse=	resultSet[i].getValue({name:'custrecord_comments_skydoc_api_response',join:'CUSTRECORD_COMMENTS_TASK'})
										MapRecordId=	resultSet[i].getValue({name:'internalid',join:'CUSTRECORD_COMMENTS_TASK'})
										Commentdetails = resultSet[i].getValue({name:'custrecord_comments_details',join:'CUSTRECORD_COMMENTS_TASK'})
										var htmlcontent=containsHTML(Commentdetails)
										if(htmlcontent)
										{
											escapedInput = escapeHtmlEntities(Commentdetails);

											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":escapedInput, "MapRecordId" : MapRecordId}

										}
										else
										{
											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":"","MapRecordId" : MapRecordId}

										}


										
									   
										var MapRecordString = "customrecord_project_management_comments" + MapRecordId;

										if(MapRecordId>0){
											arrayOfFilters.push( ["custrecord_tss_aws_s3_ns_record", "is", MapRecordString] )
								
											if(resultSet.length-1 != i){
												arrayOfFilters.push("OR")
											}
										}
										
										//}
										CommentArr.push(JSONComment)
									}
									resultIndex += 1000;
								} while (resultSet.length >= 1000);

								if(arrayOfFilters.length>0){
								var customrecord_tss_aws_s3_ns_file_recordSearchObj = search.create({
								   type: "customrecord_tss_aws_s3_ns_file_record",
								   filters:
									   [
										   arrayOfFilters												 ],
										columns:
											[
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_file_name", label: "File Name"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_key", label: "Key"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_filetype", label: "File Type"}),
											 search.createColumn({
											   name: "custrecord_tss_aws_s3_ns_record",
											   label: "Merchant Id"
										   })

											 ]
							   });

							   var resultIndex2 = 0;
							   var resultSet1 = '';
							   do {
								   resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({
									   start: resultIndex2,
									   end: resultIndex2 + 1000
								   });
							  //  var resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({start: 0,end: 1000});


							   log.debug('resultSet',resultSet1.length)

							   for (var j = 0; j < resultSet1.length; j++) {
								   var merchantId     = resultSet1[j].getValue({
									   name: 'custrecord_tss_aws_s3_ns_record'
								   });
								   log.debug("merchantId",merchantId)
								   var SkyDocFileName=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_file_name'});
								   var SkyDocKey=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_key'});
								   var SkyDocType=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_filetype'});
								   skydocKeyArr.push(SkyDocKey)
								   skydocfilenameArr.push(SkyDocFileName)
								   log.debug("SkyDocKey",SkyDocKey)

								   log.debug("skydocfilenameArr",skydocfilenameArr)
								   // JSONComment.uploadedFiles.push({ "filename": SkyDocFileName, "key": SkyDocKey });
								   
								   var index = CommentArr.map(function(element, index){
									   if (merchantId.indexOf(element.MapRecordId) != -1) {
										 return index;
									   }
									 });

								   var filterdValue = index.filter(function(element){
									   return element !== null && element !== undefined;
									 });
								   
									 index = filterdValue[0]
				   
									 CommentArr[index]["uploadedFiles"].push({
									   "filename": SkyDocFileName,
									   "key": SkyDocKey
								   });
							   }
							  
							  resultIndex2 += 1000;
						  } while (resultSet1.length >= 1000);
					   }


								log.debug("JSONComment", JSONComment)

								log.debug("CommentArr", CommentArr)
								var CompareArr = new Array;
								if (CommentArr) {
									var commentHtmlCode = '';

									var commentArray = CommentArr;
									for (var r = 0; r < commentArray.length; r++) {
										log.debug("commentArray[r]", commentArray[r])
										var uploadedlength = commentArray[r].uploadedFiles
										if (uploadedlength.length > 0) {
											var MultiplefilesArr = [];


											log.debug("commentArray[r] uploaded file", commentArray[r].uploadedFiles)
											var UploadedFileDetails = commentArray[r].uploadedFiles
											for (var h = 0; h < UploadedFileDetails.length; h++) {

												log.debug("length of files", UploadedFileDetails.length)
												log.debug("UploadedFileDetails[h].filename", UploadedFileDetails[h].filename)
												log.debug("UploadedFileDetails[h].key", UploadedFileDetails[h].key)
												var output = url.resolveScript({ scriptId: 'customscript_tss_skydoc_downloadfile', deploymentId: 'customdeploy_tss_skydoc_downloadfile', returnExternalUrl: true });


												output = output + '&FileName=' + UploadedFileDetails[h].filename + '&Key=' + UploadedFileDetails[h].key;
												log.debug('output', output)
												var headerObj = { 'Content-Type': 'application/json' };
												var sResponse = https.get({ url: output, headers: headerObj });
												log.debug("sResponse", sResponse)
												var Multiplefilesdata = '<a href="' + output + '" target="_blank"  >' + UploadedFileDetails[h].filename + '</a><br>'
												MultiplefilesArr.push(Multiplefilesdata)
												log.debug("MultiplefilesArr", MultiplefilesArr)


											}
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td>' + MultiplefilesArr + '</a></td><td>' + commentArray[r].details + '</td></tr>'

										}

										else {
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td></td><td>' + commentArray[r].details + '</td></tr>'

										}

									}


									landingPageContent = landingPageContent.replace('tableData1', commentHtmlCode);

								} else {
									var commentArray = [];
									landingPageContent = landingPageContent.replace('tableData1', '');

								}

								landingPageContent = landingPageContent.replace('resourceoptions', resourcetaskArr);



								var keys = Object.keys(actualJson);
								var nonkeys = Object.keys(actualnonbillJson);

								for (var j = 0; j < resourcetaskArr.length; j++) {
									if (keys.indexOf(samplearr[j]) != -1) {
										var actualwork = actualJson[samplearr[j]]

									}
									else {
										var actualwork = 0;
									}
									if (nonkeys.indexOf(samplearr[j]) != -1) {
										var actualnonbillwork = actualnonbillJson[samplearr[j]]

									}

									else {
										var actualnonbillwork = 0;
									}
									tasktabledata += '<tr><td> ' + resourcetaskArr[j] + '</td><td>' + actualwork + '</td><td>' + actualnonbillwork + '</td></tr>'
								}
								log.debug("tasktabledata", tasktabledata)



								landingPageContent = landingPageContent.replace('tableData', tasktabledata);


								if (context.request.method == 'POST') {
									log.debug("context.request.parameters", context.request.parameters)
								}
								landingPageContent = landingPageContent.replace('tableData1', '');
								landingPageContent = landingPageContent.replace('actionUrl', selfSuiteLetUrl + '&action=taskdetailspage');


							} catch (Error) {
								log.error('Error occured in UI Builder', Error);
								landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>' + Error.message + 'Please try again.</font></b>');
								context.response.write(landingPageContent);
							}
						}
						if (selectedAction == 'updatetaskpage') {
							try {
								/*var landingPageContent = file.load({
								  id: 59089
							  }).getContents().toString();*/

								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(editprojecttaskHtmlfile)] }).getContents().toString();
								var taskiddetails;
								log.debug("context.request.paramters", context.request.parameters)
								taskiddetails = context.request.parameters.taskid
								landingPageContent = landingPageContent.replace('hiddentaskid', taskiddetails);
								var taskIDDD = context.request.parameters.taskdataid;
								if ((taskiddetails == '') || (taskiddetails == null) || (taskiddetails == undefined)) {
									taskiddetails = context.request.parameters.taskdataid;
								}
								var resourcetaskArr = [];
								var calculatedworkArr = [];
								var unitcostArr = [];
								var statusoption = '';
								var projectnamedata;
								var taskobjRecord = record.load({ type: record.Type.PROJECT_TASK, id: taskiddetails, isDynamic: true, });
								var startEndProject = "";
								startEndProject = taskobjRecord.getValue({ fieldId: 'company' }) + "++";
								startEndProject = startEndProject + taskobjRecord.getText({ fieldId: 'startdate' }) + "++";
								startEndProject = startEndProject + taskobjRecord.getText({ fieldId: 'enddate' });
								//company
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var taskid = taskobjRecord.getValue({ fieldId: 'title' });

								var plannedWork = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var actualWork = taskobjRecord.getValue({ fieldId: 'actualwork' });

								var tasknamedata = JSON.stringify(taskname)
								var projectname = taskobjRecord.getText({ fieldId: 'company' });
								var projectInternalId = taskobjRecord.getValue({ fieldId: 'company' });
								var projectnamedata = '';
								var projectname = taskobjRecord.getText({ fieldId: 'company' });
								if (projectname.indexOf(":") > 0) {
									var splitprojectname = projectname.split(":")
									projectnamedata = splitprojectname[1]

								}
								else {
									projectnamedata = projectname
								}

								var statusvalue = taskobjRecord.getText({ fieldId: 'custevent_task_status' });
								var statusvalueid = taskobjRecord.getValue({ fieldId: 'custevent_task_status' });
								var descriptionvalue = taskobjRecord.getValue({ fieldId: 'message' });
								var parenttaskText = taskobjRecord.getText({ fieldId: 'custevent_tss_parent_task' });
								var parenttaskvalue = taskobjRecord.getValue({ fieldId: 'custevent_tss_parent_task' });
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var tasknamedata = JSON.stringify(taskname)
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var numLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });
								var taskDescriptionText = taskobjRecord.getValue({ fieldId: 'message' });
								var taskcommentText = taskobjRecord.getValue({ fieldId: 'custevent_update_comment' });
								var tasktabledata = ''; var samplearr = [];
								var resourcesublistFieldValue; var resourceFieldValue
								var resourcInternaletaskArr = [];
								var resourcInternaletaskArrtemp = [];
								var createdbytext = taskobjRecord.getValue({ fieldId: 'custevent_created_by' });
								var priorityVal = taskobjRecord.getValue({fieldId: 'custevent_tss_task_priority'});
								log.debug("priorityVal",priorityVal)

							   var prioritytext = taskobjRecord.getText({fieldId: 'custevent_tss_task_priority'});
								log.debug("prioritytext",prioritytext)
								var TicketVal = taskobjRecord.getValue({ fieldId: 'custevent_ticket_no' });

								landingPageContent = landingPageContent.replace('tasknamevalue', tasknamedata);
								landingPageContent = landingPageContent.replace('task_description', taskDescriptionText);
								landingPageContent = landingPageContent.replace('projectnamevalue', JSON.stringify(projectnamedata));
								landingPageContent = landingPageContent.replace('task_description', descriptionvalue);
								landingPageContent = landingPageContent.replace('actualValue', actualWork);
								landingPageContent = landingPageContent.replace('tasknamevalue', tasknamedata);
								landingPageContent = landingPageContent.replace('createdbydata', JSON.stringify(createdbytext));
								landingPageContent = landingPageContent.replace('ticketdata', TicketVal);

								for (var i = 0; i < numLines; i++) {
									resourceFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									log.debug("resourceFieldValue", resourceFieldValue);
									samplearr.push(resourceFieldValue);

									log.debug("samplearr", samplearr);
									resourcesublistFieldValue = taskobjRecord.getSublistText({ sublistId: 'assignee', fieldId: 'resource', line: i });

									resourcesublistFieldValue.substring(0, resourcesublistFieldValue.indexOf(' '));
									var s = resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1);
									log.debug("s", resourcesublistFieldValue)

									var resourceInternalId = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									var assigneeUnitCost = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									resourcetaskArr.push(resourcesublistFieldValue);
									resourcInternaletaskArr.push(resourceInternalId);
									resourcInternaletaskArrtemp.push(resourceInternalId);
									var calculatedworksublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'calculatedwork', line: i });
									calculatedworkArr.push(calculatedworksublistFieldValue);
									var unitcostsublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									unitcostArr.push(unitcostsublistFieldValue);
								}
								var projecttaskSearchObj = search.create({
									type: "timebill",
									filters:
										[

											["type", "anyof", "A"],
											"AND",
											["employee", "anyof", samplearr],
											"AND",
											["billable", "is", "T"],

											"AND",
											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});




								var resultIndex = 0;
								var resultSet = '';
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									log.debug("resultSet", resultSet.length);
									var actualworkvalue; var actualArr = []
									var actualJson = {}; var empvalue;
									for (var i = 0; i < resultSet.length; i++) {

										actualworkvalue = resultSet[i].getValue({ name: "durationdecimal", summary: "SUM" })
										empvalue = resultSet[i].getValue({ name: "employee", summary: "GROUP" })
										log.debug("empvalue", empvalue)

										if ((actualworkvalue == "") || (actualworkvalue == undefined) || (actualworkvalue == null)) {
											actualworkvalue = "0"
										}
										actualJson[empvalue] = actualworkvalue
										actualArr.push(actualworkvalue);

									}

									log.debug("resultSet", resultSet)
									log.debug("actualJson", actualJson)
									resultIndex += 1000;
								} while (resultSet.length >= 1000);



								var Nonbillablesearch = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "F"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});



								var resultIndex1 = 0;
								var resultSet1 = '';
								do {
									resultSet1 = Nonbillablesearch.run().getRange({
										start: resultIndex1,
										end: resultIndex1 + 1000
									});
									log.debug("resultSet", resultSet1.length);
									var actualnonbillworkvalue; var actualnonbillArr = []
									var actualnonbillJson = {}; var empnamevalue;
									for (var m = 0; m < resultSet1.length; m++) {
										actualnonbillworkvalue = resultSet1[m].getValue({ name: "durationdecimal", summary: "SUM" })
										empnamevalue = resultSet1[m].getValue({ name: "employee", summary: "GROUP" })

										if ((actualnonbillworkvalue == "") || (actualnonbillworkvalue == undefined) || (actualnonbillworkvalue == null)) {
											actualnonbillworkvalue = "0"
										}
										actualnonbillJson[empnamevalue] = actualnonbillworkvalue
										actualnonbillArr.push(actualnonbillworkvalue);

									}

									log.debug("resultSet", resultSet1)
									resultIndex1 += 1000;
								} while (resultSet1.length >= 1000);





								if (numLines == 0) {
									log.debug("entered");

									landingPageContent = landingPageContent.replace('tableData', '');
								}


								var arrayOfFilters = [];


								var projecttaskSearchObj = search.create({
									type: "projecttask",
									filters:
										[
										 ["job.internalid","anyof",projectInternalId],"AND",
										 ["internalid","anyof",taskiddetails],"AND",["job.isinactive","is",'F'],
										 "AND", 
										 ["custrecord_comments_task.custrecord_comments_html_details","isnotempty",""]											      
										 ],
										 columns:
											 [
											  search.createColumn({ name: "custrecord_comments_date", join: "CUSTRECORD_COMMENTS_TASK", label: "Date" }),
											  search.createColumn({ name: "custrecord_comments_user", join: "CUSTRECORD_COMMENTS_TASK", label: "Commented By" }),
											  search.createColumn({ name: "custrecord_comments_html_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details " }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "internalid", join: "CUSTRECORD_COMMENTS_TASK", label: "Internal ID" }),
											  search.createColumn({ name: "custrecord_comments_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details" })




											  ]
								});
								var CommentArr=[];
								var resultIndex = 0;
								var resultSet='';
								var CommentDate;
								var CommentDetails;
								var CommentName;
								var CommentSkyDocResponse;
								var Commentdetails;
								var MapRecordId;
								var skydocid;
								var skydocKeyArr=[];
								var skydocfilenameArr=[];
								var skydocJson={};
								var escapedInput;
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									for (var i = 0; i < resultSet.length; i++) {
										CommentDate=	resultSet[i].getValue({name:'custrecord_comments_date',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentName=resultSet[i].getValue({name:'custrecord_comments_user',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentDetails=	resultSet[i].getValue({name:'custrecord_comments_html_details',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentSkyDocResponse=	resultSet[i].getValue({name:'custrecord_comments_skydoc_api_response',join:'CUSTRECORD_COMMENTS_TASK'})
										MapRecordId=	resultSet[i].getValue({name:'internalid',join:'CUSTRECORD_COMMENTS_TASK'})
										Commentdetails = resultSet[i].getValue({name:'custrecord_comments_details',join:'CUSTRECORD_COMMENTS_TASK'})
										var htmlcontent=containsHTML(Commentdetails)
										if(htmlcontent)
										{
											escapedInput = escapeHtmlEntities(Commentdetails);

											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":escapedInput, "MapRecordId" : MapRecordId}

										}
										else
										{
											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":"","MapRecordId" : MapRecordId}

										}


										
									   
										var MapRecordString = "customrecord_project_management_comments" + MapRecordId;

										if(MapRecordId>0){
											arrayOfFilters.push( ["custrecord_tss_aws_s3_ns_record", "is", MapRecordString] )
								
											if(resultSet.length-1 != i){
												arrayOfFilters.push("OR")
											}
										}
										
										//}
										CommentArr.push(JSONComment)
									}
									resultIndex += 1000;
								} while (resultSet.length >= 1000);

								if(arrayOfFilters.length>0){
								var customrecord_tss_aws_s3_ns_file_recordSearchObj = search.create({
								   type: "customrecord_tss_aws_s3_ns_file_record",
								   filters:
									   [
										   arrayOfFilters												 ],
										columns:
											[
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_file_name", label: "File Name"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_key", label: "Key"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_filetype", label: "File Type"}),
											 search.createColumn({
											   name: "custrecord_tss_aws_s3_ns_record",
											   label: "Merchant Id"
										   })

											 ]
							   });

							   var resultIndex2 = 0;
							   var resultSet1 = '';
							   do {
								   resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({
									   start: resultIndex2,
									   end: resultIndex2 + 1000
								   });
							  //  var resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({start: 0,end: 1000});


							   log.debug('resultSet',resultSet1.length)

							   for (var j = 0; j < resultSet1.length; j++) {
								   var merchantId     = resultSet1[j].getValue({
									   name: 'custrecord_tss_aws_s3_ns_record'
								   });
								   log.debug("merchantId",merchantId)
								   var SkyDocFileName=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_file_name'});
								   var SkyDocKey=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_key'});
								   var SkyDocType=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_filetype'});
								   skydocKeyArr.push(SkyDocKey)
								   skydocfilenameArr.push(SkyDocFileName)
								   log.debug("SkyDocKey",SkyDocKey)

								   log.debug("skydocfilenameArr",skydocfilenameArr)
								   // JSONComment.uploadedFiles.push({ "filename": SkyDocFileName, "key": SkyDocKey });
								   
								   var index = CommentArr.map(function(element, index){
									   if (merchantId.indexOf(element.MapRecordId) != -1) {
										 return index;
									   }
									 });

								   var filterdValue = index.filter(function(element){
									   return element !== null && element !== undefined;
									 });
								   
									 index = filterdValue[0]
				   
									 CommentArr[index]["uploadedFiles"].push({
									   "filename": SkyDocFileName,
									   "key": SkyDocKey
								   });
							   }
							  
							  resultIndex2 += 1000;
						  } while (resultSet1.length >= 1000);
					   }



								log.debug("JSONComment", JSONComment)

								log.debug("CommentArr", CommentArr)
								var CompareArr = new Array;
								if (CommentArr) {
									var commentHtmlCode = '';

									var commentArray = CommentArr;
									for (var r = 0; r < commentArray.length; r++) {
										log.debug("commentArray[r]", commentArray[r])
										var uploadedlength = commentArray[r].uploadedFiles
										if (uploadedlength.length > 0) {
											var MultiplefilesArr = [];


											log.debug("commentArray[r] uploaded file", commentArray[r].uploadedFiles)
											var UploadedFileDetails = commentArray[r].uploadedFiles
											for (var h = 0; h < UploadedFileDetails.length; h++) {

												log.debug("length of files", UploadedFileDetails.length)
												log.debug("UploadedFileDetails[h].filename", UploadedFileDetails[h].filename)
												log.debug("UploadedFileDetails[h].key", UploadedFileDetails[h].key)
												var output = url.resolveScript({ scriptId: 'customscript_tss_skydoc_downloadfile', deploymentId: 'customdeploy_tss_skydoc_downloadfile', returnExternalUrl: true });


												output = output + '&FileName=' + UploadedFileDetails[h].filename + '&Key=' + UploadedFileDetails[h].key;
												log.debug('output', output)
												var headerObj = { 'Content-Type': 'application/json' };
												var sResponse = https.get({ url: output, headers: headerObj });
												log.debug("sResponse", sResponse)
												var Multiplefilesdata = '<a href="' + output + '" target="_blank"  >' + UploadedFileDetails[h].filename + '</a><br>'
												MultiplefilesArr.push(Multiplefilesdata)
												log.debug("MultiplefilesArr", MultiplefilesArr)


											}
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td>' + MultiplefilesArr + '</a></td><td>' + commentArray[r].details + '</td></tr>'

										}

										else {
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td></td><td>' + commentArray[r].details + '</td></tr>'

										}

									}


									landingPageContent = landingPageContent.replace('tableData1', commentHtmlCode);

								} else {
									var commentArray = [];
									landingPageContent = landingPageContent.replace('tableData1', '');

								}


								log.debug("parenttaskText", parenttaskText)
								if (parenttaskText) {
									landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent" checked="checked"><label for="parentid">Is Child</label>');
								} if ((parenttaskText == null) || (parenttaskText == undefined) || (parenttaskText == '')) {
									landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent" ><label for="parentid">Is Child</label>');
								}
								landingPageContent = landingPageContent.replace('estimateValue', Math.round(plannedWork));


								var resourceDataCode = showUpdateProjectPage(projectInternalId, "resourceid", "employee", "entityid", resourcInternaletaskArr);


								//landingPageContent = landingPageContent.replace('resourceData',resourceDataCode);
								var htmlCode = ''
								var jobSearchObj = search.create({
									type: "job",
									filters:
										[
											["internalid", "anyof", projectInternalId],"AND",["isinactive","is","F"]

										],
									columns:
										[
											search.createColumn({ name: "jobresource", label: "Project Resource" }),
											search.createColumn({ name: "internalid", join: "projectResource", label: "Internal ID" })
										]
								});
								jobSearchObj.run().each(function (result) {
									htmlCode += '<option  value="' + result.getValue({ name: 'internalid', join: 'projectResource' }) + '" >' + result.getText('jobresource') + '</option>';

									return true;
								});
								landingPageContent = landingPageContent.replace('resourceData1', htmlCode);

								var htmlCode1 = ''
								var jobSearchObj = search.create({
									type: "job",
									filters:
										[
											["internalid", "anyof", projectInternalId],"AND",["isinactive","is","F"]

										],
									columns:
										[
											search.createColumn({ name: "jobresource", label: "Project Resource" }),
											search.createColumn({ name: "internalid", join: "projectResource", label: "Internal ID" })
										]
								});
								jobSearchObj.run().each(function (result) {
									htmlCode1 += '<option  value="' + result.getValue({ name: 'internalid', join: 'projectResource' }) + '" >' + result.getText('jobresource') + '</option>';

									return true;
								});

								landingPageContent = landingPageContent.replace('resourceData2', htmlCode1);

								statusoption += '<option value="' + statusvalueid + '" selected>' + statusvalue + '</option>';
								if (statusvalue == "In Progress") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Not Started") {
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Completed") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Closed") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';


								} else if (statusvalue == "Re-Opened") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Closed</option>';


								} else {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';
									statusoption += '<option value="5">Re Opened</option>';

									statusoption += '<option value="" disabled selected>Select Status</option>';


								}

								var priorityoption='';

										 priorityoption += '<option value="'+priorityVal+'" selected>'+prioritytext+'</option>';
										 if(priorityVal=="1"){
											priorityoption+='<option value="2">Medium</option>';
											priorityoption+='<option value="3">Low</option>';
										 }else if(priorityVal=="2"){
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="3">Low</option>';
										 }else if(priorityVal=="3"){
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="2">Medium</option>';

										 }else
										 {
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="2">Medium</option>';
											priorityoption+='<option value="3">Low</option>';
											 
										 }

								var alltaskdata = ''
								var searchObj = search.create({
									type: 'projecttask',
									filters: [['project', 'is', projectInternalId]],
									columns:
										[search.createColumn({ name: "title", sort: search.Sort.ASC }),
										search.createColumn({ name: "internalid" })
										]
								});

								var tasksearchobj = searchObj.run().getRange({ start: 0, end: 1000 });

								if (tasksearchobj.length > 0) {
									alltaskdata += '<select      name="parentupdateid" id="parentupdateid" >';
									var flag = false;
									for (var i = 0; i < tasksearchobj.length; i++) {
										if (tasksearchobj[i].getValue('title') === taskname) {
											continue;
										}

										if (tasksearchobj[i].getValue('internalid') == parenttaskvalue) {
											flag = true;
											alltaskdata += '<option value="' + tasksearchobj[i].getValue('internalid') + '" selected>' + tasksearchobj[i].getValue('title') + '</option>';
										}
										else {

											alltaskdata += '<option  value="' + tasksearchobj[i].getValue('internalid') + '" >' + tasksearchobj[i].getValue('title') + '</option>';

										}
									}
									if (!flag) {
										alltaskdata += '<option value="" disabled selected>Select Parent Task</option>';
									}

									alltaskdata += '</select>'
								}

								landingPageContent = landingPageContent.replace('parenttask', alltaskdata);
								landingPageContent = landingPageContent.replace('statusdata', statusoption);
								landingPageContent = landingPageContent.replace('prioritydata',priorityoption);


								if (resourcetaskArr) {
									landingPageContent = landingPageContent.replace('resourceoptions', resourcetaskArr);
									var billkeys = Object.keys(actualJson);
									var nonkeys = Object.keys(actualnonbillJson);
									for (var j = 0; j < resourcetaskArr.length; j++) {
										if (billkeys.indexOf(samplearr[j]) != -1) {
											var actualwork = actualJson[samplearr[j]]
										} else {
											var actualwork = 0;
										}
										if (nonkeys.indexOf(samplearr[j]) != -1) {
											var actualnonbillwork = actualnonbillJson[samplearr[j]]
										}

										else {
											var actualnonbillwork = 0;
										}
										tasktabledata += '<tr><td> ' + resourcetaskArr[j] + '</td><td>' + actualwork + '</td><td>' + actualnonbillwork + '</td></tr>'
									}
									log.debug("tasktabledata", tasktabledata)

									//	landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent"><label for="parentid">Is Child</label>');

									landingPageContent = landingPageContent.replace('tableData', tasktabledata);
								}
								else {
									landingPageContent = landingPageContent.replace('resourceoptions', '');

								}

								landingPageContent = landingPageContent.replace('$#email%*', '<input width: 40px; height: 40px type="checkbox" id="emailboxid" name="emailboxid" ><label for="emailboxid">Send Email</label>');
								if (context.request.method == 'POST') {

									var taskComment = context.request.parameters.comment;
									var postData = context.request.parameters.Data;
									log.debug("postData", postData)
									var postData = JSON.parse(postData);
									var task_id = context.request.parameters.taskdataid;
									var AssigneeLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });
									var AssigneeArray = []
									for (var i11 = 0; i11 < AssigneeLines; i11++) {
										var assigneeId = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i11 });
										AssigneeArray.push(assigneeId);
									}
									log.debug("AssigneeArray", AssigneeArray);
									var taskName1 = taskobjRecord.getText({ fieldId: "title" });
									log.debug("taskName1", taskName1)
									var projectName1 = taskobjRecord.getText({ fieldId: "company" });
									var startVal = projectName1.indexOf(":");
									var strlength = projectName1.length;
									projectName1 = projectName1.substring(startVal + 1, strlength);
									log.debug("projectName1", projectName1)
									var taskStartDate = taskobjRecord.getText({ fieldId: "startdate" });
									var taskEndDate = taskobjRecord.getText({ fieldId: "enddate" });
									log.debug("taskStartDate")
									if (postData.actionId == 'save') {
										log.debug("context.request.parameters", context.request.parameters);
										var projecttaskvalue = context.request.parameters.projectname;
										var multiresource = context.request.parameters.multiresourceData;
										var updatedResourceData = JSON.parse(multiresource)
										var tasknamevalue = context.request.parameters.taskname;
										var statuslistvalue = context.request.parameters.statuslist;
										log.debug("statuslistvalue", statuslistvalue)
										var estimateValue = context.request.parameters.estimate;
										var taskDescription1 = context.request.parameters.description;

										var ischildvalue = context.request.parameters.parent;
										log.debug("ischildvalue", ischildvalue)
										var parentupdatevalue = context.request.parameters.parentupdateid;

										var sendEmailBox = context.request.parameters.myCheckbox;
										var resouceto = context.request.parameters.resourcetoid;

										var CommentVal = context.request.parameters.comment;
										var prioritylistvalue=context.request.parameters.prioritylist;

										var FileVal = context.request.parameters.fileinput;
										log.debug("FileVal", FileVal)
										var splitfile = FileVal.split(".");
										var filename = splitfile[0];
										var filetype = splitfile[1];
										log.debug("filetype", filetype)

										var FileDetailsVal = context.request.parameters.filedetails;
										var filevalue;
										if (FileDetailsVal) {
											var jsondetails = JSON.parse(FileDetailsVal);
											log.debug("jsondetails", jsondetails)
											filevalue = jsondetails['file'];

											var filecontents;
											var emailattachement;

											if(filetype=='txt')
												 {
													 filetype=file.Type.PLAINTEXT
log.debug("filevalue",filevalue)
var base64Data = filevalue.replace(/^data:text\/plain;base64,/, '');

													 //var decodedContent = atob(filevalue.split(',')[1]);
													 var decodedContent1 = encode.convert({
														string: base64Data,
														 inputEncoding: encode.Encoding.BASE_64,
														 outputEncoding: encode.Encoding.UTF_8
													});

													log.debug("decodedContent1",decodedContent1)


													 filecontents=decodedContent1
													 
													  emailattachement = file.create({
														 name: filename+'.'+filetype,
														 fileType: file.Type.PLAINTEXT,
														 contents: decodedContent1,
														
													 });
												 }
											else if (filetype === 'xlsx') {
												filetype = file.Type.EXCEL
												log.debug("filevalue", filevalue)
												var base64Data = filevalue.replace(/^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.EXCEL,
													contents: base64Data,
												   
												});

											}
											
											else if (filetype === 'png') {
												filetype = file.Type.PNGIMAGE

												var base64Data = filevalue.replace(/^data:image\/png;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PNGIMAGE,
													contents: base64Data,
												   
												});

											}
											else if (filetype === 'csv'){
												filetype=file.Type.PLAINTEXT
												log.debug("filevalue",filevalue)

												/*var decodedContent1 = encode.convert({
														 string: base64Data,
														 inputEncoding: encode.Encoding.UTF_8,
														 outputEncoding: encode.Encoding.BASE_64
													   });*/


												var base64Data = filevalue.replace(/^data:text\/csv;base64,/, '');
												/*	var decodedContent1 = encode.convert({
														 string: base64Data,
														 inputEncoding: encode.Encoding.UTF_8,
														 outputEncoding: encode.Encoding.BASE_64
													   });*/


												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString()); 
												filecontents=base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PLAINTEXT,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'jpg') {
												filetype = file.Type.JPGIMAGE
												var base64Data = filevalue.replace(/^data:image\/jpeg;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.JPGIMAGE,
													contents: base64Data,
												   
												});

											}

											else if (filetype == 'docx') {
												filetype = file.Type.WORD

												var base64Data = filevalue.replace(/^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.WORD,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'doc') {
												filetype = file.Type.WORD
												log.debug("filevalue", filevalue)
												var base64Data = filevalue.replace(/^data:application\/msword;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.WORD,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'pdf') {
												filetype = file.Type.PDF
												/*var decodedContent = encode.convert({
											  string: filevalue.toString(),
											  inputEncoding: encode.Encoding.UTF_8,
											  outputEncoding: encode.Encoding.BASE_64
											});*/
												var base64Data = filevalue.replace(/^data:application\/pdf;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PDF,
													contents: base64Data,
												   
												});

											}
											

										}
										log.debug("resouceto 111", updatedResourceData)
										log.debug("sendEmailBox", sendEmailBox)
										log.debug("trigg", "trigg")
										if (sendEmailBox == 'on') {
											var fileid;
											if (containsHTML(CommentVal)) {
												log.debug("entered the html content")
												var filenamedata = loggedinclientname + '' + taskiddetails
												var fileObj = file.create({
													name: filenamedata,
													fileType: file.Type.PLAINTEXT,
													contents: CommentVal,
													encoding: file.Encoding.UTF8,
													folder: 8190,
													isOnline: true
												});
												fileid = fileObj.save();
												log.debug("fileid", fileid)
												var fileObjload = file.load({
													id: fileid
												});

											} else {
												log.debug("entered text content")
											}
											var recipientsLength = updatedResourceData.length;
											log.debug("recipientsLength", recipientsLength)

											if (recipientsLength <= 10) {
												log.debug("below 10 receivers")
												var subjectdata = {}
												subjectdata['taskname'] = tasknamevalue
												subjectdata['taskid'] = taskiddetails
												log.debug("subjectdata",subjectdata)

												var html = ''
												html += '<html><body>'
												html += '<p>' + tasknamevalue + '</p>'
												html += '<p style="display:none">' + taskiddetails + '</p>'
												html += '</body></html>'


												log.debug("json stringify subjectdata", JSON.stringify(subjectdata))

												if (fileObjload) {
													if (emailattachement) {
														log.debug("emailattachement",emailattachement)

														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: updatedResourceData, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload, emailattachement] });
													}
													else {
														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: updatedResourceData, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload] });

													}

												}
												else {
													log.debug("emailattachement", emailattachement)
													if (emailattachement) {

														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [updatedResourceData], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [emailattachement] });
													}
													else {
														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [updatedResourceData], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal });

													}
												}

											} else {
												var lenn = recipientsLength / 10;
												for (var a5 = 0; a5 < lenn; a5++) {
													var p1 = a5 * 10;
													var q1 = a5 * 10 + 10;
													var resourceArr2 = [];
													for (var a6 = p1; a6 >= p1 && a6 < q1; a6++) {
														if (a6 < updatedResourceData.length) {
															resourceArr2.push(updatedResourceData[a6])
														}

													}
													var subjectdata = {}
													subjectdata['taskname'] = tasknamevalue
													subjectdata['taskid'] = taskiddetails
													if (fileObjload) {
														if (emailattachement) {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: resourceArr2, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload, emailattachement] });
														}
														else {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: resourceArr2, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload] });

														}
													}
													else {
														if (emailattachement) {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [resourceArr2], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [emailattachement] });
														}
														else {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [resourceArr2], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal });

														}
													}
												}
											}



											for (var i = 0; i < updatedResourceData.length; i++) {
												var ResourceEmail = search.lookupFields({ type: search.Type.EMPLOYEE, id: updatedResourceData[i], columns: ['email'] });
												log.debug('ResourceEmail', ResourceEmail)
											}

										}
										// var projectRecObject 	= record.load({type:'job',id: projectInternalId,isDynamic: true,});
										/*  var resourceLines        = projectRecObject.getLineCount({sublistId: 'jobresources'}); 
									  var projectResourceArrIdstemp = []
									  var projectResourceArrIds = []
									  for(var k1=0;k1<resourceLines;k1++){
										  var resourceInternalId = projectRecObject.getSublistValue({sublistId: 'jobresources',fieldId: 'jobresource',line:k1});
										  projectResourceArrIds.push(resourceInternalId);
										  projectResourceArrIdstemp.push(resourceInternalId);
									  }
									  var countVal = 0;
									  var newProjectRecource = []
									  var newTaskRecource = []
	
									  for(var k5=resourcInternaletaskArr.length-1;k5>=0;k5--){
										  taskobjRecord.removeLine({sublistId: 'assignee',line: k5,ignoreRecalc: true});
									  }
									  log.debug("updatedResourceData",updatedResourceData)
									  var eachPlannedWord = plannedWork/(updatedResourceData.length)
	
									  for(var k2=0;k2<updatedResourceData.length;k2++){
										  var taskIndex = resourcInternaletaskArrtemp.indexOf(updatedResourceData[k2]);
										  var projectIndex = projectResourceArrIdstemp.indexOf(updatedResourceData[k2]);
	
										  if( projectIndex < 0 ){
											  projectResourceArrIds.push(updatedResourceData[k2]);
											  projectRecObject.selectNewLine({sublistId: 'jobresources'});
											  projectRecObject.setCurrentSublistValue({sublistId: 'jobresources',fieldId: 'jobresource',value: updatedResourceData[k2]});
											  projectRecObject.commitLine({sublistId: 'jobresources'});
	
										  }
	
	
	
									  }
									  var updatedProjectId = projectRecObject.save({enableSourcing: false,ignoreMandatoryFields: true});
	
									  for(var k2=0;k2<updatedResourceData.length;k2++){
										  taskobjRecord.selectNewLine({sublistId: 'assignee'});
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'resource',value: updatedResourceData[k2]});
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'plannedwork',value: eachPlannedWord });
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'unitcost',value: assigneeUnitCost});
										  taskobjRecord.commitLine({sublistId: 'assignee'});
									  }*/
										if (ischildvalue == "on") {
											taskobjRecord.setValue({ fieldId: 'custevent_tss_parent_task', value: parentupdatevalue })
										}



										var originalstatus;
										if (statuslistvalue == '1') {
											originalstatus = "PROGRESS"
										}
										if (statuslistvalue == '2') {
											originalstatus = "NOTSTART"
										} if (statuslistvalue == '3') {
											originalstatus = "COMPLETE"
										}
										if(prioritylistvalue){
											taskobjRecord.setValue({fieldId:'custevent_tss_task_priority',value:prioritylistvalue});
											}
										var empSearchObj = search.lookupFields({ type: 'customer', id: customerdetails, columns: ['entityid'] });
										log.debug("empSearchObj", empSearchObj);
										//var dateVal = new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear()+'  '+new Date().getHours()+':'+new Date().getMinutes()

										var currentDateTime = new Date();
										var dateVal = format.parse({
											value: currentDateTime,
											type: format.Type.DATETIME,
										});
										var newComment = { "date": dateVal, "name": loggedinclientname, "message": taskComment };
										var commentRecord = record.create({ type: 'customrecord_project_management_comments' })
										commentRecord.setValue({ fieldId: 'custrecord_comments_project', value: projectInternalId })
										commentRecord.setValue({ fieldId: 'custrecord_comments_task', value: taskiddetails })
										commentRecord.setValue({ fieldId: 'custrecord_comments_date', value: dateVal })
										commentRecord.setValue({ fieldId: 'custrecord_comments_user', value: loggedinclientname })
										commentRecord.setValue({ fieldId: 'custrecord_comments_html_details', value: taskComment })

										commentRecord.setValue({ fieldId: 'custrecord_comments_details', value: taskComment })
										var CustRecord = commentRecord.save();
										log.debug("commentRecord", CustRecord)

										var skydocApiResponse = new Array();

										var apiRes = {};

										if (filecontents) {
											var postData = { 'fileName': FileVal, 'fileType': filetype, 'recordType': 'customrecord_project_management_comments', 'recordId': CustRecord, 'folderId': '1054', 'fileContent': filecontents };
											var postData = JSON.stringify(postData);
											log.debug('File Post Data', postData);
											var restUrl = 'https://6647300.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=379&deploy=1';
											var method = 'POST';
											var headers = oauth_new1.getHeaders({
												url: restUrl,
												method: method,
												tokenKey: secret_new1.token.public,
												tokenSecret: secret_new1.token.secret
											});
											headers['Content-Type'] = 'application/json';
											log.debug('headers', headers);
											var restResponse = https.post({ url: restUrl, headers: headers, body: postData });
											log.debug('response', JSON.stringify(restResponse));
											apiRes['fileName'] = FileVal;
											apiRes['Skydoc API Response'] = restResponse.body;
											skydocApiResponse.push(JSON.stringify(apiRes));

											var cusRecordId = record.submitFields({ type: 'customrecord_project_management_comments', id: CustRecord, values: { 'custrecord_comments_skydoc_api_response': skydocApiResponse }, options: { ignoreMandatoryFields: true } });





										} else {
											apiRes['fileName'] = filename;
											apiRes['Skydoc API Response'] = '{"error" : {"code" : "JS_EXCEPTION", "message" : "Unsupported fileType"}}';
											skydocApiResponse.push(apiRes);
										}




										taskobjRecord.setValue({ fieldId: 'custevent_tss_parent_task', value: parentupdatevalue });

										taskobjRecord.setValue({ fieldId: 'custevent_task_status', value: statuslistvalue });
										taskobjRecord.setValue({ fieldId: 'status', value: originalstatus });

										taskobjRecord.setValue({ fieldId: 'plannedwork', value: Math.round(estimateValue) });
										taskobjRecord.setValue({ fieldId: 'message', value: taskDescription1 });
										var task_rec = taskobjRecord.save({ enableSourcing: false, ignoreMandatoryFields: true });
										if (Number(task_rec == 0)) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to update task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been updated successfully</font></b>');
										}

									} if (postData.actionId == 'close') {
										log.debug(" 111111111111111")
										//loggedInClientId
										var taskRecordId = record.submitFields({ type: record.Type.PROJECT_TASK, id: task_id, values: { status: "COMPLETE", custevent_task_status: "4", custevent_update_comment: taskComment }, options: { enableSourcing: false, ignoreMandatoryFields: true } });
										if (Number(taskRecordId) == 0) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to close task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been  Closed successfully</font></b>');
										}

									} if (postData.actionId == 'delete') {
										var taskRecordId = record.submitFields({ type: record.Type.PROJECT_TASK, id: task_id, values: { custeventinactive: true, custevent_update_comment: taskComment }, options: { enableSourcing: false, ignoreMandatoryFields: true } });
										if (Number(taskRecordId) == 0) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to inactivated task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been  inactivated successfully</font></b>');
										}
									}



								}
								landingPageContent = landingPageContent.replace('confirmcreation', '');
							} catch (Error) {
								log.error('Error occured in UI Builder', Error);
								landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>' + Error.message + 'Please try again.</font></b>');
								context.response.write(landingPageContent);
							}

						}
						if (selectedAction == 'createtask') {
							try {
								/* var landingPageContent = file.load({
									  id: 59083
								  }).getContents().toString();*/

								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(createtaskHtmlFile)] }).getContents().toString();

								var allprojectdata = ''

								var projectnameid = context.request.parameters.projecttaskdetails;
								log.debug("projectnameid", projectnameid)

								var projectnametask = context.request.parameters.projectdetails;

								var jobsearchobj = search.create({
									type: 'job',
									filters: [["isinactive", "is", "F"], "AND", ["status", "noneof", "1"], "AND", ["customer", "anyof", customerdetails], "AND", ["custentity_selecting_contact", "anyof", loggedInClientId]],
									columns: [search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "Name" }),
									search.createColumn({ name: "customer", label: "CUSTOMER" }),
									search.createColumn({ name: "companyname", label: "Project Name" }),
									search.createColumn({ name: "internalid", label: "Internal Id" }),
									]
								});
								jobsearchobj = jobsearchobj.run().getRange({ start: 0, end: 1000 });
								if (jobsearchobj.length > 0) {
									allprojectdata += '<select name="allproject" id="allproject" required >';
									for (var i = 0; i < jobsearchobj.length; i++) {
										if (jobsearchobj[i].getValue('internalid') == projectnameid) {
											allprojectdata += '<option value="' + jobsearchobj[i].getValue('internalid') + '"  selected>' + jobsearchobj[i].getValue('companyname') + '</option>'
										}
										allprojectdata += '<option  value="' + jobsearchobj[i].getValue('internalid') + '" >' + jobsearchobj[i].getValue('companyname') + '</option>';

									}
									if ((projectnameid == '') || (projectnameid == null) || (projectnameid == undefined)) {
										allprojectdata += '<option  value="" disabled selected >Select Project</option>';
									}

									allprojectdata += '</select>'
								}
								landingPageContent = landingPageContent.replace('projectdata', allprojectdata);
								//landingPageContent = landingPageContent.replace('cuserrole',loggedRole);



								var ProjectTaskSelectionOptions = returnProjectTaskSelectionOptions(selectedAction, customerdetails);
								//log.debug("ProjectTaskSelectionOptions",ProjectTaskSelectionOptions);
								//log.debug("ProjectTaskSelectionOptions",ProjectTaskSelectionOptions.length);
								landingPageContent = landingPageContent.replace('TaskListOption', JSON.stringify(ProjectTaskSelectionOptions));
								//log.debug("ProjectTaskSelectionOptions",JSON.stringify(ProjectTaskSelectionOptions));
								//log.debug("ProjectTaskSelectionOptions",JSON.stringify(ProjectTaskSelectionOptions).length);

								//  var taskFilterHtml			  = addfilterFields("taskfilterid","projecttask","title","Select Task",taskSelectedVal,projectSelectedVal);
								// landingPageContent			  = landingPageContent.replace('taskFieldId',taskFilterHtml);

								//log.debug("context.request.parameters",context.request.parameters)
								var actiondata = context.request.parameters.Data;
								//log.debug("actiondata",actiondata)
								//landingPageContent = landingPageContent.replace('actionUrl',selfSuiteLetUrl+'&action=empDirect'+'&e='+encryptedText);
								if (context.request.method == 'POST') {
									log.debug("context.request.parameters 111111111111111111111111111         2119", context.request.parameters);
									var resourceArr = [];
									var rolesArr = []
									var actiondata = context.request.parameters.Data;
									var taskname = context.request.parameters.task_name;
									var projectid = context.request.parameters.allproject;
									log.debug("projectid", projectid)
									var taskstatus = context.request.parameters.statuslist;
									log.debug("taskstatus", taskstatus)
									var priorityvalue = context.request.parameters.prioritylist;
									var subtaskvalue = context.request.parameters.taskfilterid;

									var taskDescription = context.request.parameters.taskdescription;
									var resourceplannedwork = context.request.parameters.plannedworkresource
									var resourceunitcost = context.request.parameters.unitcost


									if (projectid) {
										var prevticketno;
											var prevticketname;

											var tasksearch = search.create({
												type: "projecttask",
												filters:
													[
														["job.internalid", "anyof", projectid],"AND",["job.isinactive","is","F"]
													],
												columns:
													[
														search.createColumn({
															name: "custevent_ticket_number",
															summary: "MAX",
															sort: search.Sort.DESC,
															label: "Ticket Number"
														})

													]
											});
											var SearchObjAllDetails = tasksearch.run().getRange({ start: 0, end: 1000 });
											log.debug("SearchObjAllDetails", SearchObjAllDetails.length)
											if (SearchObjAllDetails.length > 0) {
												for (var i = 0; i < SearchObjAllDetails.length; i++) {
													prevticketno = SearchObjAllDetails[0].getValue({ name: 'custevent_ticket_number', summary: 'MAX' });
													//  prevticketname = SearchObjAllDetails[0].getValue({name:'custevent_ticket_no',summary:'GROUP'});

													log.debug("prevticketno", prevticketno)

												}
											}
										var sametasksearch = search.create({
											type: "projecttask",
											filters: [["job.internalid", "anyof", projectid], "AND",["job.isinactive","is","F"],"AND", ["title", "is", taskname]],
											columns: [search.createColumn({ name: "title", label: "Name" })]
										});
										var taskSearchObjAllDetails = sametasksearch.run().getRange({ start: 0, end: 1000 });
										if (taskSearchObjAllDetails.length > 0) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Entered Task name is already exists in the selected project (Please give another name)</font></b>');
										} else {
											var pmresourceArr = [];
											var jobobjRecord = record.load({ type: record.Type.JOB, id: projectid, isDynamic: true, });
											var projectName = jobobjRecord.getText({ fieldId: 'companyname' });
											var numLines = jobobjRecord.getLineCount({ sublistId: 'jobresources' });
											var managervalue = jobobjRecord.getValue({ fieldId: 'projectmanager' });
											//	log.debug("managervalue",managervalue)
											for (var i = 0; i < numLines; i++) {
												var resourcename = jobobjRecord.getSublistValue({ sublistId: 'jobresources', fieldId: 'jobresource', line: i });
												var roledata = jobobjRecord.getSublistValue({ sublistId: 'jobresources', fieldId: 'role', line: i });
												rolesArr.push(roledata)
												log.debug("role", rolesArr);
												if (roledata == -2) {
													pmresourceArr.push(resourcename);
												} else {
													resourceArr.push(resourcename);
												}
											}

											if (resourceplannedwork) {

												var plannedworkdataVal = resourceplannedwork / resourceArr.length;
												var plannedworkdata1 = Math.round(plannedworkdataVal)
											}
											else {
												var plannedworkdataVal = 1 / resourceArr.length;
												var plannedworkdata1 = Math.round(plannedworkdataVal)

											}

											//var	 plannedworkdata=	plannedworkdata1.toFixed(2)
											var originalstatus;
											var taskobjRecord = record.create({ type: record.Type.PROJECT_TASK, isDynamic: true });
											taskobjRecord.setValue({ fieldId: 'title', value: taskname });
											taskobjRecord.setValue({ fieldId: 'company', value: projectid });
											taskobjRecord.setValue({ fieldId: 'custevent_task_status', value: taskstatus });
											taskobjRecord.setValue({ fieldId: 'priority', value: priorityvalue });
											if (subtaskvalue) {
												taskobjRecord.setValue({ fieldId: 'custevent_tss_parent_task', value: subtaskvalue });
											}
											if (taskstatus == '1') {
												originalstatus = "PROGRESS"
											}
											if (taskstatus == '2') {
												originalstatus = "NOTSTART"
											} if (taskstatus == '3') {
												originalstatus = "COMPLETE"
											}
											if (prevticketno) {
												var Jobname = jobobjRecord.getText({ fieldId: 'companyname' });
												// var ticektdata = Jobname.substring(0, 3)
												// log.debug("ticektdata else", ticektdata)
												var clientvalue = jobobjRecord.getText({ fieldId: 'parent' });
												var Clientval = clientvalue.substring(0, 3)
												log.debug("Clientval", Clientval)
												var ticketno = Number(prevticketno) + 1
												taskobjRecord.setValue({ fieldId: 'custevent_ticket_no', value: Clientval.toUpperCase() + '-' + ticketno });
												taskobjRecord.setValue({ fieldId: 'custevent_ticket_number', value: ticketno });

											}
											else {
												var Jobname = jobobjRecord.getText({ fieldId: 'companyname' });
												// var ticektdata = Jobname.substring(0, 3)
												// log.debug("ticektdata else", ticektdata)
												var clientvalue = jobobjRecord.getText({ fieldId: 'parent' });
												var Clientval = clientvalue.substring(0, 3)
												log.debug("Clientval", Clientval)
												taskobjRecord.setValue({ fieldId: 'custevent_ticket_no', value: Clientval.toUpperCase() + '-'+ 1 });
												taskobjRecord.setValue({ fieldId: 'custevent_ticket_number', value: 1 });

											}
											taskobjRecord.setValue({ fieldId: 'status', value: originalstatus });
											if (resourceplannedwork) {
												taskobjRecord.setValue({ fieldId: 'plannedwork', value: Math.round(resourceplannedwork)});

											}
											taskobjRecord.setValue({ fieldId: 'message', value: taskDescription });
											var projectEndDate = search.lookupFields({ type: 'job', id: projectid, columns: ['enddate'] });
											if (projectEndDate.enddate.length == 0) {
												var projectCalculatedDate = search.lookupFields({ type: 'job', id: projectid, columns: ['calculatedenddate'] });
												log.debug("projectCalculatedDate.calculatedenddateprojectCalculatedDate.calculatedenddate", projectCalculatedDate.calculatedenddate)
												taskobjRecord.setText({ fieldId: 'enddate', value: projectCalculatedDate.calculatedenddate });
											} else {
												taskobjRecord.setText({ fieldId: 'enddate', value: projectEndDate.enddate });
											}
											for (var i = 0; i < resourceArr.length; i++) {
												taskobjRecord.selectNewLine({ sublistId: 'assignee' });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'resource', value: resourceArr[i] });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'plannedwork', value: Math.round(plannedworkdata1) });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', value: '1' });
												taskobjRecord.commitLine({ sublistId: 'assignee' });
											}
											for (var i = 0; i < pmresourceArr.length; i++) {
												taskobjRecord.selectNewLine({ sublistId: 'assignee' });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'resource', value: pmresourceArr[i] });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'plannedwork', value: "0" });
												taskobjRecord.setCurrentSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', value: "0" });
												taskobjRecord.commitLine({ sublistId: 'assignee' });
											}
											log.debug("loogedInCustomer", loogedInCustomer)
											taskobjRecord.setValue({ fieldId: 'custevent_created_by', value: loogedInCustomer });

											var taskrecordId = taskobjRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
											if (taskrecordId) {
												var mergeResult = render.mergeEmail({
													templateId: createTaskEmailTemplateId,
													entity: null,
													recipient: null,
													supportCaseId: null,
													//												transactionId: tra115432nsactionId,
													customRecord: null
												});
												var emailSubject = mergeResult.subject;
												var emailBody = mergeResult.body;
												emailSubject = emailSubject.replace("Name", taskname)
												emailBody = emailBody.replace("Task1", taskname)
												emailBody = emailBody.replace("projectName", projectName)
												emailBody = emailBody.replace("taskName", taskname)
												emailBody = emailBody.replace("startDateValue", loggedinclientname)
												emailBody = emailBody.replace("loggedEmployeeName", loggedinclientname)
												var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: managervalue, subject: emailSubject, body: emailBody });
												//taskname
												//var projectManagerObj = search.lookupFields({type: search.Type.PROJECT_TASK,id: taskrecordId,columns: ['title']});
											}
										}

										if (Number(taskrecordId == 0)) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to create Task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been  created successfully</font></b>');
										}
									}
								}
								landingPageContent = landingPageContent.replace('confirmcreation', '');

							} catch (Error) {
								log.error('Error occured in UI Builder', Error);
								landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>' + Error.message + 'Please try again.</font></b>');
								context.response.write(landingPageContent);
							}
						}

						if ((selectedAction == 'task') || (selectedAction == 'taskbutton')) {
							/*var landingPageContent = file.load({
								  id: 59085
							  }).getContents().toString();*/
							var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(taskHtmlfile)] }).getContents().toString();


							log.debug("context.request.parameters", context.request.parameters);
							if (projectInternalIDArr.length > 0) {
								var taskdata = fetchtaskDirectory(selfSuiteLetUrl, customerdetails, loggedInClientId, encryptedText, projectInternalIDArr);
								log.debug("taskdata", taskdata)
								landingPageContent = landingPageContent.replace('tableData', taskdata);
							}
							else {
								landingPageContent = landingPageContent.replace('tableData', '');

							}
							landingPageContent = landingPageContent.replace('actionUrl', selfSuiteLetUrl + '&action=task&clientname=' + loggedInClientId);


						}
						if (selectedAction == 'detailsoftaskpage') {
							try {
								/*var landingPageContent = file.load({
									  id: 59088
								  }).getContents().toString();
								 */

								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(viewtaskthmlfile)] }).getContents().toString();

								var taskiddetails;
								log.debug("context.request.paramters", context.request.parameters)
								taskiddetails = context.request.parameters.taskid
								var sourcetaskname = search.lookupFields({ type: search.Type.PROJECT_TASK, id: taskiddetails, columns: ['title'] });
								var tasknameintask = sourcetaskname.title;
								landingPageContent = landingPageContent.replace('TaskDetails', tasknameintask);
								var sourcetaskname = search.lookupFields({ type: search.Type.PROJECT_TASK, id: taskiddetails, columns: ['title'] });
								var tasknamedetails = sourcetaskname.title;
								landingPageContent = landingPageContent.replace('tasknamevalue', JSON.stringify(tasknamedetails));
								if ((taskiddetails == '') || (taskiddetails == null) || (taskiddetails == undefined)) {
									taskiddetails = context.request.parameters.taskdataid;
								}
								var resourcetaskArr = [];
								var calculatedworkArr = [];
								var unitcostArr = [];
								var statusoption = '';
								var taskobjRecord = record.load({ type: record.Type.PROJECT_TASK, id: taskiddetails, isDynamic: true, });
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var tasknamedata = JSON.stringify(taskname)
								var projectid = taskobjRecord.getValue({ fieldId: 'company' });
								var managersearchobj = search.create({
									type: "job",
									filters: [["internalid", "anyof", projectid],"AND",["isinactive","is","F"]],
									columns: [search.createColumn({ name: "entityid", join: "projectManager", label: "Name" }),]
								});
								var managersearch = managersearchobj.run().getRange({ start: 0, end: 100 });
								var managervalue;
								for (var m = 0; m < managersearch.length; m++) {
									managervalue = managersearch[m].getValue({ name: "entityid", join: "projectManager" })
								}
								/*var projectname = taskobjRecord.getText({fieldId: 'company'});
									 var splitprojectname=projectname.split(":")
									 var splitdata=splitprojectname[1];*/
								var projectsplitData = '';
								var projectname = taskobjRecord.getText({ fieldId: 'company' })
								log.debug("projectname", projectname)
								if (projectname.indexOf(":") > 0) {
									var splitprojectname = projectname.split(":")
									projectsplitData = splitprojectname[1]

								}
								else {
									projectsplitData = projectname
								}
								var projectnamedata = JSON.stringify(projectsplitData)
								var statusvalue = taskobjRecord.getText({ fieldId: 'custevent_task_status' });
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var descriptionvalue = taskobjRecord.getValue({ fieldId: 'message' });
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var taskcommentText = taskobjRecord.getValue({ fieldId: 'custevent_update_comment' });
								var parenttask = taskobjRecord.getText({ fieldId: 'custevent_tss_parent_task' })
								log.debug("taskcommentText", taskcommentText)
								var actualvalue = taskobjRecord.getValue({ fieldId: 'actualwork' });

								var createdbytext = taskobjRecord.getValue({ fieldId: 'custevent_created_by' });
								var TicketVal = taskobjRecord.getValue({ fieldId: 'custevent_ticket_no' });


								var numLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });
								log.debug("numLines", numLines)

								var tasktabledata = ''; var samplearr = [];
								var resourcesublistFieldValue; var resourceFieldValue
								landingPageContent = landingPageContent.replace('managernamevalue', JSON.stringify(managervalue));
								landingPageContent = landingPageContent.replace('projectnamevalue', projectnamedata);
								landingPageContent = landingPageContent.replace('statusdata', JSON.stringify(statusvalue));
								landingPageContent = landingPageContent.replace('descriptiondata', descriptionvalue);
								landingPageContent = landingPageContent.replace('effortvalue', Math.round(plannedworkvalue));
								landingPageContent = landingPageContent.replace('parenttaskvalue', JSON.stringify(parenttask));
								landingPageContent = landingPageContent.replace('loggedeffortvalue', JSON.stringify(actualvalue));
								landingPageContent = landingPageContent.replace('createdbydata', JSON.stringify(createdbytext));
								landingPageContent = landingPageContent.replace('ticketdata', TicketVal);

								for (var i = 0; i < numLines; i++) {
									resourceFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									log.debug("resourceFieldValue", resourceFieldValue);
									samplearr.push(resourceFieldValue);

									log.debug("samplearr", samplearr);
									resourcesublistFieldValue = taskobjRecord.getSublistText({ sublistId: 'assignee', fieldId: 'resource', line: i });
									var s = resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1);
									log.debug("s", s);
									resourcetaskArr.push(resourcesublistFieldValue);
									var calculatedworksublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'calculatedwork', line: i });
									var calculatedworkfixed = calculatedworksublistFieldValue.toFixed(2);
									calculatedworkArr.push(calculatedworkfixed);
									var unitcostsublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									unitcostArr.push(unitcostsublistFieldValue);
								}
								var projecttaskSearchObj = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "T"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});
								var resultIndex = 0;
								var resultSet = '';
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									log.debug("resultSet", resultSet.length);
									var actualworkvalue; var actualArr = []
									var actualJson = {}; var empvalue;
									for (var i = 0; i < resultSet.length; i++) {

										actualworkvalue = resultSet[i].getValue({ name: "durationdecimal", summary: "SUM" })
										empvalue = resultSet[i].getValue({ name: "employee", summary: "GROUP" })
										log.debug("empvalue", empvalue)

										if ((actualworkvalue == "") || (actualworkvalue == undefined) || (actualworkvalue == null)) {
											actualworkvalue = "0"
										}
										actualJson[empvalue] = actualworkvalue
										actualArr.push(actualworkvalue);

									}

									log.debug("resultSet", resultSet)
									resultIndex += 1000;
								} while (resultSet.length >= 1000);





								var Nonbillablesearch = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "F"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});
								var resultIndex1 = 0;
								var resultSet1 = '';
								do {
									resultSet1 = Nonbillablesearch.run().getRange({
										start: resultIndex1,
										end: resultIndex1 + 1000
									});
									log.debug("resultSet", resultSet1.length);
									var actualnonbillworkvalue; var actualnonbillArr = []
									var actualnonbillJson = {}; var empnamevalue;
									for (var m = 0; m < resultSet1.length; m++) {
										actualnonbillworkvalue = resultSet1[m].getValue({ name: "durationdecimal", summary: "SUM" })
										empnamevalue = resultSet1[m].getValue({ name: "employee", summary: "GROUP" })

										if ((actualnonbillworkvalue == "") || (actualnonbillworkvalue == undefined) || (actualnonbillworkvalue == null)) {
											actualnonbillworkvalue = "0"
										}
										actualnonbillJson[empnamevalue] = actualnonbillworkvalue
										actualnonbillArr.push(actualnonbillworkvalue);

									}

									log.debug("resultSet", resultSet1)
									resultIndex1 += 1000;
								} while (resultSet1.length >= 1000);






								//resourcesublistFieldValue = taskobjRecord.getSublistText({sublistId: 'assignee',fieldId: 'resource',line: i});
								//	resourcesublistFieldValue.substring(0, resourcesublistFieldValue.indexOf(' ')); 
								//	var s=resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1); 
								//	log.debug("s",s)
								//resourcetaskArr.push(s);



								if (numLines == 0) {
									log.debug("entered");

									landingPageContent = landingPageContent.replace('tableData', '');
								}

								var arrayOfFilters = [];


								var projecttaskSearchObj = search.create({
									type: "projecttask",
									filters:
										[
										 ["job.internalid","anyof",projectid],"AND",["job.isinactive","is","F"],"AND",
										 ["internalid","anyof",taskiddetails],
										 "AND", 
										 ["custrecord_comments_task.custrecord_comments_html_details","isnotempty",""]											      
										 ],
										 columns:
											 [
											  search.createColumn({ name: "custrecord_comments_date", join: "CUSTRECORD_COMMENTS_TASK", label: "Date" }),
											  search.createColumn({ name: "custrecord_comments_user", join: "CUSTRECORD_COMMENTS_TASK", label: "Commented By" }),
											  search.createColumn({ name: "custrecord_comments_html_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details " }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "internalid", join: "CUSTRECORD_COMMENTS_TASK", label: "Internal ID" }),
											  search.createColumn({ name: "custrecord_comments_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details" })




											  ]
								});
								var CommentArr=[];
								var resultIndex = 0;
								var resultSet='';
								var CommentDate;
								var CommentDetails;
								var CommentName;
								var CommentSkyDocResponse;
								var Commentdetails;
								var MapRecordId;
								var skydocid;
								var skydocKeyArr=[];
								var skydocfilenameArr=[];
								var skydocJson={};
								var escapedInput;
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									for (var i = 0; i < resultSet.length; i++) {
										CommentDate=	resultSet[i].getValue({name:'custrecord_comments_date',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentName=resultSet[i].getValue({name:'custrecord_comments_user',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentDetails=	resultSet[i].getValue({name:'custrecord_comments_html_details',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentSkyDocResponse=	resultSet[i].getValue({name:'custrecord_comments_skydoc_api_response',join:'CUSTRECORD_COMMENTS_TASK'})
										MapRecordId=	resultSet[i].getValue({name:'internalid',join:'CUSTRECORD_COMMENTS_TASK'})
										Commentdetails = resultSet[i].getValue({name:'custrecord_comments_details',join:'CUSTRECORD_COMMENTS_TASK'})
										var htmlcontent=containsHTML(Commentdetails)
										if(htmlcontent)
										{
											escapedInput = escapeHtmlEntities(Commentdetails);

											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":escapedInput, "MapRecordId" : MapRecordId}

										}
										else
										{
											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":"","MapRecordId" : MapRecordId}

										}


										
									   
										var MapRecordString = "customrecord_project_management_comments" + MapRecordId;

										if(MapRecordId>0){
											arrayOfFilters.push( ["custrecord_tss_aws_s3_ns_record", "is", MapRecordString] )
								
											if(resultSet.length-1 != i){
												arrayOfFilters.push("OR")
											}
										}
										
										//}
										CommentArr.push(JSONComment)
									}
									resultIndex += 1000;
								} while (resultSet.length >= 1000);

								if(arrayOfFilters.length>0){
								var customrecord_tss_aws_s3_ns_file_recordSearchObj = search.create({
								   type: "customrecord_tss_aws_s3_ns_file_record",
								   filters:
									   [
										   arrayOfFilters												 ],
										columns:
											[
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_file_name", label: "File Name"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_key", label: "Key"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_filetype", label: "File Type"}),
											 search.createColumn({
											   name: "custrecord_tss_aws_s3_ns_record",
											   label: "Merchant Id"
										   })

											 ]
							   });

							   var resultIndex2 = 0;
							   var resultSet1 = '';
							   do {
								   resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({
									   start: resultIndex2,
									   end: resultIndex2 + 1000
								   });
							  //  var resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({start: 0,end: 1000});


							   log.debug('resultSet',resultSet1.length)

							   for (var j = 0; j < resultSet1.length; j++) {
								   var merchantId     = resultSet1[j].getValue({
									   name: 'custrecord_tss_aws_s3_ns_record'
								   });
								   log.debug("merchantId",merchantId)
								   var SkyDocFileName=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_file_name'});
								   var SkyDocKey=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_key'});
								   var SkyDocType=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_filetype'});
								   skydocKeyArr.push(SkyDocKey)
								   skydocfilenameArr.push(SkyDocFileName)
								   log.debug("SkyDocKey",SkyDocKey)

								   log.debug("skydocfilenameArr",skydocfilenameArr)
								   // JSONComment.uploadedFiles.push({ "filename": SkyDocFileName, "key": SkyDocKey });
								   
								   var index = CommentArr.map(function(element, index){
									   if (merchantId.indexOf(element.MapRecordId) != -1) {
										 return index;
									   }
									 });

								   var filterdValue = index.filter(function(element){
									   return element !== null && element !== undefined;
									 });
								   
									 index = filterdValue[0]
				   
									 CommentArr[index]["uploadedFiles"].push({
									   "filename": SkyDocFileName,
									   "key": SkyDocKey
								   });
							   }
							  
							  resultIndex2 += 1000;
						  } while (resultSet1.length >= 1000);
					   }




								log.debug("JSONComment", JSONComment)

								log.debug("CommentArr", CommentArr)
								var CompareArr = new Array;
								if (CommentArr) {
									var commentHtmlCode = '';

									var commentArray = CommentArr;
									for (var r = 0; r < commentArray.length; r++) {
										log.debug("commentArray[r]", commentArray[r])
										var uploadedlength = commentArray[r].uploadedFiles
										if (uploadedlength.length > 0) {
											var MultiplefilesArr = [];


											log.debug("commentArray[r] uploaded file", commentArray[r].uploadedFiles)
											var UploadedFileDetails = commentArray[r].uploadedFiles
											for (var h = 0; h < UploadedFileDetails.length; h++) {

												log.debug("length of files", UploadedFileDetails.length)
												log.debug("UploadedFileDetails[h].filename", UploadedFileDetails[h].filename)
												log.debug("UploadedFileDetails[h].key", UploadedFileDetails[h].key)
												var output = url.resolveScript({ scriptId: 'customscript_tss_skydoc_downloadfile', deploymentId: 'customdeploy_tss_skydoc_downloadfile', returnExternalUrl: true });


												output = output + '&FileName=' + UploadedFileDetails[h].filename + '&Key=' + UploadedFileDetails[h].key;
												log.debug('output', output)
												var headerObj = { 'Content-Type': 'application/json' };
												var sResponse = https.get({ url: output, headers: headerObj });
												log.debug("sResponse", sResponse)
												var Multiplefilesdata = '<a href="' + output + '" target="_blank"  >' + UploadedFileDetails[h].filename + '</a><br>'
												MultiplefilesArr.push(Multiplefilesdata)
												log.debug("MultiplefilesArr", MultiplefilesArr)


											}
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td>' + MultiplefilesArr + '</a></td><td>' + commentArray[r].details + '</td></tr>'

										}

										else {
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td></td><td>' + commentArray[r].details + '</td></tr>'

										}

									}


									landingPageContent = landingPageContent.replace('tableData1', commentHtmlCode);

								} else {
									var commentArray = [];
									landingPageContent = landingPageContent.replace('tableData1', '');

								}

								landingPageContent = landingPageContent.replace('resourceoptions', resourcetaskArr);



								var keys = Object.keys(actualJson);
								var nonkeys = Object.keys(actualnonbillJson);

								for (var j = 0; j < resourcetaskArr.length; j++) {
									if (keys.indexOf(samplearr[j]) != -1) {
										var actualwork = actualJson[samplearr[j]]

									}
									else {
										var actualwork = 0;
									}
									if (nonkeys.indexOf(samplearr[j]) != -1) {
										var actualnonbillwork = actualnonbillJson[samplearr[j]]

									}

									else {
										var actualnonbillwork = 0;
									}
									tasktabledata += '<tr><td> ' + resourcetaskArr[j] + '</td><td>' + actualwork + '</td><td>' + actualnonbillwork + '</td></tr>'
								}
								log.debug("tasktabledata", tasktabledata)



								landingPageContent = landingPageContent.replace('tableData', tasktabledata);


								if (context.request.method == 'POST') {
									log.debug("context.request.parameters", context.request.parameters)
								}
								landingPageContent = landingPageContent.replace('tableData1', '');


							} catch (Error) {
								log.error('Error occured in UI Builder', Error);
								landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>' + Error.message + 'Please try again.</font></b>');
								context.response.write(landingPageContent);
							}
						}
						if (selectedAction == 'detailsofupdatepage') {

							try {
								/*var landingPageContent = file.load({
								  id: 59089
							  }).getContents().toString();*/

								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(edittaskHtmlfile)] }).getContents().toString();
								var taskiddetails;
								log.debug("context.request.paramters", context.request.parameters)
								taskiddetails = context.request.parameters.taskid
								landingPageContent = landingPageContent.replace('hiddentaskid', taskiddetails);
								var taskIDDD = context.request.parameters.taskdataid;
								if ((taskiddetails == '') || (taskiddetails == null) || (taskiddetails == undefined)) {
									taskiddetails = context.request.parameters.taskdataid;
								}
								var resourcetaskArr = [];
								var calculatedworkArr = [];
								var unitcostArr = [];
								var statusoption = '';
								var projectnamedata;
								var taskobjRecord = record.load({ type: record.Type.PROJECT_TASK, id: taskiddetails, isDynamic: true, });
								var startEndProject = "";
								startEndProject = taskobjRecord.getValue({ fieldId: 'company' }) + "++";
								startEndProject = startEndProject + taskobjRecord.getText({ fieldId: 'startdate' }) + "++";
								startEndProject = startEndProject + taskobjRecord.getText({ fieldId: 'enddate' });
								//company
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var taskid = taskobjRecord.getValue({ fieldId: 'title' });

								var plannedWork = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var actualWork = taskobjRecord.getValue({ fieldId: 'actualwork' });

								var tasknamedata = JSON.stringify(taskname)
								var projectname = taskobjRecord.getText({ fieldId: 'company' });
								var projectInternalId = taskobjRecord.getValue({ fieldId: 'company' });
								var projectnamedata = '';
								var projectname = taskobjRecord.getText({ fieldId: 'company' });
								if (projectname.indexOf(":") > 0) {
									var splitprojectname = projectname.split(":")
									projectnamedata = splitprojectname[1]

								}
								else {
									projectnamedata = projectname
								}
								var TicketVal = taskobjRecord.getValue({ fieldId: 'custevent_ticket_no' });

								var statusvalue = taskobjRecord.getText({ fieldId: 'custevent_task_status' });
								var statusvalueid = taskobjRecord.getValue({ fieldId: 'custevent_task_status' });
								log.debug("statusvalueid", statusvalueid)
								var descriptionvalue = taskobjRecord.getValue({ fieldId: 'message' });
								var parenttaskText = taskobjRecord.getText({ fieldId: 'custevent_tss_parent_task' });
								var parenttaskvalue = taskobjRecord.getValue({ fieldId: 'custevent_tss_parent_task' });
								var taskname = taskobjRecord.getText({ fieldId: 'title' });
								var tasknamedata = JSON.stringify(taskname)
								var createdbytext = taskobjRecord.getValue({ fieldId: 'custevent_created_by' });
								var plannedworkvalue = taskobjRecord.getValue({ fieldId: 'plannedwork' });
								var numLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });
								var taskDescriptionText = taskobjRecord.getValue({ fieldId: 'message' });
								var taskcommentText = taskobjRecord.getValue({ fieldId: 'custevent_update_comment' });
								log.debug("taskcommentText", taskcommentText)
								var priorityVal = taskobjRecord.getValue({fieldId: 'custevent_tss_task_priority'});
										 log.debug("priorityVal",priorityVal)
                                        var prioritytext = taskobjRecord.getText({fieldId: 'custevent_tss_task_priority'});
										 log.debug("prioritytext",prioritytext)
										 var TicketVal = taskobjRecord.getValue({ fieldId: 'custevent_ticket_no' });

								var tasktabledata = ''; var samplearr = [];
								var resourcesublistFieldValue; var resourceFieldValue
								var resourcInternaletaskArr = [];
								var resourcInternaletaskArrtemp = [];
								landingPageContent = landingPageContent.replace('tasknamevalue', tasknamedata);
								landingPageContent = landingPageContent.replace('task_description', taskDescriptionText);
								landingPageContent = landingPageContent.replace('projectnamevalue', JSON.stringify(projectnamedata));
								landingPageContent = landingPageContent.replace('task_description', descriptionvalue);
								landingPageContent = landingPageContent.replace('actualValue', actualWork);
								landingPageContent = landingPageContent.replace('tasknamevalue', tasknamedata);
								landingPageContent = landingPageContent.replace('createdbydata', JSON.stringify(createdbytext));
								landingPageContent = landingPageContent.replace('ticketdata', TicketVal);
								landingPageContent = landingPageContent.replace('ticketdata', TicketVal);

								for (var i = 0; i < numLines; i++) {
									resourceFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									log.debug("resourceFieldValue", resourceFieldValue);
									samplearr.push(resourceFieldValue);

									log.debug("samplearr", samplearr);
									resourcesublistFieldValue = taskobjRecord.getSublistText({ sublistId: 'assignee', fieldId: 'resource', line: i });

									resourcesublistFieldValue.substring(0, resourcesublistFieldValue.indexOf(' '));
									var s = resourcesublistFieldValue.substring(resourcesublistFieldValue.indexOf(' ') + 1);
									log.debug("s", resourcesublistFieldValue)

									var resourceInternalId = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i });
									var assigneeUnitCost = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									resourcetaskArr.push(resourcesublistFieldValue);
									resourcInternaletaskArr.push(resourceInternalId);
									resourcInternaletaskArrtemp.push(resourceInternalId);
									var calculatedworksublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'calculatedwork', line: i });
									calculatedworkArr.push(calculatedworksublistFieldValue);
									var unitcostsublistFieldValue = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'unitcost', line: i });
									unitcostArr.push(unitcostsublistFieldValue);
								}
								var projecttaskSearchObj = search.create({
									type: "timebill",
									filters:
										[

											["type", "anyof", "A"],
											"AND",
											["employee", "anyof", samplearr],
											"AND",
											["billable", "is", "T"],

											"AND",
											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});




								var resultIndex = 0;
								var resultSet = '';
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									log.debug("resultSet", resultSet.length);
									var actualworkvalue; var actualArr = []
									var actualJson = {}; var empvalue;
									for (var i = 0; i < resultSet.length; i++) {

										actualworkvalue = resultSet[i].getValue({ name: "durationdecimal", summary: "SUM" })
										empvalue = resultSet[i].getValue({ name: "employee", summary: "GROUP" })
										log.debug("empvalue", empvalue)

										if ((actualworkvalue == "") || (actualworkvalue == undefined) || (actualworkvalue == null)) {
											actualworkvalue = "0"
										}
										actualJson[empvalue] = actualworkvalue
										actualArr.push(actualworkvalue);

									}

									log.debug("resultSet", resultSet)
									log.debug("actualJson", actualJson)
									resultIndex += 1000;
								} while (resultSet.length >= 1000);



								var Nonbillablesearch = search.create({
									type: "timebill",
									filters:
										[
											["employee", "anyof", samplearr], "AND",
											["type", "anyof", "A"],
											"AND",
											["billable", "is", "F"],
											"AND",

											["projecttask.internalid", "is", taskiddetails]
										],
									columns:
										[
											search.createColumn({ name: "employee", summary: "GROUP", label: "Employee" }),
											search.createColumn({ name: "durationdecimal", summary: "SUM", label: "Duration (Decimal)" }),
										]
								});



								var resultIndex1 = 0;
								var resultSet1 = '';
								do {
									resultSet1 = Nonbillablesearch.run().getRange({
										start: resultIndex1,
										end: resultIndex1 + 1000
									});
									log.debug("resultSet", resultSet1.length);
									var actualnonbillworkvalue; var actualnonbillArr = []
									var actualnonbillJson = {}; var empnamevalue;
									for (var m = 0; m < resultSet1.length; m++) {
										actualnonbillworkvalue = resultSet1[m].getValue({ name: "durationdecimal", summary: "SUM" })
										empnamevalue = resultSet1[m].getValue({ name: "employee", summary: "GROUP" })

										if ((actualnonbillworkvalue == "") || (actualnonbillworkvalue == undefined) || (actualnonbillworkvalue == null)) {
											actualnonbillworkvalue = "0"
										}
										actualnonbillJson[empnamevalue] = actualnonbillworkvalue
										actualnonbillArr.push(actualnonbillworkvalue);

									}

									log.debug("resultSet", resultSet1)
									resultIndex1 += 1000;
								} while (resultSet1.length >= 1000);





								if (numLines == 0) {
									log.debug("entered");

									landingPageContent = landingPageContent.replace('tableData', '');
								}

								var arrayOfFilters = [];


								var projecttaskSearchObj = search.create({
									type: "projecttask",
									filters:
										[
										 ["job.internalid","anyof",projectInternalId],"AND",["job.isinactive","is","F"],"AND",
										 ["internalid","anyof",taskiddetails],
										 "AND", 
										 ["custrecord_comments_task.custrecord_comments_html_details","isnotempty",""]											      
										 ],
										 columns:
											 [
											  search.createColumn({ name: "custrecord_comments_date", join: "CUSTRECORD_COMMENTS_TASK", label: "Date" }),
											  search.createColumn({ name: "custrecord_comments_user", join: "CUSTRECORD_COMMENTS_TASK", label: "Commented By" }),
											  search.createColumn({ name: "custrecord_comments_html_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details " }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "custrecord_comments_skydoc_api_response", join: "CUSTRECORD_COMMENTS_TASK", label: "Skydoc API Response" }),
											  search.createColumn({ name: "internalid", join: "CUSTRECORD_COMMENTS_TASK", label: "Internal ID" }),
											  search.createColumn({ name: "custrecord_comments_details", join: "CUSTRECORD_COMMENTS_TASK", label: "Details" })




											  ]
								});
								var CommentArr=[];
								var resultIndex = 0;
								var resultSet='';
								var CommentDate;
								var CommentDetails;
								var CommentName;
								var CommentSkyDocResponse;
								var Commentdetails;
								var MapRecordId;
								var skydocid;
								var skydocKeyArr=[];
								var skydocfilenameArr=[];
								var skydocJson={};
								var escapedInput;
								do {
									resultSet = projecttaskSearchObj.run().getRange({
										start: resultIndex,
										end: resultIndex + 1000
									});
									for (var i = 0; i < resultSet.length; i++) {
										CommentDate=	resultSet[i].getValue({name:'custrecord_comments_date',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentName=resultSet[i].getValue({name:'custrecord_comments_user',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentDetails=	resultSet[i].getValue({name:'custrecord_comments_html_details',join:'CUSTRECORD_COMMENTS_TASK'})
										CommentSkyDocResponse=	resultSet[i].getValue({name:'custrecord_comments_skydoc_api_response',join:'CUSTRECORD_COMMENTS_TASK'})
										MapRecordId=	resultSet[i].getValue({name:'internalid',join:'CUSTRECORD_COMMENTS_TASK'})
										Commentdetails = resultSet[i].getValue({name:'custrecord_comments_details',join:'CUSTRECORD_COMMENTS_TASK'})
										var htmlcontent=containsHTML(Commentdetails)
										if(htmlcontent)
										{
											escapedInput = escapeHtmlEntities(Commentdetails);

											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":escapedInput, "MapRecordId" : MapRecordId}

										}
										else
										{
											var JSONComment= {"date":CommentDate,"message":CommentDetails,"name":CommentName,"uploadedFiles":[],"details":"","MapRecordId" : MapRecordId}

										}


										
									   
										var MapRecordString = "customrecord_project_management_comments" + MapRecordId;

										if(MapRecordId>0){
											arrayOfFilters.push( ["custrecord_tss_aws_s3_ns_record", "is", MapRecordString] )
								
											if(resultSet.length-1 != i){
												arrayOfFilters.push("OR")
											}
										}
										
										//}
										CommentArr.push(JSONComment)
									}
									resultIndex += 1000;
								} while (resultSet.length >= 1000);

								if(arrayOfFilters.length>0){
								var customrecord_tss_aws_s3_ns_file_recordSearchObj = search.create({
								   type: "customrecord_tss_aws_s3_ns_file_record",
								   filters:
									   [
										   arrayOfFilters												 ],
										columns:
											[
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_file_name", label: "File Name"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_key", label: "Key"}),
											 search.createColumn({name: "custrecord_tss_aws_s3_ns_filetype", label: "File Type"}),
											 search.createColumn({
											   name: "custrecord_tss_aws_s3_ns_record",
											   label: "Merchant Id"
										   })

											 ]
							   });

							   var resultIndex2 = 0;
							   var resultSet1 = '';
							   do {
								   resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({
									   start: resultIndex2,
									   end: resultIndex2 + 1000
								   });
							  //  var resultSet1 = customrecord_tss_aws_s3_ns_file_recordSearchObj.run().getRange({start: 0,end: 1000});


							   log.debug('resultSet',resultSet1.length)

							   for (var j = 0; j < resultSet1.length; j++) {
								   var merchantId     = resultSet1[j].getValue({
									   name: 'custrecord_tss_aws_s3_ns_record'
								   });
								   log.debug("merchantId",merchantId)
								   var SkyDocFileName=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_file_name'});
								   var SkyDocKey=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_key'});
								   var SkyDocType=	resultSet1[j].getValue({name:'custrecord_tss_aws_s3_ns_filetype'});
								   skydocKeyArr.push(SkyDocKey)
								   skydocfilenameArr.push(SkyDocFileName)
								   log.debug("SkyDocKey",SkyDocKey)

								   log.debug("skydocfilenameArr",skydocfilenameArr)
								   // JSONComment.uploadedFiles.push({ "filename": SkyDocFileName, "key": SkyDocKey });
								   
								   var index = CommentArr.map(function(element, index){
									   if (merchantId.indexOf(element.MapRecordId) != -1) {
										 return index;
									   }
									 });

								   var filterdValue = index.filter(function(element){
									   return element !== null && element !== undefined;
									 });
								   
									 index = filterdValue[0]
				   
									 CommentArr[index]["uploadedFiles"].push({
									   "filename": SkyDocFileName,
									   "key": SkyDocKey
								   });
							   }
							  
							  resultIndex2 += 1000;
						  } while (resultSet1.length >= 1000);
					   }



								log.debug("JSONComment", JSONComment)

								log.debug("CommentArr", CommentArr)
								var CompareArr = new Array;
								if (CommentArr) {
									var commentHtmlCode = '';

									var commentArray = CommentArr;
									for (var r = 0; r < commentArray.length; r++) {
										log.debug("commentArray[r]", commentArray[r])
										var uploadedlength = commentArray[r].uploadedFiles
										if (uploadedlength.length > 0) {
											var MultiplefilesArr = [];


											log.debug("commentArray[r] uploaded file", commentArray[r].uploadedFiles)
											var UploadedFileDetails = commentArray[r].uploadedFiles
											for (var h = 0; h < UploadedFileDetails.length; h++) {

												log.debug("length of files", UploadedFileDetails.length)
												log.debug("UploadedFileDetails[h].filename", UploadedFileDetails[h].filename)
												log.debug("UploadedFileDetails[h].key", UploadedFileDetails[h].key)
												var output = url.resolveScript({ scriptId: 'customscript_tss_skydoc_downloadfile', deploymentId: 'customdeploy_tss_skydoc_downloadfile', returnExternalUrl: true });


												output = output + '&FileName=' + UploadedFileDetails[h].filename + '&Key=' + UploadedFileDetails[h].key;
												log.debug('output', output)
												var headerObj = { 'Content-Type': 'application/json' };
												var sResponse = https.get({ url: output, headers: headerObj });
												log.debug("sResponse", sResponse)
												var Multiplefilesdata = '<a href="' + output + '" target="_blank"  >' + UploadedFileDetails[h].filename + '</a><br>'
												MultiplefilesArr.push(Multiplefilesdata)
												log.debug("MultiplefilesArr", MultiplefilesArr)


											}
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td>' + MultiplefilesArr + '</a></td><td>' + commentArray[r].details + '</td></tr>'

										}

										else {
											commentHtmlCode += '<tr><td>' + commentArray[r].date + '</td><td>' + commentArray[r].name + '</td><td>' + commentArray[r].message + '</td><td></td><td>' + commentArray[r].details + '</td></tr>'

										}

									}


									landingPageContent = landingPageContent.replace('tableData1', commentHtmlCode);

								} else {
									var commentArray = [];
									landingPageContent = landingPageContent.replace('tableData1', '');

								}


								log.debug("parenttaskText", parenttaskText)
								if (parenttaskText) {
									landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent" checked="checked"><label for="parentid">Is Child</label>');
								} if ((parenttaskText == null) || (parenttaskText == undefined) || (parenttaskText == '')) {
									landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent" ><label for="parentid">Is Child</label>');
								}
								landingPageContent = landingPageContent.replace('estimateValue', Math.round(plannedWork));


								var resourceDataCode = showUpdateProjectPage(projectInternalId, "resourceid", "employee", "entityid", resourcInternaletaskArr);


								//landingPageContent = landingPageContent.replace('resourceData',resourceDataCode);
								var htmlCode = ''
								var jobSearchObj = search.create({
									type: "job",
									filters:
										[
											["internalid", "anyof", projectInternalId],"AND",["isinactive","is","F"]

										],
									columns:
										[
											search.createColumn({ name: "jobresource", label: "Project Resource" }),
											search.createColumn({ name: "internalid", join: "projectResource", label: "Internal ID" })
										]
								});
								jobSearchObj.run().each(function (result) {
									htmlCode += '<option  value="' + result.getValue({ name: 'internalid', join: 'projectResource' }) + '" >' + result.getText('jobresource') + '</option>';

									return true;
								});
								landingPageContent = landingPageContent.replace('resourceData1', htmlCode);

								var htmlCode1 = ''
								var jobSearchObj = search.create({
									type: "job",
									filters:
										[
											["internalid", "anyof", projectInternalId],"AND",["isinactive","is","F"]

										],
									columns:
										[
											search.createColumn({ name: "jobresource", label: "Project Resource" }),
											search.createColumn({ name: "internalid", join: "projectResource", label: "Internal ID" })
										]
								});
								jobSearchObj.run().each(function (result) {
									htmlCode1 += '<option  value="' + result.getValue({ name: 'internalid', join: 'projectResource' }) + '" >' + result.getText('jobresource') + '</option>';

									return true;
								});

								landingPageContent = landingPageContent.replace('resourceData2', htmlCode1);

								statusoption += '<option value="' + statusvalueid + '" selected>' + statusvalue + '</option>';
								if (statusvalue == "In Progress") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Not Started") {
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Completed") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="4">Close</option>';


								} else if (statusvalue == "Closed") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';


								} else if (statusvalue == "Re-Opened") {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Closed</option>';


								} else {
									statusoption += '<option value="2">Not Started</option>';
									statusoption += '<option value="1">In Progress</option>';
									statusoption += '<option value="3">Completed</option>';
									statusoption += '<option value="4">Close</option>';
									statusoption += '<option value="5">Re Opened</option>';

									statusoption += '<option value="" disabled selected>Select Status</option>';


								}
								var priorityoption='';

										 priorityoption += '<option value="'+priorityVal+'" selected>'+prioritytext+'</option>';
										 if(priorityVal=="1"){
											priorityoption+='<option value="2">Medium</option>';
											priorityoption+='<option value="3">Low</option>';
										 }else if(priorityVal=="2"){
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="3">Low</option>';
										 }else if(priorityVal=="3"){
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="2">Medium</option>';

										 }else
										 {
											priorityoption+='<option value="1">High</option>';
											priorityoption+='<option value="2">Medium</option>';
											priorityoption+='<option value="3">Low</option>';
											 
										 }

								var alltaskdata = ''
								var searchObj = search.create({
									type: 'projecttask',
									filters: [['project', 'is', projectInternalId]],
									columns:
										[search.createColumn({ name: "title", sort: search.Sort.ASC }),
										search.createColumn({ name: "internalid" })
										]
								});

								var tasksearchobj = searchObj.run().getRange({ start: 0, end: 1000 });

								if (tasksearchobj.length > 0) {
									alltaskdata += '<select      name="parentupdateid" id="parentupdateid" >';
									var flag = false;
									for (var i = 0; i < tasksearchobj.length; i++) {
										if (tasksearchobj[i].getValue('title') === taskname) {
											continue;
										}

										if (tasksearchobj[i].getValue('internalid') == parenttaskvalue) {
											flag = true;
											alltaskdata += '<option value="' + tasksearchobj[i].getValue('internalid') + '" selected>' + tasksearchobj[i].getValue('title') + '</option>';
										}
										else {

											alltaskdata += '<option  value="' + tasksearchobj[i].getValue('internalid') + '" >' + tasksearchobj[i].getValue('title') + '</option>';

										}
									}
									if (!flag) {
										alltaskdata += '<option value="" disabled selected>Select Parent Task</option>';
									}

									alltaskdata += '</select>'
								}

								landingPageContent = landingPageContent.replace('parenttask', alltaskdata);
								landingPageContent = landingPageContent.replace('statusdata', statusoption);
								landingPageContent = landingPageContent.replace('prioritydata',priorityoption);


								if (resourcetaskArr) {
									landingPageContent = landingPageContent.replace('resourceoptions', resourcetaskArr);
									var billkeys = Object.keys(actualJson);
									var nonkeys = Object.keys(actualnonbillJson);
									for (var j = 0; j < resourcetaskArr.length; j++) {
										if (billkeys.indexOf(samplearr[j]) != -1) {
											var actualwork = actualJson[samplearr[j]]

										} else {
											var actualwork = 0;
										}
										if (nonkeys.indexOf(samplearr[j]) != -1) {
											var actualnonbillwork = actualnonbillJson[samplearr[j]]

										}

										else {
											//										var actualwork=0;
											var actualnonbillwork = 0;
										}
										tasktabledata += '<tr><td> ' + resourcetaskArr[j] + '</td><td>' + actualwork + '</td><td>' + actualnonbillwork + '</td></tr>'
									}
									log.debug("tasktabledata", tasktabledata)

									//	landingPageContent = landingPageContent.replace('@parenttask$^', '<input width: 40px; height: 40px type="checkbox" id="parentid" name="parent"><label for="parentid">Is Child</label>');

									landingPageContent = landingPageContent.replace('tableData', tasktabledata);
								}
								else {
									landingPageContent = landingPageContent.replace('resourceoptions', '');

								}

								landingPageContent = landingPageContent.replace('$#email%*', '<input width: 40px; height: 40px type="checkbox" id="emailboxid" name="emailboxid" ><label for="emailboxid">Send Email</label>');



								if (context.request.method == 'POST') {

									var taskComment = context.request.parameters.comment;

									var postData = context.request.parameters.Data;
									log.debug("postData", postData)
									var postData = JSON.parse(postData);
									var task_id = context.request.parameters.taskdataid;
									var AssigneeLines = taskobjRecord.getLineCount({ sublistId: 'assignee' });

									var AssigneeArray = []
									for (var i11 = 0; i11 < AssigneeLines; i11++) {
										var assigneeId = taskobjRecord.getSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: i11 });
										AssigneeArray.push(assigneeId);
									}
									log.debug("AssigneeArray", AssigneeArray);
									var taskName1 = taskobjRecord.getText({ fieldId: "title" });
									log.debug("taskName1", taskName1)
									var projectName1 = taskobjRecord.getText({ fieldId: "company" });
									var startVal = projectName1.indexOf(":");
									var strlength = projectName1.length;
									projectName1 = projectName1.substring(startVal + 1, strlength);
									log.debug("projectName1", projectName1)
									var taskStartDate = taskobjRecord.getText({ fieldId: "startdate" });
									var taskEndDate = taskobjRecord.getText({ fieldId: "enddate" });
									log.debug("taskStartDate")
									if (postData.actionId == 'save') {
										log.debug("context.request.parameters", context.request.parameters);
										var projecttaskvalue = context.request.parameters.projectname;
										var multiresource = context.request.parameters.multiresourceData;
										var updatedResourceData = JSON.parse(multiresource)
										var tasknamevalue = context.request.parameters.taskname;
										var statuslistvalue = context.request.parameters.statuslist;
										log.debug("statuslistvalue", statuslistvalue)
										var estimateValue = context.request.parameters.estimate;
										var taskDescription1 = context.request.parameters.description;

										var ischildvalue = context.request.parameters.parent;
										log.debug("ischildvalue", ischildvalue)
										var parentupdatevalue = context.request.parameters.parentupdateid;

										var sendEmailBox = context.request.parameters.myCheckbox;
										var resouceto = context.request.parameters.resourcetoid;

										var CommentVal = context.request.parameters.comment;
										var prioritylistvalue=context.request.parameters.prioritylist;

										var FileVal = context.request.parameters.fileinput;
										log.debug("FileVal", FileVal)
										var splitfile = FileVal.split(".");
										var filename = splitfile[0];
										var filetype = splitfile[1];
										log.debug("filetype", filetype)

										var FileDetailsVal = context.request.parameters.filedetails;
										var filevalue;
										if (FileDetailsVal) {
											var jsondetails = JSON.parse(FileDetailsVal);
											log.debug("jsondetails", jsondetails)
											filevalue = jsondetails['file'];

											var filecontents;
											var emailattachement;

											if(filetype=='txt')
												 {
													 filetype=file.Type.PLAINTEXT
log.debug("filevalue",filevalue)
var base64Data = filevalue.replace(/^data:text\/plain;base64,/, '');

													 //var decodedContent = atob(filevalue.split(',')[1]);
													 var decodedContent1 = encode.convert({
														string: base64Data,
														 inputEncoding: encode.Encoding.BASE_64,
														 outputEncoding: encode.Encoding.UTF_8
													});

													log.debug("decodedContent1",decodedContent1)


													 filecontents=decodedContent1
													 
													  emailattachement = file.create({
														 name: filename+'.'+filetype,
														 fileType: file.Type.PLAINTEXT,
														 contents: decodedContent1,
														
													 });
												 }
											else if (filetype === 'xlsx') {
												filetype = file.Type.EXCEL
												log.debug("filevalue", filevalue)
												var base64Data = filevalue.replace(/^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.EXCEL,
													contents: base64Data,
												   
												});

											}
											
											else if (filetype === 'png') {
												filetype = file.Type.PNGIMAGE

												var base64Data = filevalue.replace(/^data:image\/png;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PNGIMAGE,
													contents: base64Data,
												   
												});

											}
											else if (filetype === 'csv'){
												filetype=file.Type.PLAINTEXT
												log.debug("filevalue",filevalue)

												/*var decodedContent1 = encode.convert({
														 string: base64Data,
														 inputEncoding: encode.Encoding.UTF_8,
														 outputEncoding: encode.Encoding.BASE_64
													   });*/


												var base64Data = filevalue.replace(/^data:text\/csv;base64,/, '');
												/*	var decodedContent1 = encode.convert({
														 string: base64Data,
														 inputEncoding: encode.Encoding.UTF_8,
														 outputEncoding: encode.Encoding.BASE_64
													   });*/


												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString()); 
												filecontents=base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PLAINTEXT,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'jpg') {
												filetype = file.Type.JPGIMAGE
												var base64Data = filevalue.replace(/^data:image\/jpeg;base64,/, '');

												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.JPGIMAGE,
													contents: base64Data,
												   
												});

											}

											else if (filetype == 'docx') {
												filetype = file.Type.WORD

												var base64Data = filevalue.replace(/^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.WORD,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'doc') {
												filetype = file.Type.WORD
												log.debug("filevalue", filevalue)
												var base64Data = filevalue.replace(/^data:application\/msword;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.WORD,
													contents: base64Data,
												   
												});

											}
											else if (filetype == 'pdf') {
												filetype = file.Type.PDF
												/*var decodedContent = encode.convert({
											  string: filevalue.toString(),
											  inputEncoding: encode.Encoding.UTF_8,
											  outputEncoding: encode.Encoding.BASE_64
											});*/
												var base64Data = filevalue.replace(/^data:application\/pdf;base64,/, '');
												var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
												var isBase64 = base64regex.test(base64Data.toString());
												filecontents = base64Data
												emailattachement = file.create({
													name: filename+'.'+filetype,
													fileType: file.Type.PDF,
													contents: base64Data,
												   
												});

											}
											



										}
										log.debug("resouceto 111", updatedResourceData)
										log.debug("sendEmailBox", sendEmailBox)
										log.debug("trigg", "trigg")
										if (sendEmailBox == 'on') {
											var fileid;
											if (containsHTML(CommentVal)) {
												log.debug("entered the html content")
												var filenamedata = loggedinclientname + '' + taskiddetails
												var fileObj = file.create({
													name: filenamedata,
													fileType: file.Type.PLAINTEXT,
													contents: CommentVal,
													encoding: file.Encoding.UTF8,
													folder: 8190,
													isOnline: true
												});
												fileid = fileObj.save();
												log.debug("fileid", fileid)
												var fileObjload = file.load({
													id: fileid
												});

											} else {
												log.debug("entered text content")
											}
											var recipientsLength = updatedResourceData.length;
											log.debug("recipientsLength", recipientsLength)

											if (recipientsLength <= 10) {
												log.debug("below 10 receivers")
												var subjectdata = {}
												subjectdata['taskname'] = tasknamevalue
												subjectdata['taskid'] = taskiddetails
												log.debug("subjectdata",subjectdata)

												var html = ''
												html += '<html><body>'
												html += '<p>' + tasknamevalue + '</p>'
												html += '<p style="display:none">' + taskiddetails + '</p>'
												html += '</body></html>'


												log.debug("json stringify subjectdata", JSON.stringify(subjectdata))

												if (fileObjload) {
													if (emailattachement) {
														log.debug("emailattachement",emailattachement)

														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: updatedResourceData, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload, emailattachement] });
													}
													else {
														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: updatedResourceData, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload] });

													}

												}
												else {
													log.debug("emailattachement", emailattachement)
													if (emailattachement) {

														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [updatedResourceData], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [emailattachement] });
													}
													else {
														var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [updatedResourceData], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal });

													}
												}

											} else {
												var lenn = recipientsLength / 10;
												for (var a5 = 0; a5 < lenn; a5++) {
													var p1 = a5 * 10;
													var q1 = a5 * 10 + 10;
													var resourceArr2 = [];
													for (var a6 = p1; a6 >= p1 && a6 < q1; a6++) {
														if (a6 < updatedResourceData.length) {
															resourceArr2.push(updatedResourceData[a6])
														}

													}
													var subjectdata = {}
													subjectdata['taskname'] = tasknamevalue
													subjectdata['taskid'] = taskiddetails
													if (fileObjload) {
														if (emailattachement) {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: resourceArr2, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload, emailattachement] });
														}
														else {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: resourceArr2, subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [fileObjload] });

														}
													}
													else {
														if (emailattachement) {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [resourceArr2], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal, attachments: [emailattachement] });
														}
														else {
															var sendEmail = email.send({ author: PortalSupportEmployeeId, recipients: [resourceArr2], subject: JSON.stringify(subjectdata), replyTo: "emails.6647300.387.677b484ccd@6647300.email.netsuite.com", body: CommentVal });

														}
													}
												}
											}





											for (var i = 0; i < updatedResourceData.length; i++) {
												var ResourceEmail = search.lookupFields({ type: search.Type.EMPLOYEE, id: updatedResourceData[i], columns: ['email'] });
												log.debug('ResourceEmail', ResourceEmail)
											}

										}
										// var projectRecObject 	= record.load({type:'job',id: projectInternalId,isDynamic: true,});
										/*  var resourceLines        = projectRecObject.getLineCount({sublistId: 'jobresources'}); 
									  var projectResourceArrIdstemp = []
									  var projectResourceArrIds = []
									  for(var k1=0;k1<resourceLines;k1++){
										  var resourceInternalId = projectRecObject.getSublistValue({sublistId: 'jobresources',fieldId: 'jobresource',line:k1});
										  projectResourceArrIds.push(resourceInternalId);
										  projectResourceArrIdstemp.push(resourceInternalId);
									  }
									  var countVal = 0;
									  var newProjectRecource = []
									  var newTaskRecource = []
	
									  for(var k5=resourcInternaletaskArr.length-1;k5>=0;k5--){
										  taskobjRecord.removeLine({sublistId: 'assignee',line: k5,ignoreRecalc: true});
									  }
									  log.debug("updatedResourceData",updatedResourceData)
									  var eachPlannedWord = plannedWork/(updatedResourceData.length)
	
									  for(var k2=0;k2<updatedResourceData.length;k2++){
										  var taskIndex = resourcInternaletaskArrtemp.indexOf(updatedResourceData[k2]);
										  var projectIndex = projectResourceArrIdstemp.indexOf(updatedResourceData[k2]);
	
										  if( projectIndex < 0 ){
											  projectResourceArrIds.push(updatedResourceData[k2]);
											  projectRecObject.selectNewLine({sublistId: 'jobresources'});
											  projectRecObject.setCurrentSublistValue({sublistId: 'jobresources',fieldId: 'jobresource',value: updatedResourceData[k2]});
											  projectRecObject.commitLine({sublistId: 'jobresources'});
	
										  }
	
	
	
									  }
									  var updatedProjectId = projectRecObject.save({enableSourcing: false,ignoreMandatoryFields: true});
	
									  for(var k2=0;k2<updatedResourceData.length;k2++){
										  taskobjRecord.selectNewLine({sublistId: 'assignee'});
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'resource',value: updatedResourceData[k2]});
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'plannedwork',value: eachPlannedWord });
										  taskobjRecord.setCurrentSublistValue({sublistId: 'assignee',fieldId: 'unitcost',value: assigneeUnitCost});
										  taskobjRecord.commitLine({sublistId: 'assignee'});
									  }*/
										if (ischildvalue == "on") {
											taskobjRecord.setValue({ fieldId: 'custevent_tss_parent_task', value: parentupdatevalue })
										}



										var originalstatus;
										if (statuslistvalue == '1') {
											originalstatus = "PROGRESS"
										}
										if (statuslistvalue == '2') {
											originalstatus = "NOTSTART"
										} if (statuslistvalue == '3') {
											originalstatus = "COMPLETE"
										}
										if(prioritylistvalue){
											taskobjRecord.setValue({fieldId:'custevent_tss_task_priority',value:prioritylistvalue});
											}
										var empSearchObj = search.lookupFields({ type: 'customer', id: customerdetails, columns: ['entityid'] });
										log.debug("empSearchObj", empSearchObj);
										//var dateVal = new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear()+'  '+new Date().getHours()+':'+new Date().getMinutes()

										var currentDateTime = new Date();
										var dateVal = format.parse({
											value: currentDateTime,
											type: format.Type.DATETIME,
										});
										var newComment = { "date": dateVal, "name": loggedinclientname, "message": taskComment };
										var commentRecord = record.create({ type: 'customrecord_project_management_comments' })
										commentRecord.setValue({ fieldId: 'custrecord_comments_project', value: projectInternalId })
										commentRecord.setValue({ fieldId: 'custrecord_comments_task', value: taskiddetails })
										commentRecord.setValue({ fieldId: 'custrecord_comments_date', value: dateVal })
										commentRecord.setValue({ fieldId: 'custrecord_comments_user', value: loggedinclientname })
										commentRecord.setValue({ fieldId: 'custrecord_comments_html_details', value: taskComment })

										commentRecord.setValue({ fieldId: 'custrecord_comments_details', value: taskComment })
										var CustRecord = commentRecord.save();
										log.debug("commentRecord", CustRecord)

										var skydocApiResponse = new Array();

										var apiRes = {};

										if (filecontents) {
											var postData = { 'fileName': FileVal, 'fileType': filetype, 'recordType': 'customrecord_project_management_comments', 'recordId': CustRecord, 'folderId': '1054', 'fileContent': filecontents };
											var postData = JSON.stringify(postData);
											log.debug('File Post Data', postData);
											var restUrl = 'https://6647300.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=379&deploy=1';
											var method = 'POST';
											var headers = oauth_new1.getHeaders({
												url: restUrl,
												method: method,
												tokenKey: secret_new1.token.public,
												tokenSecret: secret_new1.token.secret
											});
											headers['Content-Type'] = 'application/json';
											log.debug('headers', headers);
											var restResponse = https.post({ url: restUrl, headers: headers, body: postData });
											log.debug('response', JSON.stringify(restResponse));
											apiRes['fileName'] = FileVal;
											apiRes['Skydoc API Response'] = restResponse.body;
											skydocApiResponse.push(JSON.stringify(apiRes));

											var cusRecordId = record.submitFields({ type: 'customrecord_project_management_comments', id: CustRecord, values: { 'custrecord_comments_skydoc_api_response': skydocApiResponse }, options: { ignoreMandatoryFields: true } });





										} else {
											apiRes['fileName'] = filename;
											apiRes['Skydoc API Response'] = '{"error" : {"code" : "JS_EXCEPTION", "message" : "Unsupported fileType"}}';
											skydocApiResponse.push(apiRes);
										}




										taskobjRecord.setValue({ fieldId: 'custevent_tss_parent_task', value: parentupdatevalue });

										taskobjRecord.setValue({ fieldId: 'custevent_task_status', value: statuslistvalue });
										taskobjRecord.setValue({ fieldId: 'status', value: originalstatus });

										taskobjRecord.setValue({ fieldId: 'plannedwork', value: Math.round(estimateValue) });
										taskobjRecord.setValue({ fieldId: 'message', value: taskDescription1 });
										var task_rec = taskobjRecord.save({ enableSourcing: false, ignoreMandatoryFields: true });
										if (Number(task_rec == 0)) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to update task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been updated successfully</font></b>');
										}

									} if (postData.actionId == 'close') {
										log.debug(" 111111111111111")
										//loggedInClientId
										var taskRecordId = record.submitFields({ type: record.Type.PROJECT_TASK, id: task_id, values: { status: "COMPLETE", custevent_task_status: "4", custevent_update_comment: taskComment }, options: { enableSourcing: false, ignoreMandatoryFields: true } });
										if (Number(taskRecordId) == 0) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to close task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been  Closed successfully</font></b>');
										}

									} if (postData.actionId == 'delete') {
										var taskRecordId = record.submitFields({ type: record.Type.PROJECT_TASK, id: task_id, values: { custeventinactive: true, custevent_update_comment: taskComment }, options: { enableSourcing: false, ignoreMandatoryFields: true } });
										if (Number(taskRecordId) == 0) {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>Failed to inactivated task</font></b>');
										} else {
											landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=green>Task has been  inactivated successfully</font></b>');
										}
									}



								}
								landingPageContent = landingPageContent.replace('confirmcreation', '');
							} catch (Error) {
								log.error('Error occured in detailsofupdatetask page', Error);
								landingPageContent = landingPageContent.replace('confirmcreation', '<b><font color=red>' + Error.message + 'Please try again.</font></b>');
								context.response.write(landingPageContent);
							}
						}
						else if (selectedAction == 'report') {

							try {
								/*var landingPageContent = file.load({
									  id: 59090
								  }).getContents().toString();*/


								var landingPageContent = file.load({ id: fileIdIdArray[fileNameArray.indexOf(reportHtmlfile)] }).getContents().toString();

								//var clientdata = context.request.parameters.clientname;
								//log.debug("clientdata",clientdata);
								//landingPageContent    = landingPageContent.replace('clientinternalid',clientdata);



								var projectSelectedVal = context.request.parameters.projectfilterid;
								var taskSelectedVal = context.request.parameters.taskfilterid;
								var resSelectedVal = context.request.parameters.resourcefilterid;
								var isBillable = context.request.parameters.timebillableid;
								var fromSelectedVal = context.request.parameters.from;
								var toSelectedVal = context.request.parameters.to;
								var postData = context.request.parameters.Data;
								var filtersData = context.request.parameters.filtersData;
								var resourceArray = [];


								log.debug("filtersData outside", filtersData);
								var ProjectTaskSelectionOptions = returnProjectTaskSelectionOptions(selectedAction, customerdetails);
								log.debug("ProjectTaskSelectionOptions", ProjectTaskSelectionOptions);
								log.debug("ProjectTaskSelectionOptions", JSON.stringify(ProjectTaskSelectionOptions));
								landingPageContent = landingPageContent.replace('TaskListOption', JSON.stringify(ProjectTaskSelectionOptions));
								log.debug("ProjectTaskSelectionOptions", JSON.stringify(ProjectTaskSelectionOptions));
								log.debug("ProjectTaskSelectionOptions", JSON.stringify(ProjectTaskSelectionOptions).length);



								if (filtersData != null && filtersData != '' && filtersData != undefined) {

									var filtersDataParsed = JSON.parse(filtersData)
									var resourceArray = filtersDataParsed["selected"];
									log.debug("resourceArray", resourceArray);
									log.debug("resourceArray", resourceArray.length);
								}
								landingPageContent = landingPageContent.replace('clientid', clientIdValue);


								log.debug("context.request.parameters", context.request.parameters);
								log.debug("projectSelectedVal,taskSelectedVal,resourceArray,fromSelectedVal,toSelectedVal,isBillable", projectSelectedVal + ',' + taskSelectedVal + ',' + resourceArray + ',' + fromSelectedVal + ',' + toSelectedVal, +',' + isBillable);
								if (true || landingPageContent.indexOf('tableData') != -1) {
									landingPageContent = landingPageContent.replace('confirmcreation', '');
									var unapprovedTimeDirectTable = getTimesheetList(customerdetails, projectSelectedVal, taskSelectedVal, fromSelectedVal, toSelectedVal, resourceArray, isBillable, selectedAction);

									landingPageContent = landingPageContent.replace('tableData', unapprovedTimeDirectTable);
									//	landingPageContent 			  = landingPageContent.replace('arloggeduserrole',loggedRole);
									//	log.debug("role added",loggedRole);

									//  var projectFilterHtml 		  = addfilterFields("projectfilterid","job","companyname","Select Project",projectSelectedVal,selectedAction,customerdetails);

									var allprojectdata = '';
									var jobsearchobj = search.create({
										type: 'job',
										filters: [["isinactive", "is", "F"], "AND", ["status", "noneof", "1"], "AND", ["customer", "anyof", customerdetails]],
										columns: [search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "Name" }),
										search.createColumn({ name: "customer", label: "CUSTOMER" }),
										search.createColumn({ name: "companyname", label: "Project Name" }),
										search.createColumn({ name: "internalid", label: "Internal Id" }),
										]
									});
									jobsearchobj = jobsearchobj.run().getRange({ start: 0, end: 1000 });
									if (jobsearchobj.length > 0) {
										for (var i = 0; i < jobsearchobj.length; i++) {
											if (jobsearchobj[i].getValue('internalid') == projectnameid) {
												allprojectdata += '<option value="' + jobsearchobj[i].getValue('internalid') + '"  selected>' + jobsearchobj[i].getValue('companyname') + '</option>'
											}
											allprojectdata += '<option  value="' + jobsearchobj[i].getValue('internalid') + '" >' + jobsearchobj[i].getValue('companyname') + '</option>';

										}
										if ((projectnameid == '') || (projectnameid == null) || (projectnameid == undefined)) {
											allprojectdata += '<option  value="" disabled selected >Select Project</option>';
										}

									}

									landingPageContent = landingPageContent.replace('projectFieldId', allprojectdata);
									//	log.debug("role added",loggedRole);

									var taskFilterHtml = addfilterFields("taskfilterid", "projecttask", "title", "Select Task", taskSelectedVal, projectSelectedVal, selectedAction, customerdetails);
									landingPageContent = landingPageContent.replace('taskFieldId', taskFilterHtml);
									//log.debug("role added",loggedRole);

									if (fromSelectedVal) {
										landingPageContent = landingPageContent.replace('startDateValue', fromSelectedVal);
									} else {
										landingPageContent = landingPageContent.replace('startDateValue', '');
									}
									if (toSelectedVal) {
										landingPageContent = landingPageContent.replace('endDateValue', toSelectedVal);
									} else {
										landingPageContent = landingPageContent.replace('endDateValue', '');
									}
									var resourceFilterHtml = addfilterFields("resourcefilterid", "employee", "entityid", "Select Resource", resourceArray, selectedAction, customerdetails);
									landingPageContent = landingPageContent.replace('resourceFieldId', resourceFilterHtml);
									log.debug("resourceFilterHtml added", resourceFilterHtml);

									var billableFilter = '';

									if (isBillable == "" || isBillable == null || isBillable == undefined) {
										log.debug("isBillable if empty", isBillable + ',' + typeof isBillable);
										billableFilter += '<option value="" selected>Select Billable</option>';
										billableFilter += '<option value="true">Billable</option>';
										billableFilter += '<option value="false">Non billable</option>';
									} else if (isBillable == true || isBillable == 'true') {
										log.debug("isBillable if true", isBillable + ',' + typeof isBillable);
										billableFilter += '<option value="">Select Billable</option>';
										billableFilter += '<option value="true" selected>Billable</option>';
										billableFilter += '<option value="false">Non billable</option>';
									} else if (isBillable == false || isBillable == 'false') {
										log.debug("isBillable if false", isBillable + ',' + typeof isBillable);
										billableFilter += '<option value="">Select Billable</option>';
										billableFilter += '<option value="true">Billable</option>';
										billableFilter += '<option value="false" selected>Non billable</option>';
									}

									landingPageContent = landingPageContent.replace('selectedBillFilter', billableFilter);
									log.debug("billableFilter added", billableFilter);
								} else {
									log.error("Issue with  REports  page", "Issue with  Reports page");
									context.response.write("This page does not exists, please reach out to the administrator for assiatance");
									return;
								}
								if (context.request.method == 'POST') {
									var postData = context.request.parameters.Data;

									if (postData != null && postData != '' && postData != undefined) {
										var postData = JSON.parse(postData);

										if (postData.actionId == 'approve') {
											for (var z = 0; z < postData.recordId.length; z++) {
												var timeTrackingId = record.submitFields({ type: 'timebill', id: postData.recordId[z], values: { 'memo': postData.Comments[z], 'approvalstatus': 3 } });
												sendEmail(customerdetails, postData.actionId, postData.Comments[z], postData.employeeId[z]);
											}
											if (timeTrackingId) {
												landingPageContent = landingPageContent.replace('approvereject', '<b><font color=green>Timesheet has been successfully approved</font></b>');
											}
										} else if (postData.actionId == 'reject') {
											for (var z = 0; z < postData.recordId.length; z++) {
												var timeTrackingId = record.submitFields({ type: 'timebill', id: postData.recordId[z], values: { 'memo': postData.Comments[z], 'approvalstatus': 4 } });
												sendEmail(customerdetails, postData.actionId, postData.Comments[z], postData.employeeId[z]);
											}
											landingPageContent = landingPageContent.replace('approvereject', '<b><font color=green>Timesheet has been successfully rejected</font></b>');
										}
									}
								}
								landingPageContent = landingPageContent.replace('approvereject', '');
								landingPageContent = landingPageContent.replace('actionUrl', selfSuiteLetUrl + '&action=report');

							} catch (e) {
								log.error("Error in reports is : ", e)
							}
						}



						landingPageContent = landingPageContent.replace('emp_portal_style', landingPageStyle);
						landingPageContent = landingPageContent.replace('emp_portal_script', landingPageScript);
						landingPageContent = landingPageContent.replace(/loginPage/g, 'https://6647300.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=374&deploy=1&compid=6647300&h=82aafd304ff3d541f6f6');
						landingPageContent = landingPageContent.replace('linkLoader', pageLoaderUrl);
						landingPageContent = landingPageContent.replace('companyBanner', companyBannerUrl);
						landingPageContent = landingPageContent.replace(/ecache/g, encryptedText);
						landingPageContent = landingPageContent.replace(/nonpostingaction/g, selfSuiteLetUrl);
						landingPageContent = landingPageContent.replace('clientid', loggedInClientId);




						log.debug("landingPageContent", landingPageContent);
						log.debug("context.request.parameter in post", context.request.parameter)

						if (context.request.method == 'GET') {


							//						if(forgotPassword == 'T'){
							//						html      = html.replace('injectedCode',forgotPass);
							//						}else{
							//						landingPageContent      = landingPageContent.replace('injectedCode',intialLogin);
							//						}
						} else { }
						context.response.write(landingPageContent);
					}
				}
			} catch (err) {
				log.error("Error in onRequest", err);
				var portalUrl = "https://6647300.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=374&deploy=1&compid=6647300&h=82aafd304ff3d541f6f6";
				var loginUrl = '<script>window.open("' + portalUrl + '", "_self");</script>';
				context.response.write(loginUrl);
			}
		}


		/*function getProjectStatusData(customerdetails) {
			  var filters = ["job.customer","anyof",customerdetails];
			  var columns = [
							 search.createColumn({name: 'custevent_task_status'}),
							 search.createColumn({name: 'internalid'})
							 ];
			  var results = search.create({type: 'projecttask', filters: filters, columns: columns}).run().getRange({start: 0, end: 1000});
	
			  var data = [];
			  for (var i = 0; i < results.length; i++) {
				  data.push({
					  status: results[i].getValue(columns[0]),
					  count: results[i].getValue(columns[1]),
	
				  });
			  }
			  return JSON.stringify(data);
		  }
		 */

		function returnProjectListHTML(selfSuiteLetUrl, loggedInClientId, encryptedText) {
			try {
				var updateclientDirectoryDetails = '';
				var updateclientDirectoryResults = '';
				var updateclientDirectoryArray = new Array();
				var counter = 0;

				log.debug("loggedInClientId", loggedInClientId)
				var contactIdArr = [];
				var updateclientDirectorySearch = search.create({
					type: "customrecord_client_access",
					filters:
						[
							["internalid", "anyof", loggedInClientId],"AND", 
							["custentity_tss_client_access.isinactive","is","F"]

						],
					columns:
						[
							search.createColumn({
								name: "entityid",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Name"
							}),
							search.createColumn({
								name: "companyname",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Project Name"
							}),
							search.createColumn({
								name: "startdate",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Start Date"
							}),
							search.createColumn({
								name: "entityid",
								join: "CUSTRECORD_TSS_CUSTOMER_NAME",
								label: "Name"
							}),
							search.createColumn({
								name: "projectmanager",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Project Manager"
							}),
							search.createColumn({
								name: "internalid",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Project Manager"
							}),
							search.createColumn({
								name: "entitystatus",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Status"
							}),
							search.createColumn({
								name: "custentity_selecting_contact",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Selecting Contact"
							}),
							search.createColumn({
								name: "internalid",
								join: "CUSTENTITY_TSS_CLIENT_ACCESS",
								label: "Internal ID"
							})
						]
				});

				var coulmns = updateclientDirectorySearch.columns;
				log.debug("coulmns", coulmns)
				for (var i = 0; updateclientDirectoryResults.length >= 1000 || i == 0; i++) {
					updateclientDirectoryResults = updateclientDirectorySearch.run().getRange({ start: counter, end: counter + 1000 });
					if (updateclientDirectoryResults.length > 0) {

						updateclientDirectoryArray = updateclientDirectoryArray.concat(updateclientDirectoryResults);
					}
					counter += updateclientDirectoryResults.length;
				}
				for (var i = 0; i < updateclientDirectoryArray.length; i++) {


					var contactname = updateclientDirectoryArray[i].getValue({ name: 'custentity_selecting_contact', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' })
					log.debug("contactname", contactname)
					var contactIdArr = contactname.split(',')
					log.debug("contactIdArr", contactIdArr)

					for (var j = 0; j < contactIdArr.length; j++) {

						log.debug("contactIdArr[j]", contactIdArr[j])
						if (contactIdArr[j]) {
							if (contactIdArr[j] == loggedInClientId) {
								var entitystatus = updateclientDirectoryArray[i].getValue({ name: 'entitystatus', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' })
								log.debug("entitystatus", entitystatus)
								if (entitystatus == '2' || entitystatus == '3' || entitystatus == '5') {
									log.debug("projectstatus", entitystatus)
									var projectname = updateclientDirectoryArray[i].getValue({ name: 'companyname', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' })
								}
								var projectsplitData = ''
								if (projectname) {
									if (projectname.indexOf(":") > 0) {
										var splitprojectname = projectname.split(":")
										projectsplitData = splitprojectname[1]

									}
									else {
										projectsplitData = projectname
									}


									log.debug("updateclientDirectoryArray[i].getValue({name:'internalid',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})", updateclientDirectoryArray[i].getValue({ name: 'internalid', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' }))
									//				updateclientDirectoryDetails += '<tr><td><a href='+ selfSuiteLetUrl+'&action=taskpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid') +'&e='+encryptedText+' '+ '> View</a>'+' | '+'<a href='+ selfSuiteLetUrl+'&action=updateprojectpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid') +'&e='+encryptedText+ '>Edit</a></td><td>'+ updateclientDirectoryArray[i].getValue('companyname') + '</td><td>'+updateclientDirectoryArray[i].getValue({name:'entityid',join:'customer'})+'</td><td>'+updateclientDirectoryArray[i].getValue({name:'entityid',join:'projectmanager'})+'</td><td>'+updateclientDirectoryArray[i].getValue('startdate')+'</td></tr>';
									updateclientDirectoryDetails += '<tr><td><a href=' + selfSuiteLetUrl + '&action=projectpage&clientname=' + loggedInClientId + '&projectid=' + updateclientDirectoryArray[i].getValue({ name: 'internalid', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' }) + '&e=' + encryptedText + '> View</a>' + '</td><td>' + updateclientDirectoryArray[i].getValue({ name: 'startdate', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' }) + '</td><td>' + projectsplitData + '</td><td>' + updateclientDirectoryArray[i].getValue({ name: 'entityid', join: 'CUSTRECORD_TSS_CUSTOMER_NAME' }) + '</td><td>' + updateclientDirectoryArray[i].getText({ name: 'projectmanager', join: 'CUSTENTITY_TSS_CLIENT_ACCESS' }) + '</td></tr>';
									// log.debug("selfSuiteLetUrl+'&action=projectpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid')",selfSuiteLetUrl+'&action=projectpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid'))

								}
							}
							else {
								log.debug("The Project is not related to logged in client ")
							}
						}

						// 			else{

						// 				var projectname=updateclientDirectoryArray[i].getValue({name:'companyname',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})

						// 				var projectsplitData=''
						// 				if(projectname.indexOf(":")>0)
						// 				{
						// 				var splitprojectname=projectname.split(":")
						// 				projectsplitData=splitprojectname[1]

						// 				}
						// 			else
						// 			{
						// 				projectsplitData=projectname
						// 			}
						// 				log.debug("updateclientDirectoryArray[i].getValue({name:'internalid',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})",updateclientDirectoryArray[i].getValue({name:'internalid',join:'CUSTENTITY_TSS_CLIENT_ACCESS'}))
						// //				updateclientDirectoryDetails += '<tr><td><a href='+ selfSuiteLetUrl+'&action=taskpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid') +'&e='+encryptedText+' '+ '> View</a>'+' | '+'<a href='+ selfSuiteLetUrl+'&action=updateprojectpage'+'&projectid='+ updateclientDirectoryArray[i].getValue('internalid') +'&e='+encryptedText+ '>Edit</a></td><td>'+ updateclientDirectoryArray[i].getValue('companyname') + '</td><td>'+updateclientDirectoryArray[i].getValue({name:'entityid',join:'customer'})+'</td><td>'+updateclientDirectoryArray[i].getValue({name:'entityid',join:'projectmanager'})+'</td><td>'+updateclientDirectoryArray[i].getValue('startdate')+'</td></tr>';
						// 				updateclientDirectoryDetails += '<tr><td><a href='+ selfSuiteLetUrl+'&action=projectpage&clientname=' +loggedInClientId+ '&projectid='+ updateclientDirectoryArray[i].getValue({name:'internalid',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})+'&e='+encryptedText+ '> View</a>'+'</td><td>'+updateclientDirectoryArray[i].getValue({name:'startdate',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})+'</td><td>'+ projectsplitData + '</td><td>'+updateclientDirectoryArray[i].getValue({name:'entityid',join:'CUSTRECORD_TSS_CUSTOMER_NAME'})+'</td><td>'+updateclientDirectoryArray[i].getText({name:'projectmanager',join:'CUSTENTITY_TSS_CLIENT_ACCESS'})+'</td></tr>';


						// 			}

					}
				}


				log.debug("updateclientDirectoryArray", updateclientDirectoryArray)

				return updateclientDirectoryDetails;

			} catch (err) {
				log.error("Error in returnProjectListHTML", err);
			}
		}









		function returnProjectPageHTML() {
			try {

			} catch (err) {
				log.error("Error in returnProjectPageHTML", err);
			}
		}
		function fetchtaskpageDirectory(selfSuiteLetUrl, projectinternalid, loggedInClientId, encryptedText) {
			try {
				var taskDetails = '';
				var taskResults = '';
				var taskArray = new Array();
				var counter = 0;
				var taskSearch = search.create({
					type: "job",
					filters: [["internalid", "anyof", projectinternalid],"AND",["isinactive","is","F"]],
					columns: [search.createColumn({ name: "title", join: "projectTask", label: "Name" }),
					search.createColumn({ name: "entityid", join: "customer", label: "Name" }),
					search.createColumn({ name: "plannedwork", join: "projectTask", label: "Planned Work" }),
					search.createColumn({ name: "actualwork", join: "projectTask", label: "Actual Work" }),
					search.createColumn({ name: "internalid", join: "projectTask", label: "Internal ID" }),
					search.createColumn({ name: "custevent_tss_parent_task", join: "projectTask", label: "custevent_tss_parent_task" }),
					search.createColumn({ name: "custevent_tss_task_priority", join: "projectTask", label: "custevent_tss_task_priority" }),
					search.createColumn({name: "custevent_ticket_no",join: "projectTask", label: "Ticket Name"}),


					]
				});
				log.debug("search created")
				var coulmns = taskSearch.columns;
				log.debug("coulmns", coulmns)
				for (var i = 0; taskResults.length >= 1000 || i == 0; i++) {
					taskResults = taskSearch.run().getRange({
						start: counter,
						end: counter + 1000
					});
					log.debug("length", taskResults.length)
					if (taskResults.length > 0) {
						taskArray = taskArray.concat(taskResults);
					}
					counter += taskResults.length;
				}
				for (var i = 0; i < taskArray.length; i++) {
					var taskid = taskArray[i].getValue({ name: 'internalid', join: 'projectTask' });
					if (taskid) {
						var plannedworkVal = taskArray[i].getValue({ name: 'plannedwork', join: 'projectTask' }) 
						var plannedworkroundoff = Math.round(plannedworkVal)
						//					taskDetails += '<tr><td><a href='+ selfSuiteLetUrl+'&action=taskdetailspage'+'&taskid='+ taskArray[i].getValue({name:'internalid',join:'projectTask'}) +'&e='+encryptedText+' '+'>View</a>'+' | '+'<a href='+ selfSuiteLetUrl+'&action=updatetaskpage'+'&taskid='+ taskArray[i].getValue({name:'internalid',join:'projectTask'}) +'&e='+encryptedText+ '>Edit</a></td><td>'+ taskArray[i].getValue({name:'title',join:'projectTask'}) + '</td><td>'+taskArray[i].getValue({name:'entityid',join:'customer'})+'</td><td>'+taskArray[i].getValue({name:'plannedwork',join:'projectTask'})+'</td><td>'+taskArray[i].getValue({name:'actualwork',join:'projectTask'})+'</td></tr>';					}			
						taskDetails += '<tr><td><a href=' + selfSuiteLetUrl + '&action=taskdetailspage&clientname=' + loggedInClientId + '&taskid=' + taskArray[i].getValue({ name: 'internalid', join: 'projectTask' }) + '&e=' + encryptedText + '>View</a>' + ' | ' + '<a href=' + selfSuiteLetUrl + '&action=updatetaskpage&clientname=' + loggedInClientId + '&taskid=' + taskArray[i].getValue({ name: 'internalid', join: 'projectTask' }) + '&e=' + encryptedText + '>Edit</a></td><td>' + taskArray[i].getValue({ name: 'title', join: 'projectTask' }) + '</td><td>' + taskArray[i].getText({ name: 'custevent_tss_parent_task', join: 'projectTask' }) + '</td><td>' + taskArray[i].getValue({ name: 'entityid', join: 'customer' }) + '</td><td>' + plannedworkroundoff+ '</td><td>' + taskArray[i].getValue({ name: 'actualwork', join: 'projectTask' }) + '</td><td>'+taskArray[i].getValue({name:'custevent_ticket_no',join: 'projectTask'})+'</td><td>' + taskArray[i].getText({ name: 'custevent_tss_task_priority', join: 'projectTask' }) + '</td></tr>';
					}
				}
				log.debug("completed")
			} catch (Error) {
				log.error('Error occured in fetch  task page function', Error);
			}
			return taskDetails;
		}

		function showUpdateProjectPage(projectIdSelected, tempFieldId, recType, columnText, resourcearr) {
			try {
				var htmlCode = '';
				if (tempFieldId == 'resourceid') {
					htmlCode += '<select   style="width:70px align:right;"   name=' + tempFieldId + ' id=' + tempFieldId + ' multiple="multiple" autocomplete="off" required  >';
					var clientSearchObj = getFieldList(recType, columnText, tempFieldId);
					clientSearchObj.run().each(function (result) {
						if (resourcearr.indexOf(result.getValue('internalid')) == -1) {
							htmlCode += '<option  value="' + result.getValue('internalid') + '" >' + result.getValue('entityid') + '</option>';
						} else {
							htmlCode += '<option  value="' + result.getValue('internalid') + '" selected>' + result.getValue('entityid') + '</option>';
						}
						return true;
					});
					htmlCode += '</select>'
					return htmlCode;
				} else {
					if (projectIdSelected) {
						htmlCode += '<select style="width:70px align:left;"   name=' + tempFieldId + ' id=' + tempFieldId + ' disabled="true">';
					} else {
						htmlCode += '<select style="width:70px align:right;"   name=' + tempFieldId + ' id=' + tempFieldId + ' >';
					}
				}
				var clientSearchObj = getFieldList(recType, columnText, tempFieldId);
				clientSearchObj.run().each(function (result) {
					if (result.getValue('internalid') == projectIdSelected) {
						htmlCode += '<option value="' + result.getValue('internalid') + '" selected>' + result.getValue(columnText) + '</option>';
					} else {
						htmlCode += '<option value="' + result.getValue('internalid') + '">' + result.getValue(columnText) + '</option>';
					}
					if (!projectIdSelected) {
						htmlCode += '<option value="" disabled selected ></option>';
					}
					return true;
				});
				htmlCode += '</select>'
				return htmlCode
			} catch (err) {
				log.error("Error in showUpdateProjectPage", err);
			}
		}
		function getFieldList(recordType, columnText, fieldIdValue, projectedSelected) {
			try {
				var filterArr = new Array();
				var searchObj = search.create({
					type: recordType,
					columns:
						[search.createColumn({ name: columnText, sort: search.Sort.ASC }),
						search.createColumn({ name: "internalid" })
						]
				});
				if (fieldIdValue == 'taskfilterid') {
					if (projectedSelected) {
						filterArr.push(search.createFilter({ name: 'project', operator: 'is', values: projectedSelected }));
						searchObj.filters = filterArr;
					}
				}
				if (fieldIdValue == 'resourceid') {
					filterArr.push(search.createFilter({ name: 'isjobresource', operator: 'is', values: true }));
					searchObj.filters = filterArr;
				}
				if (fieldIdValue == 'managerid') {
					filterArr.push(search.createFilter({ name: 'isjobmanager', operator: 'is', values: true }));
					searchObj.filters = filterArr;
				}
				return searchObj;
			} catch (err) {
				log.error("Error in getTextValuePair", err);
			}
		}
		function fetchtaskDirectory(selfSuiteLetUrl, customerdetails, loggedInClientId, encryptedText, projectInternalIDArr) {
			try {
				var taskDetails = '';
				var taskResults = '';
				var taskArray = new Array();
				var counter = 0;
				var taskSearch = search.create({
					type: "projecttask",
					filters: [["job.internalid", "anyof", projectInternalIDArr],"AND",["job.isinactive","is","F"]
						,

						"AND",
					["custeventinactive", "is", "F"], "AND", ["job.status", "anyof", ["2", "3", "5"]]],
					columns: [search.createColumn({ name: "id", sort: search.Sort.ASC, label: "ID" }),
					search.createColumn({ name: "title", label: "Name" }),
					search.createColumn({ name: "company", label: "Project" }),
					search.createColumn({ name: "startdate", label: "Start Date" }),
					search.createColumn({ name: "plannedwork", label: "Planned Work" }),
					search.createColumn({ name: "actualwork", label: "Actual Work" }),
					search.createColumn({ name: "companyname", join: "job", label: "Project Name" }),
					search.createColumn({ name: "internalid", label: "Internal Id" }),
					search.createColumn({ name: "custevent_tss_parent_task", label: "custevent_tss_parent_task" }),
					search.createColumn({ name: "custevent_task_status", label: "Task Status " }),
					search.createColumn({name: "custevent_tss_task_priority", label: "Priority "}),
					search.createColumn({name: "custevent_ticket_no", label: "Ticket Name"}),




					]
				});
				var coulmns = taskSearch.columns;
				log.debug("coulmns", coulmns)
				for (var i = 0; taskResults.length >= 1000 || i == 0; i++) {
					taskResults = taskSearch.run().getRange({ start: counter, end: counter + 1000 });
					log.debug("length", taskResults.length)
					if (taskResults.length > 0) {
						taskArray = taskArray.concat(taskResults);
					}
					counter += taskResults.length;
				}

				// Lead, Manager and Finance Admin
				for (var i = 0; i < taskArray.length; i++) {
					var plannedworkdetails = taskArray[i].getValue({ name: 'plannedwork' })
					// var plannedworkvalue = parseFloat(plannedworkdetails).toFixed(2);
					var plannedworkvalue = Math.round(plannedworkdetails);

					log.debug("length", taskResults.length)

					var projectname = taskArray[i].getValue({ name: 'companyname', join: 'job' })
					var splitprojectname = projectname.split(":")
					var splitdata = splitprojectname[1];
					taskDetails += '<tr><td></td><td><a href=' + selfSuiteLetUrl + '&action=detailsoftaskpage&clientname=' + loggedInClientId + '&taskid=' + taskArray[i].getValue('internalid') + '&e=' + encryptedText + '>View</a>' + ' | ' + '<a href=' + selfSuiteLetUrl + '&action=detailsofupdatepage&clientname=' + loggedInClientId + '&taskid=' + taskArray[i].getValue('internalid') + '&e=' + encryptedText + '>Edit</a></td><td>' + taskArray[i].getValue('title') + '</td><td>' + taskArray[i].getText('custevent_task_status') + '</td><td>' + taskArray[i].getText('custevent_tss_parent_task') + '</td><td>' + splitdata + '</td><td>' + taskArray[i].getValue('startdate') + '</td><td>' + plannedworkvalue + '</td><td>' + taskArray[i].getValue({ name: 'actualwork' }) + '</td><td>'+taskArray[i].getValue('custevent_ticket_no')+'</td><td>'+taskArray[i].getText('custevent_tss_task_priority')+'</td></tr>';

				}


			} catch (Error) {
				log.error('Error occured in fetch  task page function', Error);
			}
			return taskDetails;
		}
		function getTimesheetList(loggedinUser, projectedSelected, taskSelected, fromSelectedVal, toSelectedVal, resSelectedVal, isBillable, selectedAction) {
			try {
				var timeDirectoryDetails = '';
				var timeDirectoryResults = '';
				var timeDirectoryArray = new Array();
				var filterArr = new Array();
				var filterArr1 = new Array();
				var counter = 0;

				log.debug("loggedinUser", loggedinUser);
				var timeSearchObj = search.create({
					type: 'timebill',
					columns: [search.createColumn({ name: "employee", label: "Employee" }),
					search.createColumn({ name: "entityid", join: "employee" }),
					search.createColumn({ name: "supervisor", join: "employee" }),
					search.createColumn({ name: "internalid", join: "employee" }),
					search.createColumn({ name: "customer" }),
					search.createColumn({ name: "entityid", join: "customer" }),
					search.createColumn({ name: "customer", label: "CUSTOMER" }),
					search.createColumn({ name: "title", join: "projectTask" }),
					search.createColumn({ name: "date", sort: search.Sort.DESC, label: "Date" }),
					search.createColumn({ name: "item", label: "Item" }),
					search.createColumn({ name: "internalid", label: "Internal Id" }),
					search.createColumn({ name: "memo", label: "Note" }),
					search.createColumn({ name: "hours", label: "Duration" }),
					search.createColumn({ name: "approvalstatus", label: "Approval Status (Text)" }),
					search.createColumn({ name: "timesheet", label: "Timesheet" }),
					search.createColumn({ name: "custcoltime_comments", label: "TIME COMMENTS" }),
					search.createColumn({ name: "companyname", label: "Project Name", join: "job" }),
					search.createColumn({ name: "isbillable", label: "Billable" })]
				});


				if ((selectedAction == 'report') && (validateValue(projectedSelected)) && (validateValue(taskSelected)) && (validateValue(fromSelectedVal)) && (validateValue(toSelectedVal)) && (validateValue(resSelectedVal)) && (validateValue(isBillable))) {
					var now = new Date()
					var prevYearFirstDate = new Date(now.getFullYear(), 0, 1);
					//var prevyearlastDate=new Date(now.getFullYear()-1, 11, 31);

					var startVal = format.format({ value: prevYearFirstDate, type: format.Type.DATE, });
					log.debug("individual range.start", startVal)

					var endVal = format.format({ value: now, type: format.Type.DATE, });
					log.debug("individual range.end", endVal)

					filterArr.push(search.createFilter({ name: 'date', join: null, operator: search.Operator.WITHIN, values: [startVal, endVal] }));

					timeSearchObj.filters = filterArr;
				}


				//	filterArr.push(search.createFilter({name: 'type', join: null,operator: search.Operator.ANYOF, values:'A'}));
				filterArr.push(search.createFilter({ name: 'customer', join: 'job', operator: 'is', values: loggedinUser }));

				//	filterArr.push(search.createFilter({name:'custentity_tss_client_access',join:'job',operator:'anyof',values:"A"}));
				timeSearchObj.filters = filterArr;

				log.debug("timeSearchObj.filters", timeSearchObj.filters);
				if (projectedSelected) {
					log.debug("projectedSelected", projectedSelected);
					filterArr.push(search.createFilter({ name: 'internalid', join: 'job', operator: 'anyof', values: projectedSelected }));
					timeSearchObj.filters = filterArr;
				}
				if (taskSelected) {
					log.debug("taskSelected", taskSelected);
					filterArr.push(search.createFilter({ name: 'internalid', join: 'projecttask', operator: 'anyof', values: taskSelected }));
					timeSearchObj.filters = filterArr;
				}


				if (fromSelectedVal || toSelectedVal) {
					var sysDateFormat = config.load({ type: config.Type.USER_PREFERENCES }).getValue({ fieldId: 'DATEFORMAT' }).toLowerCase();
					if (slash.indexOf(sysDateFormat) != -1) {
						flag = "slash";
					} else if (dash.indexOf(sysDateFormat) != -1) {
						flag = "dash";
					} else if (dot.indexOf(sysDateFormat) != -1) {
						flag = "dot";
					} else {
						flag = "comma";
					}
					var filterDates = formatLeaveDates(flag, fromSelectedVal, toSelectedVal, sysDateFormat);
					log.debug("filterDates", filterDates[0] + ',' + filterDates[1]);

					if (fromSelectedVal) {
						filterArr.push(search.createFilter({ name: 'date', operator: 'onorafter', values: filterDates[0] }));
						timeSearchObj.filters = filterArr;
					}
					if (toSelectedVal) {
						filterArr.push(search.createFilter({ name: 'date', operator: 'onorbefore', values: filterDates[1] }));
						timeSearchObj.filters = filterArr;
					}
				}
				log.debug("resSelectedVal", resSelectedVal + ',' + resSelectedVal.length);

				if (resSelectedVal.length > 0) {
					filterArr.push(search.createFilter({ name: 'employee', operator: 'anyof', values: resSelectedVal }));
					timeSearchObj.filters = filterArr;
				}
				if (isBillable) {
					log.debug("isBillable", isBillable);
					filterArr.push(search.createFilter({ name: 'billable', operator: 'is', values: isBillable }));
					timeSearchObj.filters = filterArr;
				}



				var coulmns = timeSearchObj.columns;
				log.debug("timeSearchObj.filters", timeSearchObj.filters)
				log.debug("timeDirectoryResults.length", timeDirectoryResults.length)
				for (var i = 0; timeDirectoryResults.length >= 1000 || i == 0; i++) {
					timeDirectoryResults = timeSearchObj.run().getRange({ start: counter, end: counter + 1000 });
					if (timeDirectoryResults.length > 0) {
						timeDirectoryArray = timeDirectoryArray.concat(timeDirectoryResults);
					}
					counter += timeDirectoryResults.length;
				}
				log.debug("timeDirectoryArray", timeDirectoryArray)

				for (var i = 0; i < timeDirectoryArray.length; i++) {
					if ((selectedAction == 'approvetimesheet') || (selectedAction == 'approvebuttonid')) {
						timeDirectoryDetails += '<tr><td></td><td  class="buttonClick" id="comment_' + i + '"></td><td>' + timeDirectoryArray[i].getValue('date') + '</td><td>' + timeDirectoryArray[i].getValue({ name: "entityid", join: "employee" }) + '</td><td>' + timeDirectoryArray[i].getValue({ name: "entityid", join: "customer" }) + '</td><td>' + timeDirectoryArray[i].getValue({ name: 'title', join: 'projectTask' }) + '</td><td>' + timeDirectoryArray[i].getValue('hours') + '</td><td></td><td>' + timeDirectoryArray[i].getText('approvalstatus') + '</td><td></td><td>' + timeDirectoryArray[i].getValue('internalid') + '</td><td>' + timeDirectoryArray[i].getValue('employee') + '</td><td>' + i + '</td></tr>';
					}
					if (selectedAction == 'report') {
						var billableyes;
						var billablecheck = timeDirectoryArray[i].getValue("isbillable");
						if ((billablecheck == true) || (billablecheck == 'true')) {
							billableyes = "Yes"
						} else {
							billableyes = "No"
						}
						/*var projectsplitData='';
							var projectname=timeDirectoryArray[i].getValue({name:'companyname',join:'job'})
							log.debug("projectname",projectname)
							if(projectname.indexOf(":")>0)
								{
								var splitprojectname=projectname.split(":")
								projectsplitData=splitprojectname[1]
	
								}
							else
							{
								projectsplitData=projectname
							}*/
						timeDirectoryDetails += '<tr><td></td><td>' + timeDirectoryArray[i].getValue('date') + '</td><td>' + timeDirectoryArray[i].getValue({ name: "entityid", join: "employee" }) + '</td><td>' + timeDirectoryArray[i].getValue({ name: 'companyname', join: 'job' }) + '</td><td>' + timeDirectoryArray[i].getValue({ name: 'title', join: 'projectTask' }) + '</td><td>' + timeDirectoryArray[i].getValue('hours') + '</td><td></td><td>' + timeDirectoryArray[i].getText('approvalstatus') + '</td><td>' + timeDirectoryArray[i].getValue('memo') + '</td><td>' + timeDirectoryArray[i].getValue('internalid') + '</td><td>' + timeDirectoryArray[i].getValue('employee') + '</td><td>' + billableyes + '</td><td>' + timeDirectoryArray[i].getValue('custcoltime_comments') + '</td><td>' + i + '</td></tr>';
					}
				}
				log.debug("timeDirectoryDetails", timeDirectoryDetails)
				return timeDirectoryDetails;
			} catch (err) {
				log.error("Error in getTimesheetList", err);
			}
		}
		function addfilterFields(tempFieldId, recType, columnText, nameDisplay, defaultVal, projectedSelected, selectedAction, customerdetails) {
			try {
				var htmlCode = '';

				if (tempFieldId == 'resourcefilterid') {
					log.debug("defaultVal in addfilterFields for resource", defaultVal);


					//				htmlCode += '<select   style="width:70px align:right;"   name='+tempFieldId+' id='+tempFieldId+' multiple="multiple" autocomplete="off" >';
					var clientSearchObj = getFieldList(recType, columnText, tempFieldId);
					var resultIndex1 = 0;
					var resultSet1 = '';
					do {
						resultSet1 = clientSearchObj.run().getRange({
							start: resultIndex1,
							end: resultIndex1 + 1000
						});
						log.debug("resultSet", resultSet1.length);
						for (var i = 0; i < resultSet1.length; i++) {
							var optionText = resultSet1[i].getValue('entityid');
							if (optionText) {
								if (defaultVal.indexOf(resultSet1[i].getValue('internalid')) == -1) {
									htmlCode += '<option  value="' + resultSet1[i].getValue('internalid') + '" >' + resultSet1[i].getValue('entityid') + '</option>';
								} else {
									log.debug("Selected values", resultSet1[i].getValue('internalid'));
									htmlCode += '<option  value="' + resultSet1[i].getValue('internalid') + '" selected>' + resultSet1[i].getValue('entityid') + '</option>';
								}
							}
						}
						resultIndex1 += 1000;
					} while (resultSet1.length >= 1000);




					/*clientSearchObj.run().each(function(result){
						  var optionText = result.getValue('entityid');
						  if(optionText){
							  if(defaultVal.indexOf(result.getValue('internalid'))== -1 ){
								  htmlCode += '<option  value="'+result.getValue('internalid')+'" >'+result.getValue('entityid')+'</option>';
							  }else{
								  log.debug("Selected values",result.getValue('internalid'));
								  htmlCode += '<option  value="'+result.getValue('internalid')+'" selected>'+result.getValue('entityid')+'</option>';
							  }
						  }
						  return true;
					  });	*/
					//  htmlCode += '<option  value="" disabled selected >Select Resource</option>';

					return htmlCode;
				}


				//			htmlCode += '<select name='+tempFieldId+' id='+tempFieldId+' ">';
				//			htmlCode += '<select style=" width: 300px; align : left; display: inline-block; margin-left: 5px;  margin-right: 50px; "   name='+tempFieldId+' id='+tempFieldId+' placeholder="'+nameDisplay+'">';

				log.debug(tempFieldId, defaultVal + ',' + nameDisplay);
				if (defaultVal == null || defaultVal == '' || defaultVal == undefined) {
					htmlCode += '<option value="" disabled selected >' + nameDisplay + '</option>';
				}

				var clientSearchObj = getFieldList(recType, columnText, tempFieldId, projectedSelected, selectedAction, customerdetails);

				var resultIndex1 = 0;
				var resultSet1 = '';
				do {
					resultSet1 = clientSearchObj.run().getRange({
						start: resultIndex1,
						end: resultIndex1 + 1000
					});
					log.debug("resultSet", resultSet1.length);

					for (var i = 0; i < resultSet1.length; i++) {
						if (resultSet1[i].getValue(columnText)) {
							htmlCode += '<option value="' + resultSet1[i].getValue('internalid') + '">' + resultSet1[i].getValue(columnText) + '</option>';

						}
					}

					resultIndex1 += 1000;
				} while (resultSet1.length >= 1000);

				/*clientSearchObj.run().each(function(result){
					  if(result.getValue(columnText)){
						  if(result.getValue('internalid')==defaultVal){
							  htmlCode += '<option value="'+result.getValue('internalid')+'" selected>'+result.getValue(columnText)+'</option>';
						  }
						  htmlCode += '<option value="'+result.getValue('internalid')+'">'+result.getValue(columnText)+'</option>';
					  }
					  return true;
				  });	*/
				//			htmlCode += '</select>'
				return htmlCode;
			} catch (err) {
				log.error("Error in addfilterFields", err);
			}
		}
		function escapeHtmlEntities(text) {
			var entities = { '<': '&lt;', '>': '&gt;' };

			return text.replace(/[<>"'&]/g, function (entity) {
				return entities[entity] || entity;
			});
		}
		function containsHTML(text) {
			var regex = /<[a-z][\s\S]*>/i;
			return regex.test(text);
		}
		function getFieldList(recordType, columnText, fieldIdValue, projectedSelected, selectedAction, customerdetails) {
			try {
				log.debug("projectedSelected", projectedSelected)
				log.debug("recordType", recordType)

				var filterArr = new Array();
				var searchObj = search.create({
					type: recordType,
					columns:
						[search.createColumn({ name: columnText, sort: search.Sort.ASC }),
						search.createColumn({ name: "internalid" })
						]
				});
				if ((selectedAction == 'createtask') || (fieldIdValue == 'taskfilterid') || (selectedAction == 'report')) {
					if (customerdetails) {
						filterArr.push(search.createFilter({ name: 'customer', join: 'job', operator: 'anyof', values: customerdetails }));
						filterArr.push(search.createFilter({ name: 'isinactive',join: 'job', operator: 'is', values: "F" }));

						searchObj.filters = filterArr;
					}
				}
				if (fieldIdValue == 'taskfilterid') {
					if (projectedSelected) {
						filterArr.push(search.createFilter({ name: 'project', operator: 'is', values: projectedSelected }));
						filterArr.push(search.createFilter({ name: 'isinactive', operator: 'is', values: "F" }));

						searchObj.filters = filterArr;
					}
				}
				if (fieldIdValue == 'resourceid') {
					filterArr.push(search.createFilter({ name: 'isjobresource', operator: 'is', values: true }));
					filterArr.push(search.createFilter({ name: 'isinactive', operator: 'is', values: "F" }));

					searchObj.filters = filterArr;
				}
				if (fieldIdValue == 'managerid') {
					filterArr.push(search.createFilter({ name: 'isjobmanager', operator: 'is', values: true }));
					filterArr.push(search.createFilter({ name: 'isinactive', operator: 'is', values: "F" }));

					searchObj.filters = filterArr;
				}

				return searchObj;
			} catch (err) {
				log.error("Error in getTextValuePair", err);
			}
		}
		function getProjectStatusData(projectInternalIDArr) {
			// Define your saved search filters and columns
			log.debug(",projectInternalIDArr", projectInternalIDArr)
			var filters = [["job.internalid", "anyof", projectInternalIDArr],"AND",["job.isinactive","is","F"],"AND",["custeventinactive", "is", "F"], "AND", ["job.status", "anyof", ["2", "3", "5"]]];
			var columns = [

				search.createColumn({
					name: "custevent_task_status",
					summary: "GROUP",
					label: "Status"
				}),
				search.createColumn({
					name: "internalid",
					summary: "COUNT",
					label: "Internal ID"
				})

			];

			// Run the saved search and retrieve the results
			var results = search.create({
				type: 'projecttask',
				filters: filters,
				columns: columns
			}).run().getRange({
				start: 0,
				end: 1000
			});

			// Convert the results to an array of objects with 'status' and 'count' properties
			var data = [];
			for (var i = 0; i < results.length; i++) {
				var status = results[i].getText(columns[0]);
				log.debug("status", status)
				var count = parseFloat(results[i].getValue(columns[1]));
				data.push([status, count]);
			}

			// Return the data as a JSON string
			return JSON.stringify(data);
		}

		function returnProjectTaskSelectionOptions(selectedAction, customerdetails) {
			try {
				var filterArr = new Array();
				var projectTaskArray = {};
				var taskIdArray = [];
				var taskNameArray = [];
				log.debug("customerdetails", customerdetails)
				if ((selectedAction == 'createtask')) {
					filterArr.push(search.createFilter({ name: 'custeventinactive', operator: search.Operator.IS, values: ['F'] }));
					filterArr.push(search.createFilter({ name: 'custevent_task_status', operator: search.Operator.ANYOF, values: ['1', '2'] }));
					filterArr.push(search.createFilter({ name: 'status', operator: search.Operator.ANYOF, values: ['PROGRESS', 'NOTSTART'] }));

				}

				var searchObj = search.create({
					type: "projecttask",
					filters: filterArr,
					columns: [search.createColumn({ name: "title", sort: search.Sort.ASC }),
					search.createColumn({ name: "internalid" }),
					search.createColumn({ name: "project" })
					]
				});

				var resultIndex = 0;
				var resultSet = '';

				do {
					resultSet = searchObj.run().getRange({
						start: resultIndex,
						end: resultIndex + 1000
					});
					log.debug("resultSet", resultSet.length);

					for (var i = 0; i < resultSet.length; i++) {

						var taskId = resultSet[i].getValue('internalid');
						var projectId = resultSet[i].getValue('project');
						var taskName = resultSet[i].getValue('title');
						if (projectTaskArray.hasOwnProperty(projectId) == false) {
							projectTaskArray[projectId] = {};
							if (selectedAction == 'createtask') {
								projectTaskArray[projectId]["Select Parent Task"] = "";

							}
							else {
								projectTaskArray[projectId]["Select Task"] = "";
							}
							projectTaskArray[projectId][taskName] = taskId;
						} else {
							projectTaskArray[projectId][taskName] = taskId;
						}
					}
					resultIndex += 1000;
				} while (resultSet.length >= 1000);


				return projectTaskArray;
			} catch (err) {
				log.error("Error in returnProjectTaskSelectionOptions", err);
			}
		}
		function validateValue(value) {
			try {
				if (value == '' || value == undefined || value == null) {
					return true;
				}
			} catch (err) {
				log.debug("Error in validateValue", err);
			}
		}

		return {
			onRequest: onRequest
		};

	});