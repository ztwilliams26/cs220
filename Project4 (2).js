let rawData = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');



class FluentRestaurants{
  constructor(jsonData){
    this.data=jsonData;
  }

  fromState (stateStr){
    if(typeof stateStr !== 'string'){
      return this;
    }
    let newData=[];
    for(let i=0; i<this.data.length; ++i){
      let curState = lib220.getProperty(this.data[i],'state');
      if(curState.found===true && curState.value===stateStr){
        newData.push(this.data[i]);
      }
    }
    return new FluentRestaurants(newData);
  }

  ratingLeq(rating){
    if(typeof rating !== 'number'){
      return this;
    }
    let newData=[];
    for(let i=0; i<this.data.length; ++i){
      let curStar = lib220.getProperty(this.data[i],'stars');
      if(curStar.found===true && curStar.value<=rating){
        newData.push(this.data[i]);
      }
    }
    return new FluentRestaurants(newData);
  }

  ratingGeq(rating){
    if(typeof rating !== 'number'){
      return this;
    }
    let newData=[];
    for(let i=0; i<this.data.length; ++i){
      let curStar = lib220.getProperty(this.data[i],'stars');
      if(curStar.found===true && curStar.value>=rating){
        newData.push(this.data[i]);
      }
    }
    return new FluentRestaurants(newData);
  }

  category(categoryStr){
    if(typeof categoryStr !== 'string'){
      return this;
    }
    let newData=[];
    for(let i=0; i<this.data.length; ++i){
      let curCat = lib220.getProperty(this.data[i],'categories');
      if(curCat.found===true && this.includes(curCat.value, categoryStr)){
        newData.push(this.data[i]);
      }
    }
    return new FluentRestaurants(newData);
  }

  hasAmbience(ambienceStr){
    if(typeof ambienceStr !== 'string'){
      return this;
    }
    let newData=[];
    for(let i=0; i<this.data.length; ++i){
      let curAtr = lib220.getProperty(this.data[i],'attributes');
      if(curAtr.found){
        let curAmb = lib220.getProperty(curAtr.value,'Ambience');
        if(curAmb.found){
          let foundAmb = lib220.getProperty(curAmb.value,ambienceStr);
          if(foundAmb.found===true && foundAmb.value){
            newData.push(this.data[i]);
          }
        }
      }
    }
    return new FluentRestaurants(newData);
  }

  bestPlace(){
    let best= [];
    if(this.data.length>0){
      best= [this.data[0]];
    } 
    for(let i=0; i<this.data.length; ++i){
      let curStar = lib220.getProperty(this.data[i],'stars');
      if(curStar.found && best.length>0){
        if(curStar.value===lib220.getProperty(best[0], 'stars').value){
          best.push(this.data[i]);
        }
        else if(curStar.value>lib220.getProperty(best[0], 'stars').value){  //current is better than best(s)
          best= [this.data[i]];
        }
      }
    }
    if(best.length>1){
      let reviews = 0;
      for(let i=0; i<best.length; ++i){
        let curRevs =lib220.getProperty(best[i], 'review_count');
        if(curRevs.found){
          if (curRevs.value>reviews){
            reviews=curRevs.value;
          }
        }
      }
      for(let i=0; i<best.length; ++i){
        let curRevs =lib220.getProperty(best[i], 'review_count');
        if(curRevs.found){
          if (curRevs.value===reviews){
            return best[i];
          }
        }
      }
    }
    else if(best.length===1){
      return best[0];
    }
    else if(best.length===0){
      return this;
    }
  }

  includes(array, element){
    for(let i=0; i<array.length; ++i){
      if(array[i]===element){
        return true;
      }
    }
    return false;
  }
}

let myData = new FluentRestaurants(rawData);

const testData = [
{
name: "Applebee's",
state: "NC",
stars: 4,
review_count: 6,
},
{

name: "China Garden",
state: "NC",
stars: 4,
review_count: 10,
},
{
name: "Beach Ventures Roofing",
state: "AZ",
stars: 3,
review_count: 30,
},
{
name: "Alpaul Automobile Wash",
state: "NC",
stars: 3,
review_count: 30,
}
]
test('fromState filters correctly', function() {
let tObj = new FluentRestaurants(testData);
let list = tObj.fromState('NC').data;
assert(list.length === 3);
assert(list[0].name === "Applebee's");
assert(list[1].name === "China Garden");
assert(list[2].name === "Alpaul Automobile Wash");
});
test('bestPlace tie-breaking', function() {
let tObj = new FluentRestaurants(testData);
let place = tObj.fromState('NC').bestPlace();
assert(place.name === 'China Garden');
});