
function BoxStackList(polymerObj,selector){
      this.boxLists = [];
      this.widthMargin = 20;
      this.HeightMargin = 10;
      this.width = 80;
//      this.currentzindex = 0;
      
//      this.initialHeader = function(extendBoxList){
//         $(  polymerObj.$[header_selector].querySelectorAll(".header")).each(function( index ) {
//          $( this ).css("position","absolute");
//          $( this ).css("z-index","0");
//          var list_id = parseInt($( this ).attr("list-id"));
////          console.log(index + ": " + list_id);
////          console.log(index + " ? " + boxLists.length);
////          console.log($( this ).css("height"))
//          if(list_id >= boxLists.length | boxLists.length == 0){
//            boxLists = extendBoxList(boxLists, list_id+1);
//          }
//          boxLists[list_id].push($( this ));
//        });
//        return boxLists;
//      };

  
      this.initialBoxList = function(boxLists, selector, extendBoxList){
//        console.log(polymerObj.$[selector].querySelectorAll(".box"));
//        console.log($(  polymerObj.$[selector].querySelectorAll(".box")));
        
        $(  polymerObj.$[selector].querySelectorAll(".box")).each(function( index ) {
          $( this ).css("position","absolute");
          $( this ).css("z-index","0");
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
      
      
      this.rearrangeBoxList = function(){
        console.log(this.boxLists);
        var accumulatedWidth = 0;
        var accumulatedHeight, last_height=0;
        
        for(var i=0;i < this.boxLists.length;i++){
          if(i!=0)
            accumulatedWidth += this.width + this.widthMargin;
          var boxList = this.boxLists[i];
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
        console.log("rearrangeBoxList");
      };
      
      this.autoFit = function(boxLists, list_id, isSwap, movedbox){
        console.warn("autoFit");
        var accumulatedHeight, last_height=0;
        var accumulatedWidth = (this.width + this.widthMargin) * list_id;
        var boxList = boxLists[list_id];
//        var boxx = [];
//        var boxy = [];
//        for(var j=0;j < boxList.length; j++){
//          boxx[j] = parseInt(boxList[j].css("x").replace("px",""));
//          boxy[j] = parseInt(boxList[j].css("y").replace("px",""));
//        }
        accumulatedHeight = 0;
        for(var j=0;j < boxList.length; j++){
          var str_tmp = boxList[j].css("height");
          var height = parseInt(str_tmp.replace("px",""));

          if(j!=0){
            accumulatedHeight += last_height + this.HeightMargin;
          }
//          var x = boxx[j];
//          var y = boxy[j];
          var x = parseInt(boxList[j].css("x").replace("px",""));
          var y = parseInt(boxList[j].css("y").replace("px",""));
//          if(isSwap) console.log(x+" ? "+accumulatedWidth+" / " + y + " ? " + accumulatedHeight);
//          if (x == accumulatedWidth & y == accumulatedHeight){
//            // Nothing changed
//          }else
          if(movedbox != null){
            if(movedbox.attr("box-id") == boxList[j].attr("box-id")){
              if (isSwap){

                boxList[j]
                  .transition({ scale: 1.2})
                  .transition({ "y": accumulatedHeight+"px" })
                  .transition({ "x": accumulatedWidth+"px" })
                  .transition({ scale: 1.0});
              }else{

                boxList[j]
                  .transition({ scale: 1.2})
                  .transition({ "x": accumulatedWidth+"px" })
                  .transition({ "y": accumulatedHeight+"px" })     
                  .transition({ scale: 1.0});

              }
            }
          }
          else if(!(x == accumulatedWidth & y == accumulatedHeight)){
            
            if (isSwap){
//              console.log("1.move) "+ boxList[j].text()+" " + x+" ? "+accumulatedWidth+" / " + y + " ? " + accumulatedHeight);
              boxList[j]
                .transition({ "y": accumulatedHeight+"px" })
                .transition({ "x": accumulatedWidth+"px" });
            }else{
//              console.log("1.remove) "+ boxList[j].text()+" " + x+" ? "+accumulatedWidth+" / " + y + " ? " + accumulatedHeight);
              boxList[j]
                .transition({ "x": accumulatedWidth+"px" })
                .transition({ "y": accumulatedHeight+"px" });
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
            this.autoFit(this.boxLists, list_id, false, null);
            return true;
          }
        }
        console.error(box_id +" "+ list_id +" "+  this.boxLists[list_id].length);
        return false;
      }
      
      this.moveBox = function(box, target_list_id){
//          var box_id = box.index();
          var isSwap, old_list_id;
          var list_id = box.attr("list-id");
          console.log(this.boxLists);
          if (this.removeBox(box)){
              old_list_id = target_list_id;
//              old_list_id = list_id;
//              list_id -= 1;
//              if (list_id < 0){
//                list_id = this.boxLists.length-1;
//              }
              box.attr("list-id", target_list_id);
              if(target_list_id >= this.boxLists.length | this.boxLists.length == 0){
                this.boxLists = this.extendBoxList(this.boxLists, target_list_id+1);
              }
              this.boxLists[target_list_id].push(box);
              if(this.boxLists[old_list_id].length <= this.boxLists[target_list_id].length)
                isSwap = true;
              else isSwap = false;
              box.css("z-index", '+=1');
              this.autoFit(this.boxLists, target_list_id, isSwap, box);
              
//              console.log(this.boxLists);
          }
          
      };
      
      this.boxLists = this.initialBoxList(this.boxLists, selector, this.extendBoxList);
      this.rearrangeBoxList();
//      console.log(this.boxLists);
    }
