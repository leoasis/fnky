var modules = {
  'functor': fnky.functor,
  'applicative': fnky.applicative,
  'monad': fnky.monad,
  'monoid': fnky.monoid,
  'curried': fnky.curried,
  'maybe': fnky.maybe,
  'either': fnky.either
};

function require(what) {
  return modules[what.replace(/^\.\.\//, '')];
}