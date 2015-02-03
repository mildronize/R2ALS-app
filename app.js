(function () {
  'use strict';
//  
//Name: Thada Wangthammang
//Github: https://github.com/mildronize/R2ALS-app
//E-mail: mildronize@gmail.com
//
//  "study-result-page" Section

  var n = 0;

  Polymer('main-app', {
    // initialize the element's model
    ready: function () {
      console.log("App ready");
    },
    stateChange: function (event) {
//              console.log(document.querySelector('study-result-page'));
      console.log("Event: " + event); 
      n += 1;
    }
  });
    

  Polymer('study-result-page', {
    // initialize the element's model
    ready: function () {
      console.log("study-result-page ready " + n);
      this.initialData();
      this.subjectInSemesters = [];
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
    changeItemAction: function(e, detail) {
//      clear semester if it is null
      if ( detail.subjectInSemester.subjects.length == 0 ){
        this.deleteSemester(detail.subjectInSemester);
      }
    }
    
    

  });

  
})();