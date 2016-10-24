var chai = require('chai');
var assert = chai.assert;

describe('Json', function() {
  it('json passed to server thu POST', function(){
  	var json = [{"name": "test"}];
  	assert.equal(json.length, 1);
  });
});