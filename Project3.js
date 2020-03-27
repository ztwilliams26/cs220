function generateInput(n){
  let preferences = [];
  for (let i=0; i<n; ++i){
    preferences.push([]);
    let nums = [];
    for(let j=0; j<n; ++j){
      nums.push(j);
    }
    for(let j=0; j<n; ++j){
      let current = Math.floor(Math.random()*nums.length);
      preferences[i].push(nums.splice(current,1)[0]);
      
    }
  }
  return preferences;
};

function includes(array, num){
  for(let i=0; i<array.length; ++i){
    if(array[i] === num){return true;}
  }
  return false;
};

function oracle(matchmaker) {
  let numTests = 20; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = matchmaker(companies, candidates);

    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    });

    // Write your tests here

    test("Stability", function(){
      
      assert(Stability(matchmaker, n));

    });
  }
};

function Stability(matchmaker, n){
  let stability = true;

  let companies = generateInput(n);
  let candidates = generateInput(n);
  let hires = matchmaker(companies, candidates);

  for(let i=0; i<hires.length; ++i){  
    for(let j=0; j<companies.length; ++j){          
      let comp1=hires[i].company;     //current hire's company
      let comp2=j;                   //the company we're checking preference against
      let cand1=hires[i].candidate;   //current hire's candidate
      let cand2=-1;                  //company's candidate to check, not yet known
      for(let z=0; z<hires.length;++z){       //finding cand2
        if(hires[z].company===j){
          cand2 = hires[z].candidate;
        }
      }
      let compPrefs = companies[comp1];  
      let candPrefs = candidates[cand2];

      if (compPrefs.indexOf(cand1) > compPrefs.indexOf(cand2) &&
      candPrefs.indexOf(comp2) > candPrefs.indexOf(comp1)
      ){
        stability=false;
      }
    }
  }
  return stability;
};
