(function () {
  'use strict';
//  
//Name: Thada Wangthammang
//Github: https://github.com/mildronize/R2ALS-app
//E-mail: mildronize@gmail.com
//
//  "study-result-page" Section
var models;
var prefix_link = "#/";
  
function initialModels(){
	models = {};
	models.member = {};
	//  models type
	//  - array-of-semester
	//  - array-of-subject
	models.type = "array-of-semester";
	models.is_testing = true;
	models.semesters = [];
}
  
function isBrowserSupportStorage(){
	  // Check browser support
	if (typeof(Storage) != "undefined")return true;
	else {
		console.log("Sorry, your browser does not support Web Storage...");
		return false;
	}
}
  
function initialLocalStorage(){
	if (isBrowserSupportStorage()) {
//		console.log(localStorage.getItem("models"));
		if(localStorage.getItem("models") == null)
			initialModels();
	}
}

function updateLocalStorage(){
	if (isBrowserSupportStorage()) {
		localStorage.setItem("models", JSON.stringify(models));
		console.log(JSON.parse(localStorage.getItem("models")));
	}
}

function loadLocalStorage(){
	if (isBrowserSupportStorage) {
		if(localStorage.getItem("models") != null)
			models = JSON.parse(localStorage.getItem("models"));
	}
}
 
function validateData(){
//    console.log("validateData");
}
	
function capitaliseFirstLetter(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}
	
  var n = 0;

  Polymer('main-app', {
    // initialize the element's model
    ready: function () {
      console.log("App ready");
      var current_url = document.URL.toString();
      var len = current_url.length - 2;
      var str_ck = current_url.substr(len);
      if(str_ck != "#/" & str_ck.charAt(1) == '/' ){
        location.href = prefix_link;
      }
      console.log(str_ck);
      console.log(document.URL);
      
      initialLocalStorage();
    },
    stateChange: function (event) {
      //   console.log(document.querySelector('study-result-page'));
      console.log("Event: " + event); 
      n += 1;
    },
//    storageIdChanged: function() {
////      console.log(this.storageId);
//      this.storage = document.querySelector('#' + this.storageId);
//      if (this.storage) {
//          models = this.storage.value;
//      }
//    }
    
    
  });
  
  Polymer('home-page', {
    created: function() { 
      loadLocalStorage();
      console.log(models);
      if('name' in models.member){
        this.name = models.member.name;
      }
    },
    nameChanged: function(oldValue, newValue) {
      models.member.name = this.name;
      updateLocalStorage();
    },
    onEnter: function(event){
      location.href = prefix_link + this.$.anchor.getAttribute("page");
    }
  });
  
  Polymer('profile-page', {
    created: function() { 
		loadLocalStorage();
		this.subject_group = models.member.subject_group;
		this.branch = models.member.branch;
    },
    subject_groupChanged: function(oldValue, newValue) {
		models.member.subject_group = newValue;
		//      console.log(newValue);
		updateLocalStorage();
    },
    branchChanged: function(oldValue, newValue) {
		models.member.branch = newValue;
		//      console.log(newValue);
		updateLocalStorage();
    },
    onEnter: function(event){
      location.href = prefix_link + this.$.anchor.getAttribute("page");
    }
  });
    
  Polymer('study-result-page', {
    // initialize the element's model
 
    created: function() { 
      loadLocalStorage();
      this.hideMessage = false;
      this.subjectInSemesters = models.semesters;
      this.changeData();
    },
    ready: function () {
      console.log("study-result-page ready " + n);
      this.initialData();
    },

    toggleDialog: function () {
      this.$.addSubjectItem.toggle();
    },
    initialData: function (){
      this.tempSubjectData = {};
      this.tempSubjectData.gradeOption = "credit";
    },
    clearData: function (){
      var tempYear,tempSemester;
      if (this.tempSubjectData.year & this.tempSubjectData.semester){
        tempYear = this.tempSubjectData.year;
        tempSemester = this.tempSubjectData.semester;
        this.initialData();
        this.tempSubjectData.year = tempYear;
        this.tempSubjectData.semester = tempSemester;
      }else {
        this.initialData();
      }
    },
    addSubject: function (){
      var found = false;
      console.log(this.tempSubjectData);
      if(this.subjectInSemesters.length > 0){
        
        for(var i=0 ;i< this.subjectInSemesters.length; i++){
          var subjectInSemester = this.subjectInSemesters[i];
          console.log(this.tempSubjectData);
          if(subjectInSemester.year == this.tempSubjectData.year & subjectInSemester.semester == this.tempSubjectData.semester){
            this.subjectInSemesters[i].subjects.push(this.tempSubjectData);
            found = true;
            break;
          }
        }

      }
      // If not found the semester
      if(!found | this.subjectInSemesters.length == 0) {
        var tmp = this.addSemester(this.tempSubjectData.year, this.tempSubjectData.semester);
        tmp.subjects.push(this.tempSubjectData);
        }
      this.subjectInSemesters.sort(function(a, b){
        if (a.year == b.year){
          return a.semester-b.semester;
        }else {
          return a.year-b.year;
        }
      });
    },
    buttonAdd: function (){
      console.log("clicked");
      this.addSubject();
      this.clearData();
      this.changeData();
    },
    addSemester: function (year,semester){
      var tmp = {
        'year': year,
        'semester': semester,
        'subjects': []
      };
      this.subjectInSemesters.push(tmp);
      return tmp;
    },
    deleteSemester: function (item){
      var i = this.subjectInSemesters.indexOf(item);
      if (i >= 0) {
          this.subjectInSemesters.splice(i, 1);
      }else{
        console.error("Not found subjectInSemester object: ");
      }
    },
    changeData: function(){
      models.semesters = this.subjectInSemesters;
      if ( this.subjectInSemesters.length == 0 | typeof this.subjectInSemesters === 'undefined' ) {
        this.hideMessage = false;
      }else {
        this.hideMessage = true;
      }
      updateLocalStorage();
    },
    changeItemAction: function(e, detail) {
      //      clear semester if it is null
      if ( detail.subjectInSemester.subjects.length == 0 ){
        this.deleteSemester(detail.subjectInSemester);
      }
      this.changeData();
    },
    editItemAction:  function(e, detail) {
//      console.log("555");
      console.log(detail);
//      this.tempSubjectData = detail.subject;
//      this.$.addSubjectItem.toggle();
    }
    
  });
  
  
  
  Polymer('get-plans-page', {
    created: function() { 
      validateData();
      this.tabSelected = "cozy-view";
//      this.tabSelected = "compact-view";
      this.loading_layout = false;
    },
    ready: function () {
//      this.models = models;
        loadLocalStorage();
        this.json = JSON.stringify(models, null, 4);
        this.input = models;
//        this.$.compact_view.hidden = false;
//        this.$.full_detail_view.hidden = false;
//        this.$.json_view.hidden = false;

        console.log(this.pathArg1);
    },
    attached: function () { 
      if(this.pathArg1 == "" )
      console.log(this.pathArg1);

    },
    domReady: function (){
      this.$.compact_view.hidden = true;
      this.$.full_detail_view.hidden = true;
      this.$.json_view.hidden = true;
      this.$.cozy_view.hidden = false; 
      
      
    },
    compactButHandler: function(event,detail,sender){
      console.log("compactButHandler");
      this.$.compact_view.hidden = false;
      this.$.full_detail_view.hidden = true;
      this.$.json_view.hidden = true;
      this.$.cozy_view.hidden = true; 
      console.log(this.pathArg1);
    },
    fullButHandler: function(event,detail,sender){
      console.log("fullButHandler");
      this.$.compact_view.hidden = true;
      this.$.full_detail_view.hidden = false;
      this.$.json_view.hidden = true;
      this.$.cozy_view.hidden = true; 
    },
    jsonButHandler: function(event,detail,sender){
      console.log("jsonButHandler");
      this.$.compact_view.hidden = true;
      this.$.full_detail_view.hidden = true;
      this.$.json_view.hidden = false;
      this.$.cozy_view.hidden = true; 
    },
    cozyButHandler: function(event,detail,sender){
      console.log("jsonButHandler");
      this.$.compact_view.hidden = true;
      this.$.full_detail_view.hidden = true;
      this.$.json_view.hidden = true;
      this.$.cozy_view.hidden = false; 
    },
    handleError: function(e){
        var xhr = e.detail.xhr;
        this.messageHeading = "Error";
        this.messageBody = [];
        this.messageBody[0] = "The service is unavailable or too busy.";
        this.messageBody[1] = xhr.status + " " + xhr.statusText;
        this.messageBody[2] = " " + xhr.responseURL;
        this.$.messageDialog.toggle();
        console.log(e);
        console.error(this.messageBody[1] + this.messageBody[2]);
        this.$.loading.active = false;
        this.loading_layout = true;
//        console.log(models);
    },
    handleResponse: function(e){
//      console.log(e);
      if(e.detail.xhr.status != 0){
        this.response = e.detail.response;
        
        if( this.response.type != "success"){
          this.messageHeading = capitaliseFirstLetter(this.response.type);
          this.messageBody = [];
          this.messageBody[0] = this.response.message;
          this.$.messageDialog.toggle();
        }
        else{
          this.responseReady();
        }
      }else {
        this.messageHeading = "Error";
        this.messageBody = [];
        this.messageBody[0] = "The service is unavailable";
        this.$.messageDialog.toggle();
        console.error("The service is unavailable");
      }
      this.$.loading.active = false;
      this.loading_layout = true;
    },
    responseReady: function(){
//        this.current_plan = response.data.plans[this.solution_id];
        this.solution_id = 0;
        this.display_solution_id = 1;
        this.refresh = true;
        this.solution_length = this.response.data.plans.length;
        this.updateSolution();
//        this.initialCozyView();
//        console.log(this.cozy_view.polymerObj);
//        var bsl = new BoxStackList(this.cozy_view.polymerObj, "box-stack-list");
        
    },
    updateSolution: function(){
        this.current_plan = this.response.data.plans[this.solution_id];
    },
    getNextSolution: function(){
        if(this.solution_id < this.solution_length-1){
          console.log(this.solution_id);
          console.log(this.solution_length);
          this.solution_id ++;
          this.display_solution_id = this.solution_id + 1;
          console.log(this.solution_id);
          this.updateSolution();
        }
      },
    getPreviousSolution: function(){
        if(this.solution_id > 0){
          this.solution_id --;
          this.display_solution_id = this.solution_id + 1;
//          console.log(this.solution_id);
          this.updateSolution();
        }
      },
    refreshSolution: function(){
      this.refresh = !this.refresh;
    }
    
    
  });
  

  
})();