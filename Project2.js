let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');
function red(img, x, y) {   const c = img.getPixel(x, y);  return [c[0], 0, 0];};
function lines(img, x, y) {return (y % 10 === 0);};

//------------------------------------------------

function imageMap(image, f){
  let newImage = image.copy();
  for (let i=0; i < image.width; ++i){
    for(let j=0; j < image.height; ++j){
      let newPixel = f(image, i, j);
      newImage.setPixel(i,j,newPixel);
    }
  }
  return newImage;
};

function imageMask(image, f, mask){
  return imageMap(image, function(image, x, y){
    if( f(image, x, y) === true){
      return mask;
    }
    else{
      return image.getPixel(x,y);
    }
  });
};

function blurPixel(image, x, y){
  let sum=image.getPixel(x,y);
    let count=1;
    for (let k=1; k<=5; ++k){
      if(x-k>0){ 
        sum[0] += image.getPixel(x-k,y)[0];
        sum[1] += image.getPixel(x-k,y)[1];
        sum[2] += image.getPixel(x-k,y)[2];
        ++count;
      }
      if(x+k<image.width){ 
        sum[0] += image.getPixel(x+k,y)[0];
        sum[1] += image.getPixel(x+k,y)[1];
        sum[2] += image.getPixel(x+k,y)[2];
        ++count;
      }
    }
    return [sum[0]/count,sum[1]/count,sum[2]/count];
};

function blurImage(image){
  return imageMap(image, blurPixel);
};

function isDark(image, x, y){
  let pixel = image.getPixel(x,y);
  if(pixel[0]<.5 && pixel[1]<.5 && pixel[2]<.5){
    return true;
  }
  return false;
};

function darken(image){
  return imageMask(image, isDark, [0,0,0]);
};

function isLight(image, x, y){
  let pixel = image.getPixel(x,y);
  if(pixel[0]>=.5 && pixel[1]>=.5 && pixel[2]>=.5){
    return true;
  }
  return false;
};

function lighten(image){
  return imageMask(image, isLight, [1,1,1]);
};

function lightenAndDarken(image){
  return darken(lighten(image));
};


//---------------------------------------------------------

test('imageMap function definition is correct', function() {
let identityFunction = function(image, x, y) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
let outputImage = imageMap(inputImage, identityFunction);
// Output should be an image, so getPixel must work without errors.
let p = outputImage.getPixel(0, 0);
assert(p[0] === 0);
assert(p[1] === 0);
assert(p[2] === 0);
assert(inputImage !== outputImage);
});
function pixelEq (p1, p2) {
const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i] - p2[i]) > epsilon) {
return false;
}

3

}
return true;
};
test('identity function with imageMap', function() {
let identityFunction = function(image, x, y ) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
let outputImage = imageMap(inputImage, identityFunction);
assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});
