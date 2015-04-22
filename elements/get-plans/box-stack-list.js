    function BoxStackList(box_container){
//      this.box_container = box_container;
      this.boxLists = [];
      this.widthMargin = 20;
      this.HeightMargin = 10;
      this.width = 100;
      
      this.initialBoxList = function(boxLists, box_container, extendBoxList){
//        console.log($( box_container.selector + " .box" ));
        $( box_container.selector + " .box" ).each(function( index ) {
          $( this ).css("position","absolute");
          var list_id = parseInt($( this ).attr("list-id"));
//          console.log(index + ": " + list_id);
//          console.log(index + " ? " + boxLists.length);
//          console.log($( this ).css("height"))
          if(list_id >= boxLists.length | boxLists.length == 0){
            boxLists = extendBoxList(boxLists, list_id+1);
          }
          boxLists[list_id].push($( this ));
        });
        return boxLists;
      };

      this.extendBoxList = function(boxLists, target_length){
        for(var i = boxLists.length; i< target_length;i++){
//          console.log(i);
          boxLists.push([]);
        }
//        console.log("result " + boxLists.length);
        return boxLists;
      };
      
      
      this.rearrangeBoxList = function(boxLists){
//        console.log(boxLists);
        var accumulatedWidth = 0;
        var accumulatedHeight, last_height=0;
        
        for(var i=0;i < boxLists.length;i++){
          if(i!=0)
            accumulatedWidth += this.width + this.widthMargin;
          var boxList = boxLists[i];
          accumulatedHeight = 0;
          for(var j=0;j < boxList.length; j++){
            var str_tmp = boxList[j].css("height");
            var height = parseInt(str_tmp.replace("px",""));
            
            if(j!=0){
              accumulatedHeight += last_height + this.HeightMargin;
            }
            if (boxList[j].css("left") != accumulatedWidth | boxList[j].css("top") != accumulatedHeight){
//              boxList[j].animate({ "left": accumulatedWidth+"px" },{
//                queue: false,
//                duration: 750
//              });
//              boxList[j].animate({ "top": accumulatedHeight+"px" },{
//                queue: false,
//                duration: 750
//              });
              boxList[j].transition({ "x": accumulatedWidth+"px" },{queue: false});
              boxList[j].transition({ "y": accumulatedHeight+"px" },{queue: false});
            }
            last_height = height;
            }
        }
//        console.log("rearrangeBoxList");
      };
      
      this.autoFit = function(boxLists, list_id, isSwap){
        var accumulatedHeight, last_height=0;
        var accumulatedWidth = (this.width + this.widthMargin) * list_id;
        var boxList = boxLists[list_id];
        accumulatedHeight = 0;
        for(var j=0;j < boxList.length; j++){
          var str_tmp = boxList[j].css("height");
          var height = parseInt(str_tmp.replace("px",""));

          if(j!=0){
            accumulatedHeight += last_height + this.HeightMargin;
          }
          if (boxList[j].css("left") != accumulatedWidth | boxList[j].css("top") != accumulatedHeight){
//            boxList[j].animate({ "left": accumulatedWidth+"px" },{
//              queue: false,
//              duration: 750
//            });
//            boxList[j].animate({ "top": accumulatedHeight+"px" },{
//              queue: false,
//              duration: 750
//            });
            if (isSwap){
              boxList[j].transition({ "y": accumulatedHeight+"px" },{queue: true});
              boxList[j].transition({ "x": accumulatedWidth+"px" },{queue: true});
            }else{
              boxList[j].transition({ "x": accumulatedWidth+"px" },{queue: true});
              boxList[j].transition({ "y": accumulatedHeight+"px" },{queue: true});
            }
          }
          last_height = height;
          }

      }
      
      this.removeBox = function(box){
        var box_id = box.index();
        var list_id = box.attr("list-id");
        for( var i =0;i< this.boxLists[list_id].length;i++){
          if(this.boxLists[list_id][i].index() == box_id){
            this.boxLists[list_id].splice(i, 1);
//            this.rearrangeBoxList(this.boxLists, );
            this.autoFit(this.boxLists, list_id, false);
            return true;
          }
        }
        console.error(box_id +" "+ list_id +" "+  this.boxLists[list_id].length);
        return false;
      }
      
      this.moveBox = function(box){
          var box_id = box.index();
          var isSwaping, old_list_id;
          var list_id = box.attr("list-id");
          console.log(this.boxLists);
          if (this.removeBox(box)){
              old_list_id = list_id;
              list_id -= 1;
              if (list_id < 0){
                list_id = this.boxLists.length-1;
              }
              box.attr("list-id", list_id);
              this.boxLists[list_id].push(box);
              if(this.boxLists[old_list_id].length <= this.boxLists[list_id].length)
                isSwaping = true;
              else isSwaping = false;
              this.autoFit(this.boxLists, list_id, isSwaping);
              console.log(this.boxLists);
          }
          
      };
      
      this.boxLists = this.initialBoxList(this.boxLists, box_container, this.extendBoxList);
      this.rearrangeBoxList(this.boxLists);
//      console.log(this.boxLists);
    }