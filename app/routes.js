module.exports = {
  bind : function (app) {

    app.get('/', function (req, res) {
      res.render('index');
    });

    // add your routes here

    // v2 step 1 - create case

    var display = {
      property: false,
      borrower_1: false,
      borrower_2: false
    };

    app.get('/v2/step1/login', function (req, res) {
      // make sure EVERYTHING is set to FALSE again
      display.property = false;
      display.borrower_1 = false;
      display.borrower_2 = false;
      res.render('v2/step1/login');
    });

    // property is now found and should be displayed
    app.get('/v2/step1/case-property-selected', function (req, res) {
      display.property = true;
      res.redirect('/v2/step1/case-base');
    });

    // first borrower addition
    app.get('/v2/step1/case-add-borrower-1', function (req, res) {
      display.borrower_1 = true;
      res.redirect('/v2/step1/case-base');
    });

    // second borrower addition
    app.get('/v2/step1/case-add-borrower-2', function (req, res) {
      display.borrower_2 = true;
      res.redirect('/v2/step1/case-base');
    });


    app.get('/v2/step1/case-base', function (req, res) {
      res.render('v2/step1/case-base', {
        "property": display.property,
        "borrower_1": display.borrower_1,
        "borrower_2": display.borrower_2
      });
    });

    // borrowers form page needs the variables too
    app.get('/v2/step1/add-borrower', function (req, res) {
      res.render('v2/step1/add-borrower', {
        "property": display.property,
        "borrower_1": display.borrower_1,
        "borrower_2": display.borrower_2
      });
    });

    // finally, case list needs just one of the variables
    app.get('/v2/step1/case-list', function (req, res) {
      res.render('v2/step1/case-list', {
        "borrower_2": display.borrower_2
      });
    });

  }
};
