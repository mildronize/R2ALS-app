function ExportJointJS (data) {
	this.data = data;
    this.width = 100;
    this.height = 40;

    this.offset_start_x = 30;
    this.offset_start_y = 30;

    this.offset_width = 50;
    this.offset_height = 40;

    this.offset_height_non_prereq = 15;
	
	this.last_year = data.last_year;
	this.last_semester = data.last_semester;

	this.initialZeroList = function(last_semester_id_plan){
		lists = [];
		last_semester_id_plan += 1;
		for( var i = 0; i < last_semester_id_plan;i++)
            lists.push(0);
        return lists;
	}
		
    this.list_num_subject = this.initialZeroList(data.last_semester_id_plan);

	
	this.addList_num_subject = function(index, hasPrerequisite, offset){
        this.list_num_subject[index] += this.height
        if(hasPrerequisite)
            this.list_num_subject[index] += this.offset_height;
        else
            this.list_num_subject[index] += this.offset_height_non_prereq;
        this.list_num_subject[index] += offset;
	}
	
	this.semesterToCoordinate = function(semesterIndex){
        return {
            'x': this.offset_start_x + semesterIndex * (this.width + this.offset_width),
            'y': this.offset_start_y + this.list_num_subject[semesterIndex],
        }
	}
	
	this.compare_semester = function(year1, semester1, year2, semester2){
        if(year1 > year2)
            return 1;
        else if(year1 < year2)
            return -1;
        else {
            if(semester1 > semester2)
                return 1;
            else if(semester1 < semester2)
                return -1;
            else
                return 0;
		}
	}
	
	this.createSemesterHeader = function(semesterIndex, year, semester, total_credit){
        coordinate = this.semesterToCoordinate(semesterIndex)
        x = coordinate.x
        y = coordinate.y
        semester_id = 'semester-label-'+year+'-'+semester;
        name = year+' / ' + semester + '('+total_credit+')';
		this.addList_num_subject(semesterIndex, true, 0);
        return new joint.shapes.basic.Rect({
            "id": semester_id,
            "type": "basic.Rect",
            "attrs": { "text": {
                         "text": name,
                         "font-size": 20,
                         'font-weight': 'bold'
                        },
                        "rect" : {
                         "stroke-width": 1
                        }
                     },
            "position":{"x": x,"y": y},
            "size":{"width": this.width,"height":this.height},
            "angle": 0,
            "z": 1
        });
	}
	
    this.createSubjectRect = function(subjectObj){
		var semesterIndex = subjectObj.semesterIndex;

		var subjec_id = subjectObj.id;
		var name = subjectObj.name;
		if('grade' in data)
		  name += ' ('+subjectObj.grade+')';
		else
		  name += ' ('+subjectObj.credit+')';

		coordinate = this.semesterToCoordinate(semesterIndex)

		this.addList_num_subject(semesterIndex, subjectObj.hasPrerequisite, 0);

		x = coordinate.x;
		y = coordinate.y;

		cmp_semester = this.compare_semester(subjectObj.year, 
											 subjectObj.semester,
											 this.last_year,
											 this.last_semester)
		if(cmp_semester <= 0)
			rect_fill = "#666666";
		else{
			if( subjectObj.hasPrerequisite)
				rect_fill = "green";
			else
				rect_fill = "#3498DB";
		}

		return new joint.shapes.basic.Rect({
            "id": subjec_id,
            "type": "basic.Rect",
            "attrs": { "text": {
                         "text": name,
                         "fill": "white",
                         "font-family": "sans-serif" },
                      "rect": {
                         "fill": rect_fill,
                         "stroke": "white",
                         "rx": 5,
                         "ry": 5 } },
            "position":{"x": x,"y": y},
            "size":{"width": this.width,"height":this.height},
            "angle": 0,
            "z": 1
        });
	}
	
	this.createLink = function(obj){
        link_id = 'link' + obj.source + '-'+obj.target;
        source = obj.source
        target = obj.target
        return {
            "id": link_id,
            "type": "link",
            "source": { "id": source},
            "target": { "id": target},
            "z": 0,
            "router": { "name": "manhattan" },
            "connector": { "name": "rounded" },
            "attrs": {
                ".marker-source": { "d": "M 10 0 L 0 5 L 10 10 z" }
            }
        }
	}
	
	this.getCells = function(){
        lists = [];
		//  Add Semester Header item
		for(var i = 0; i < this.data.semesters.length;i++){
			var semester = this.data.semesters[i];
			lists.push(this.createSemesterHeader(i, semester.year, 
												 semester.semester, 
												 this.data.total_credits[i]));
		}
		//  Add Subject item
        for(var i = 0; i < this.data.semesters.length;i++){
			var subjects = this.data.semesters[i].subjects;
			for(var j=0;j < subjects.length; j++){
//				console.log(subjects[j]);
				lists.push(this.createSubjectRect(subjects[j]));
//				console.log(this.createSubjectRect(subjects[j]));
			}
		}
		// Link item
		for(var i = 0; i < this.data.links.length;i++){
			lists.push(this.createLink(this.data.links[i]));
		}
		return lists;
    }

}
 

    
    

//    

//    function createSubjectRect(data){
//      
//        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//        var semesterIndex = data.semesterIndex;
//      
//      
//        var subjec_id = data.id;
//        var name = data.name;
//        if('grade' in data):
//            name += ' ('+str(data.grade)+')';
//        else:
//            name += ' ('+str(data.credit)+')';
//
//        coordinate = self.semesterToCoordinate(semesterIndex)
//
//        self.addList_num_subject(semesterIndex, obj['hasPrerequisite'], 0)
//
//        x = coordinate['x']
//        y = coordinate['y']
//
//        cmp_semester = self.si.compare_semester(obj['year'], obj['semester'],
//                                                self.last_year,
//                                                self.last_semester)
//        if cmp_semester < 0 or cmp_semester == 0:
//            rect_fill = "#666666"
//        else:
//            if obj['hasPrerequisite']:
//                rect_fill = "green"
//            else: rect_fill = "#3498DB"
//            
//      return new joint.shapes.basic.Rect({
//          id: subjec_id,
//          type: "basic.Rect",
//          attrs: { text: {
//                       text: name,
//                       fill: 'white',
//                       font-family: 'sans-serif' },
//                    rect: {
//                       fill: rect_fill,
//                       stroke: 'white',
//                       rx: 5,
//                       ry: 5 } },
//          position:{x: x,y: y},
//          size:{width: self.width,height:self.height},
//          angle: 0,
//          z: 1
//      });
//      
//    }
//    