var curried = require('../curried');

describe('curried', function() {
  describe('two parameters function', function() {
    var cadd2;

    function add2(a, b) {
      return a + b;
    }
    function examples() {
      it('all parameters at once', function() {
        expect(cadd2(1, 2)).to.equal(3);
      });

      it('all parameters one by one', function() {
        expect(cadd2(1)(2)).to.equal(3);
      });

      it('partially applied, used twice', function() {
        var func = cadd2(1);
        expect(func(2)).to.equal(3);
        expect(func(3)).to.equal(4);
      });
    }

    describe('with explicit length set', function() {
      beforeEach(function() {
        cadd2 = curried(2, add2);
      });

      examples();
    });

    describe('with implicit length', function() {
      beforeEach(function() {
        cadd2 = curried(add2);
      });

      examples();
    });
  });

  describe('three parameters function', function() {
    var cadd3;
    function add3(a, b, c) {
      return a + b + c;
    }

    function examples() {
      it('all parameters at once', function() {
        expect(cadd3(1, 2, 3)).to.equal(6);
      });

      it('all parameters one by one', function() {
        expect(cadd3(1)(2)(3)).to.equal(6);
      });

      it('partially applied, used twice', function() {
        var func = cadd3(1, 2);
        expect(func(2)).to.equal(5);
        expect(func(3)).to.equal(6);
      });
    }

    describe('with explicit length set', function() {
      beforeEach(function() {
        cadd3 = curried(3, add3);
      });

      examples();
    });

    describe('with implicit length', function() {
      beforeEach(function() {
        cadd3 = curried(add3);
      });

      examples();
    });
  });

  describe('variable parameters function', function() {
    var cvariable;

    function variable() {
      return arguments.length;
    }

    beforeEach(function() {
      cvariable = curried(2, variable);
    });

    it('all parameters at once', function() {
      expect(cvariable(1, 2)).to.equal(2);
    });

    it('parameters one by one', function() {
      expect(cvariable(1)(2)).to.equal(2);
    });
  });
});