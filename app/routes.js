module.exports = {
  bind : function (app) {

    app.get('/', function (req, res) {
      res.render('index');
    });

    // add your routes here

    // v2 step 1 - create case

    app.get('/v2/step1/*', function(req, res, next) {

      var n = req.session.views || 0;
      req.session.views = ++n;

      console.log('views: ' + req.session.views);
      console.log('caseRef: ' + req.session.caseRef);
      console.log('displayProperty: ' + req.session.displayProperty);
      console.log('displayBorrower_1: ' + req.session.displayBorrower_1);
      console.log('displayBorrower_2: ' + req.session.displayBorrower_2);
      console.log('\n');

      next();
    });

    app.get('/v2/step1/login', function (req, res) {
      // destroy the session:
      req.session = null;
      res.render('v2/step1/login');
    });

    // property is now found and should be displayed
    app.get('/v2/step1/case-property-selected', function (req, res) {
      req.session.displayProperty = true;
      res.redirect('/v2/step1/case-base');
    });

    // first borrower addition
    app.get('/v2/step1/case-add-borrower-1', function (req, res) {
      req.session.displayBorrower_1 = true;
      res.redirect('/v2/step1/case-base');
    });

    // second borrower addition
    app.get('/v2/step1/case-add-borrower-2', function (req, res) {
      req.session.displayBorrower_2 = true;
      res.redirect('/v2/step1/case-base');
    });


    app.get('/v2/step1/case-base', function (req, res) {
      req.session.caseRef = true;
      res.render('v2/step1/case-base', {
        "property": req.session.displayProperty,
        "borrower_1": req.session.displayBorrower_1,
        "borrower_2": req.session.displayBorrower_2
      });
    });

    // borrowers form page needs the variables too
    app.get('/v2/step1/add-borrower', function (req, res) {
      res.render('v2/step1/add-borrower', {
        "property": req.session.displayProperty,
        "borrower_1": req.session.displayBorrower_1,
        "borrower_2": req.session.displayBorrower_2
      });
    });

    // finally, case list needs just one of the variables
    app.get('/v2/step1/case-list', function (req, res) {
      res.render('v2/step1/case-list', {
        "caseRef": req.session.caseRef,
        "borrower_2": req.session.displayBorrower_2
      });
    });

  }
};
