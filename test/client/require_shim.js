var modules = {
  'functor': fnky.functor,
  'applicative': fnky.applicative,
  'monad': fnky.monad,
  'monoid': fnky.monoid,
  'curried': fnky.curried,
  'types/maybe': fnky.types.Maybe,
  'types/either': fnky.types.Either,
  'types/sum': fnky.types.Sum,
  'types/product': fnky.types.Product
};

function require(what) {
  what = what.replace(/\.\.\//g, '');
  console.log(what);
  return modules[what];
}