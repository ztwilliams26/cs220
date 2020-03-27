// Input: The AST of an expression and a state object.
// Output: The result of the expression (number or boolean).
function interpExpression(state, e) {
  if (e.kind === 'number' || e.kind === 'boolean') {
    return e.value;
  } 
  else if (e.kind === 'variable') {
    return lib220.getProperty(state, e.name).value;
  }
  else if (e.kind === 'operator') {
    if (e.op === '+') {
      return interpExpression(state, e.e1) + interpExpression(state, e.e2);
    } 
    else if (e.op === '-') {
      return interpExpression(state, e.e1) - interpExpression(state, e.e2);
    } 
    else if (e.op === '*') {
      return interpExpression(state, e.e1) * interpExpression(state, e.e2);
    }
    else if (e.op === '/'){
      return interpExpression(state, e.e1) / interpExpression(state, e.e2);
    }
    else if (e.op === '&&'){
      return interpExpression(state, e.e1) && interpExpression(state, e.e2);
    }
    else if (e.op === '||'){
      return interpExpression(state, e.e1) || interpExpression(state, e.e2);
    }
    else if (e.op === '>'){
      return interpExpression(state, e.e1) > interpExpression(state, e.e2);
    }
    else if (e.op === '<'){
      return interpExpression(state, e.e1) < interpExpression(state, e.e2);
    }
    else if (e.op === '==='){
      return interpExpression(state, e.e1) === interpExpression(state, e.e2);
    }
  } 
  else {
    assert(false);
  }
}
// Input: The AST of a statement and a state object.
// Output: Return nothing;
function interpStatement(state, p) {
  if (p.kind === 'let'){
    let value = interpExpression(state, p.expression);
    lib220.setProperty(state, p.name, value)
  }
  else if (p.kind === 'assignment'){
    let value = interpExpression(state, p.expression);
    lib220.setProperty(state, p.name, value)
  }
  else if (p.kind === 'if'){
    let test=interpExpression(state, p.test);
    if(test){
      interpBlock(state, p.truePart);  
    }
    else{
      interpBlock(state, p.falsePart); 
    }
  }

  else if (p.kind === 'while'){
    while(interpExpression(state, p.test)){
      interpBlock(state, p.body);
    }
  }
  else if (p.kind === 'print'){
    console.log(interpExpression(state, p.expression));
  }

}


// Input: The AST of a block (an array) and a state object
// Output: Return nothing

function interpBlock(state, b){
  b.reduce(function(tot, curP){
      interpStatement(state, curP);
      return state;
    }, state);
    
}


// Input: The AST of a program.
// Output: The final state of the program
function interpProgram(p) {
  let state = { }; // Use at input to interpStatement

  interpBlock(state, p);

  return state; // Do not change this line
}


