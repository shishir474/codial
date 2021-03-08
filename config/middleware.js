module.exports.setFlash = function(req,res,next){
  res.locals.flash = {
      'success': req.flash('success'),
      'error': req.flash('error')
     }
    next();
}
// settting  flash messages in res.locals via this middleware