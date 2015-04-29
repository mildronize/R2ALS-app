(function () {
  'use strict';
//
//Name: Thada Wangthammang
//Github: https://github.com/mildronize/R2ALS-app
//E-mail: mildronize@gmail.com

// Server config
var host = "http://127.0.0.1"
var port = 6543;

// Initial var
var models;
var prefix_link = "#/";
var server_host = host + ":" + port;

function initialModels(){
	models = {};
	models.member = {};
	//  models type
	//  - array-of-semester
	//  - array-of-subject
    // currently support only array-of-semester
	models.type = "array-of-semester";
	models.is_testing = false;
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

function updateLocalStorage(name, data){
	if (isBrowserSupportStorage()) {
		localStorage.setItem(name , JSON.stringify(data));
//		console.log(JSON.parse(localStorage.getItem(name)));
	}
}

function loadLocalStorage(name){
	if (isBrowserSupportStorage) {
		if(localStorage.getItem(name) != null)
			return JSON.parse(localStorage.getItem(name));
	}
    return null;
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
      this.server_host = server_host;
      var tmp = loadLocalStorage("models");
      if(tmp != null) models = tmp;
      console.log(models);
      if('name' in models.member){
        this.name = models.member.name;
      }
    },
    nameChanged: function(oldValue, newValue) {
      models.member.name = this.name;
      updateLocalStorage("models", models);
    },
    onEnter: function(event){
      location.href = prefix_link + this.$.anchor.getAttribute("page");
    }
  });

  Polymer('profile-page', {
    created: function() {
        this.server_host = server_host;
		var tmp = loadLocalStorage("models");
        if(tmp != null) models = tmp;
		this.subject_group = models.member.subject_group;
		this.branch = models.member.branch;
    },
    subject_groupChanged: function(oldValue, newValue) {
		models.member.subject_group = newValue;
		//      console.log(newValue);
		updateLocalStorage("models", models);
    },
    branchChanged: function(oldValue, newValue) {
		models.member.branch = newValue;
		//      console.log(newValue);
		updateLocalStorage("models", models);
    },
    onEnter: function(event){
      location.href = prefix_link + this.$.anchor.getAttribute("page");
    }
  });

  Polymer('study-result-page', {
    // initialize the element's model

    created: function() {
    
      this.server_host = server_host;
      var tmp = loadLocalStorage("models");
      if(tmp != null) models = tmp;
      this.dialogMode = "add";
      this.subject_group = models.member.subject_group;
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
//          console.log(this.tempSubjectData);
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
      if(this.dialogMode =="add")
        this.addSubject();
      else if(this.dialogMode =="edit"){
        this.editSubject();
        this.dialogMode = "add";
        this.toggleDialog();
        }
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
      updateLocalStorage("models", models);
    },
    changeItemAction: function(e, detail) {
      //      clear semester if it is null
      if ( detail.subjectInSemester.subjects.length == 0 ){
        this.deleteSemester(detail.subjectInSemester);
      }
      this.changeData();
//      console.log("aaa");
    },
    editItemAction:  function(e, detail) {
//      console.log("555");
      this.dialogMode = "edit";
//      console.log("bbb");
//      console.log("cache");

      this.tempSubjectData = detail.subject;
      this.old_semester = detail.subject.semester;
      this.old_year = detail.subject.year;
      this.toggleDialog();
    },
    editSubject: function(){
//      console.log(this.tempSubjectData);
      if(this.tempSubjectData.year == this.old_year &  
         this.tempSubjectData.semester == this.old_semester){
        var semesterChanged = false;
      }else 
        var semesterChanged = true;
      console.log("AHello: "+semesterChanged);
      console.log(this.tempSubjectData);
      console.log(this.old_year + " / " + this.old_semester);
      if(this.subjectInSemesters.length > 0){
        
        for(var i=0 ;i< this.subjectInSemesters.length; i++){
          var subjectInSemester = this.subjectInSemesters[i];
//          console.log(this.tempSubjectData);
          if(subjectInSemester.year == this.old_year & subjectInSemester.semester == this.old_semester){
//            this.subjectInSemesters[i].subjects.push(this.tempSubjectData);
//            found = true;
            for(var j = 0; j < this.subjectInSemesters[i].subjects.length;j++){
               if (this.subjectInSemesters[i].subjects[j].id == this.tempSubjectData.id){
                 console.log("Hello: "+semesterChanged);
                  if(semesterChanged == false)
                    this.subjectInSemesters[i].subjects[j] = this.tempSubjectData;
                  else {
                    this.subjectInSemesters[i].subjects.splice(j, 1);
                    if ( this.subjectInSemesters[i].subjects.length == 0 ){
                      this.subjectInSemesters.splice(i, 1);
                    }
                    this.addSubject();
                    this.changeData();
                  }
                  break;
               }
            }
            break;
          }
        }
      }
    }

  });



  Polymer('get-plans-page', {
    created: function() {
      this.server_host = server_host;
      validateData();
      this.defaultView = "compact";
//      this.tabSelected = "cozy-view";
//      this.tabSelected = "compact-view";
      this.loading_layout = false;
//      this.refreshRequest = true;
//      this.show = true;
//      this.mylists = [
//        {view: 'compact', active: true},
//        {view: 'json', active: true},
//        {view: 'cozy', active: false}
//      ];
      this.getPlansView = {
        'compact': false,
        'json': false,
        'full-detail': false,
        'cozy': false
      };
      this.currentView = this.defaultView;
//      this.resetView();
    },
    resetView: function(){
      for(var index in this.getPlansView) { 
         if (this.getPlansView.hasOwnProperty(index)) {
             this.getPlansView[index] = false;
         }
      }
    },
    activeView: function(getPlansView){
      this.resetView();
      this.currentView = getPlansView;
      this.getPlansView[getPlansView] = true;
    },
    ready: function () {
//      this.models = models;
        var tmp = loadLocalStorage("models");
        if(tmp != null) models = tmp;
        this.json = JSON.stringify(models, null, 4);
        this.input = models;
//        this.refresh = true;
        tmp = loadLocalStorage("plans");
        if(tmp == null) 
          this.requestPlans();
        else{
          this.response = tmp;
          this.responseReady();
          this.$.loading.active = false;
          this.loading_layout = true;
        }
    },
    attached: function () {
      console.log(this.pathArg1);
      console.log(this.pathArg2);
//      if(this.pathArg2 != ""){
//        this.solution_id = parseInt(this.pathArg2) - 1;
//        this.display_solution_id = parseInt(this.pathArg2);
//        this.updateSolution();
//      }
      if(this.pathArg1 in this.getPlansView) 
        this.activeView(this.pathArg1);
      else
        this.activeView(this.defaultView);
    },
    requestPlans: function(){
//      this.refreshRequest = !this.refreshRequest;
//      this.refresh = !this.refresh;
      this.$.request.go();
      this.$.loading.active = true;
      this.loading_layout = false;
    },
    tabHandler: function(event,detail,sender){
      var clickedTab = sender.getAttribute('name');
      this.activeView(clickedTab);
      window.history.pushState("object or string", clickedTab, "#/get-plans/"+clickedTab);
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
          for(var i =0;i< this.response.message.length;i++)
            this.messageBody[i] = this.response.message[i];
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
        console.log(this.response);
        console.log("responseReady");
        updateLocalStorage("plans", this.response);
        this.solution_id = 0;
        this.display_solution_id = 1;
        this.solution_length = this.response.data.plans.length;
        this.updateSolution();
//        this.initialCozyView();
//        console.log(this.cozy_view.polymerObj);
//        var bsl = new BoxStackList(this.cozy_view.polymerObj, "box-stack-list");
        console.log("responseReady");
//        this.$.request.auto = false;
    },
    updateSolution: function(){
        this.current_plan = this.response.data.plans[this.solution_id];
        console.log("updateSolution");
    },
    showGuide: function(){
      this.$.guideDialog.toggle();
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
//    refreshSolution: function(){
//      this.refresh = !this.refresh;
//      console.log("refreshSolution");
//    },
    current_planChanged : function(){
      console.log("plan changed") ;
      console.log(this.current_plan);
    }


  });



})();
