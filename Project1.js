let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');


function removeBlueAndGreen(image){
  let redBot = image.copy();
  for (let i=0; i < redBot.width; ++i){
    for (let j=0; j < redBot.height; ++j){
      let currentPixel = redBot.getPixel(i,j);
      redBot.setPixel(i,j,[currentPixel[0], 0, 0]);
    }  
  }  
  return redBot;
};  

function makeGrayscale(image){
  let grayBot = image.copy();
  for (let i=0; i<grayBot.width; ++i){
    for (let j=0; j<grayBot.height; ++j){
      let currentPixel = grayBot.getPixel(i,j);
      let mean = (currentPixel[0] + currentPixel[1] + currentPixel[2]) / 3;
      grayBot.setPixel(i,j,[mean,mean,mean]);
    }
  }
  return grayBot;
};  

function highlightEdges(image){
  let edgeBot = image.copy();
  for(let i=0; i<edgeBot.width; ++i){
    for (let j=0; j<edgeBot.height; ++j){
      if(i < edgeBot.width-1){
        let currentPixel = edgeBot.getPixel(i,j);
        let nextPixel = edgeBot.getPixel(i+1,j);
        let mean1 = (currentPixel[0] + currentPixel[1] + currentPixel[2]) / 3;
        let mean2 = (nextPixel[0] + nextPixel[1] + nextPixel[2]) / 3;
        edgeBot.setPixel(i,j,[Math.abs(mean1-mean2), Math.abs(mean1-mean2), Math.abs(mean1-mean2)]);
      }
      //Edge case - using the extend edge handling method. Should produce black pixels as it subtracts the same mean from itself [0,0,0]
      if(i === edgeBot.width - 1){
        let currentPixel = edgeBot.getPixel(i,j);
        let mean1 = (currentPixel[0] + currentPixel[1] + currentPixel[2]) / 3;
        let mean2 = (currentPixel[0] + currentPixel[1] + currentPixel[2]) / 3;
        edgeBot.setPixel(i,j,[Math.abs(mean1-mean2), Math.abs(mean1-mean2), Math.abs(mean1-mean2)]);
      }
    }
  }
  return edgeBot;
}

function blur(image){
  let blurBot = image.copy();
  for(let i=0; i<image.width; ++i){
    for (let j=0; j<image.height; ++j){
      let sum=image.getPixel(i,j);
      let count=1;
      for (let k=1; k<=5; ++k){
        if(i-k>0){ 
          sum[0] += image.getPixel(i-k,j)[0];
          sum[1] += image.getPixel(i-k,j)[1];
          sum[2] += image.getPixel(i-k,j)[2];
          ++count;
        }
        if(i+k<image.width){ 
          sum[0] += image.getPixel(i+k,j)[0];
          sum[1] += image.getPixel(i+k,j)[1];
          sum[2] += image.getPixel(i+k,j)[2];
          ++count;
        }
/*        if(j-k>0){ 
          sum[0] += image.getPixel(i,j-k)[0];
          sum[1] += image.getPixel(i,j-k)[1];
          sum[2] += image.getPixel(i,j-k)[2];
          ++count;
        }
        if(j+k<image.height){ 
          sum[0] += image.getPixel(i,j+k)[0];
          sum[1] += image.getPixel(i,j+k)[1];
          sum[2] += image.getPixel(i,j+k)[2];
          ++count;
        }*/
      }
      blurBot.setPixel(i,j,[sum[0]/count,sum[1]/count,sum[2]/count]);
    }
  }
  return blurBot;
}

function raiseIntensity(image, intensity){
  //intensity = 2;
  let image2 = image.copy();
  for(let i=0; i<image.width; ++i){
    for(let j=0; j<image.height; ++j){
      cur = image.getPixel(i,j);
      let newR = cur[0] * intensity;
      let newG = cur[1] * intensity;
      let newB = cur[2] * intensity;
      if(newR>1){
        newR=1;
      }
      if(newG>1){
        newG=1;
      }
      if(newB>1){
        newB=1;
      }
      image2.setPixel(i,j,[newR,newG,newB]);
    }
  }
  return image2;
}



test('removeBlueAndGreen function definition is correct', function() {
const white = lib220.createImage(10, 10, [1,1,1]);
removeBlueAndGreen(white).getPixel(0,0);
// Need to use assert
});


        
test('No blue or green in removeBlueAndGreen result', function() {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = removeBlueAndGreen(white);
// Read the center pixel.
const pixelValue = shouldBeRed.getPixel(5, 5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
});



function pixelEq (p1, p2) {
const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i] - p2[i]) > epsilon) {
return false;
}
}
return true;
};
test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = removeBlueAndGreen(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0, 0]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0, 0]));
});

test('Check single pixel image processing', function(){
const whiteDot = lib220.createImage(10, 10, [1,1,1]);
const dotRed = removeBlueAndGreen(whiteDot);
const dotGray = makeGrayscale(whiteDot);
const dotEdge = highlightEdges(whiteDot);
const dotBlur = blur(whiteDot);

});

test('Different right robot edge for highlight', function(){
const testEdgeRobot = highlightEdges(robot);
const rightPix1 = robot.getPixel(robot.width-1, robot.height-1);
const rightPix2 = testEdgeRobot.getPixel(testEdgeRobot.width-1, testEdgeRobot.height-1);
assert(!pixelEq(rightPix1, rightPix2));
});