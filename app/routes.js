module.exports = {
  bind : function (app) {

    app.get('/', function (req, res) {
      res.render('index');
    });

    // add your routes here

    // V3 --------------------------------------------------------

    app.get('/v3/conveyancer/*', function(req, res, next) {

      var n = req.session.views || 0;
      req.session.views = ++n;
      console.log('views: ' + req.session.views);

      // To help. A list of all the session vars used:
      console.log('new_case: ' + req.session.new_case);
      console.log('case_reference: ' + req.session.case_reference);
      console.log('property: ' + req.session.property);
      console.log('borrower_1: ' + req.session.borrower_1);
      console.log('borrower_2: ' + req.session.borrower_2);
      console.log('\n');

      next();
    });


    // PAGE requests --------------------

    // Sign in page ALWAYS flushes the session
    app.get('/v3/conveyancer/login', function (req, res) {
      // destroy the session:
      req.session = null;
      res.render('v3/conveyancer/login');
    });

    // Case List - send this page some session vars:
    app.get('/v3/conveyancer/case-list', function (req, res) {
      res.render('v3/conveyancer/case-list', {
        "new_case": req.session.new_case,
        "case_reference": req.session.case_reference,
        "case_status": req.session.case_status
      });
    });

    // Case - send this page some session vars:
    app.get('/v3/conveyancer/case', function (req, res) {
      req.session.new_case = true;
      res.render('v3/conveyancer/case', {
        "case_reference": req.session.case_reference,
        "property": req.session.property,
        "borrower_1": req.session.borrower_1,
        "borrower_2": req.session.borrower_2
      });
    });

    // Case Reference - send this page a session var:
    app.get('/v3/conveyancer/case-reference', function (req, res) {
      res.render('v3/conveyancer/case-reference', {
        "case_reference": req.session.case_reference
      });
    });

    // Case Find Property - send this page a session var:
    app.get('/v3/conveyancer/case-find-property', function (req, res) {
      req.session.building_search = false;
      res.render('v3/conveyancer/case-find-property', {
        "case_reference": req.session.case_reference
      });
    });

    // Case Find Property (results)
    app.get('/v3/conveyancer/case-property-results', function (req, res) {
      if (req.query.building !== '') {
        req.session.building_search = true;
      }
      res.render('v3/conveyancer/case-property-results', {
        "building_search": req.session.building_search
      });
    });

    // Case Add Borrower - send this page a session var:
    app.get('/v3/conveyancer/case-add-borrower', function (req, res) {
      res.render('v3/conveyancer/case-add-borrower', {
        "case_reference": req.session.case_reference,
        "property": req.session.property
      });
    });

    // Create mortgage - send this page a session var:
    app.get('/v3/conveyancer/create-mortgage-confirm-details', function (req, res) {
      res.render('v3/conveyancer/create-mortgage-confirm-details', {
        "case_reference": req.session.case_reference
      });
    });

    // Create mortgage - MD ref - send this page a session var:
    app.get('/v3/conveyancer/create-mortgage-md-ref', function (req, res) {
      if (req.query.md_ref !== '') {
        req.session.md_ref = req.query.md_ref;
      }
      res.render('v3/conveyancer/create-mortgage-md-ref', {
        "md_ref": req.session.md_ref,
        "case_reference": req.session.case_reference
      });
    });

    // Mortgage created
    app.get('/v3/conveyancer/create-mortgage-confirmed', function (req, res) {
      req.session.case_status = "Mortgage deed created";
      res.render('v3/conveyancer/create-mortgage-confirmed');
    });

    // HANDLERS --------------------

    // Reference handler
    app.get('/v3/conveyancer/case-reference-handler', function (req, res) {
      req.session.case_reference = req.query.caseref;
      res.redirect('/v3/conveyancer/case');
    });

    // Property handler
    app.get('/v3/conveyancer/case-property-handler', function (req, res) {
      // if there's no reference set, use the first line of the address
      if (typeof req.session.case_reference === 'undefined') {
        req.session.case_reference = '83 Lordship Park';
      }
      req.session.property = true;
      res.redirect('/v3/conveyancer/case');
    });

    // Borrower handler
    app.get('/v3/conveyancer/case-borrower-handler', function (req, res) {
      if (typeof req.session.borrower_1 === 'undefined') {
        req.session.borrower_1 = true;
      } else {
        req.session.borrower_2 = true;
      }
      res.redirect('/v3/conveyancer/case');
    });

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------

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
