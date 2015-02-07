(function () {
  'use strict';
//  
//Name: Thada Wangthammang
//Github: https://github.com/mildronize/R2ALS-app
//E-mail: mildronize@gmail.com
//
//  "study-result-page" Section
  var models = {};
  models.member = {};
//  models type
//  - array-of-semester
//  - array-of-subject
  models.type = "array-of-semester";
  models.semesters = [];
  function validateData(){
    console.log("validateData");
  }
  var n = 0;

  Polymer('main-app', {
    // initialize the element's model
    ready: function () {
      console.log("App ready");
      location.href = "#/";
    },
    stateChange: function (event) {
      //   console.log(document.querySelector('study-result-page'));
      console.log("Event: " + event); 
      n += 1;
    }
  });
  
  Polymer('home-page', {
    created: function() { 
      this.name = models.member.name;
    },
    nameChanged: function(oldValue, newValue) {
      models.member.name = this.name;
      console.log(this.name);
    }
  });
  
  Polymer('profile-page', {
  
  });
    
  Polymer('study-result-page', {
    // initialize the element's model
 
    created: function() { 
      this.hideMessage = false;
      this.subjectInSemesters = models.semesters;
      this.changeData();
    },
    ready: function () {
      console.log("study-result-page ready " + n);
      this.initialData();
//            this.message = {};
//      this.subjectInSemesters = [];
//      this.subjectInSemesters = [];
//      this.changeData();
    },
//    showMessage: function (msg){
//      this.message.data = msg;
//      this.message.isVisible = true;
//    },
//    hideMessage: function (){
//      this.message = {};
//    }, 
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
//      console.log(typeof this.subjectInSemesters);
      console.log("Some data is changed");
      models.semesters = this.subjectInSemesters;
      if ( this.subjectInSemesters.length == 0 | typeof this.subjectInSemesters === 'undefined' ) {
        this.hideMessage = false;
      }else {
        this.hideMessage = true;
      }
      
    },
    changeItemAction: function(e, detail) {
      //      clear semester if it is null
      if ( detail.subjectInSemester.subjects.length == 0 ){
        this.deleteSemester(detail.subjectInSemester);
      }
      this.changeData();
    }
    
  });
  
  Polymer('get-plans-page', {
    created: function() { 
      validateData();
    },
    ready: function () {
      this.json = JSON.stringify(models, null, 4);
    },
    sendData: function(){
    
    },
    handleResponse: function(e){
      this.response = e.detail.response;
    }
    
    
  });
  

  
})();