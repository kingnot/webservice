/*
var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
*/
//use Chai as assertion library
var chai = require('chai');
var assert = chai.assert;

describe('Json', function() {
  it('json passed to server thu POST', function(){
  	var json = [{"name": "test"}];
  	assert.equal(json.length, 1);
  });
});