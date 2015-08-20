module.exports = {
  bind : function (app) {

    app.get('/', function (req, res) {
      // ALWAYS flush sessions if you're at the root index:
      req.session = null;
      res.render('index');
    });

    // add your routes here

    // V3.1 --------------------------------------------------------

    app.get('/v3-1/conveyancer/*', function(req, res, next) {

      var n = req.session.views || 0;
      req.session.views = ++n;
      console.log('views: ' + req.session.views);

      // To help. A list of all the session vars used:
      console.log('new_case: ' + req.session.new_case);
      console.log('case_reference: ' + req.session.case_reference);
      console.log('case_status: ' + req.session.case_status);
      console.log('property: ' + req.session.property);
      console.log('borrower_1: ' + req.session.borrower_1);
      console.log('borrower_2: ' + req.session.borrower_2);
      console.log('md_ref: ' + req.session.md_ref);
      console.log('mortgage_value: ' + req.session.mortgage_value);
      console.log('mortgage_charge: ' + req.session.mortgage_charge);
      console.log('deed_created: ' + req.session.deed_created);

      console.log('conveyancer_returns: ' + req.session.conveyancer_returns);

      console.log('completion_date: ' + req.session.completion_date);
      console.log('deed_signed: ' + req.session.deed_signed);
      console.log('applied: ' + req.session.applied);
      console.log('\n');

      next();
    });


    // CITIZEN --------------------

    // Unhappy path catcher
    app.get('/v3-1/deed-journeys/deed-transaction/*', function(req, res, next) {
      var answer = req.query['radio-inline-group'];
      if (answer === 'No') {
        res.redirect('/v3-1/deed-journeys/deed-transaction/not-happy-to-proceed');
      } else {
        next();
      }
    });
    

    // Once the CITIZEN demo journey is complete, set deed_signed to true
    app.get('/v3-1/deed-journeys/deed-transaction/deed-agreed', function(req, res) {
      req.session.deed_signed = true;
      res.render('v3-1/deed-journeys/deed-transaction/deed-agreed');
    });

    // CONVEYANCER ----------------

    // Sign in page ALWAYS flushes the session UNLESS we're coming back from index
    app.get('/v3-1/conveyancer/login', function (req, res) {
      // destroy the session if there's no "preserve" query
      if (typeof req.query.preserve === 'undefined') {
        req.session = null;
      } else {
        req.session.conveyancer_returns = true;
        // if anything is undefined, give it a value according to our default scenarios
        req.session.new_case = true;
        if (typeof req.session.case_reference === 'undefined') {
          req.session.case_reference = '83 Lordship Park';
        }
        req.session.case_status = '<span class="highlight-yellow">Mortgage deed signed</span>';
        req.session.property = true;
        req.session.borrower_1 = true;
        req.session.borrower_2 = true;
        if (typeof req.session.md_ref === 'undefined') {
          req.session.md_ref = 'MD1234F';
        }
        if (typeof req.session.mortgage_value === 'undefined') {
          req.session.mortgage_value = '240000';
          req.session.mortgage_charge = '40';
        }
        req.session.deed_created = true;
        req.session.deed_signed = true;
      }
      res.render('v3-1/conveyancer/login');
    });

    // Case List - send this page some session vars:
    app.get('/v3-1/conveyancer/case-list', function (req, res) {
      res.render('v3-1/conveyancer/case-list', {
        "new_case": req.session.new_case,
        "case_reference": req.session.case_reference,
        "case_status": req.session.case_status,
        "completion_date": req.session.completion_date,
        "deed_signed": req.session.deed_signed,
        "applied": req.session.applied
      });
    });

    // Case - send this page some session vars:
    app.get('/v3-1/conveyancer/case', function (req, res) {
      req.session.new_case = true;
      if (
        typeof req.session.case_status === 'undefined' &&
        typeof req.session.property !== 'undefined' &&
        typeof req.session.borrower_1 !== 'undefined' &&
        typeof req.session.md_ref !== 'undefined' &&
        typeof req.session.mortgage_value !== 'undefined' &&
        typeof req.session.deed_available === 'undefined'
        ) {
        req.session.case_status = 'Mortgage not yet created';
        req.session.deed_available = true;
      }
      res.render('v3-1/conveyancer/case', {
        "case_reference": req.session.case_reference,
        "case_status": req.session.case_status,
        "property": req.session.property,
        "borrower_1": req.session.borrower_1,
        "borrower_2": req.session.borrower_2,
        "md_ref": req.session.md_ref,
        "mortgage_value": req.session.mortgage_value,
        "mortgage_charge": req.session.mortgage_charge,
        "deed_available": req.session.deed_available,
        "deed_created": req.session.deed_created,
        "conveyancer_returns": req.session.conveyancer_returns,
        "deed_signed": req.session.deed_signed,
        "completion_date": req.session.completion_date,
        "applied": req.session.applied
      });
    });

    // Case Reference - send this page a session var:
    app.get('/v3-1/conveyancer/case-reference', function (req, res) {
      res.render('v3-1/conveyancer/case-reference', {
        "case_reference": req.session.case_reference
      });
    });

    // Case Find Property - send this page a session var:
    app.get('/v3-1/conveyancer/case-find-property', function (req, res) {
      req.session.building_search = false;
      res.render('v3-1/conveyancer/case-find-property', {
        "case_reference": req.session.case_reference
      });
    });

    // Case Find Property (results)
    app.get('/v3-1/conveyancer/case-property-results', function (req, res) {
      if (req.query.building !== '') {
        req.session.building_search = true;
      }
      res.render('v3-1/conveyancer/case-property-results', {
        "building_search": req.session.building_search
      });
    });

    // Case Add Borrower - send this page a session var:
    app.get('/v3-1/conveyancer/case-add-borrower', function (req, res) {
      res.render('v3-1/conveyancer/case-add-borrower', {
        "case_reference": req.session.case_reference,
        "property": req.session.property
      });
    });

    // Create mortgage - MD ref - send this page a session var:
    app.get('/v3-1/conveyancer/create-mortgage-md-ref', function (req, res) {
      if (req.query.md_ref !== '') {
        req.session.md_ref = req.query.md_ref;
      }
      res.render('v3-1/conveyancer/create-mortgage-md-ref', {
        "md_ref": req.session.md_ref,
        "case_reference": req.session.case_reference
      });
    });

    // Add mortgage value - send this page a session var:
    app.get('/v3-1/conveyancer/case-mortgage-value', function (req, res) {
      res.render('v3-1/conveyancer/case-mortgage-value', {
        "case_reference": req.session.case_reference,
        "mortgage_value": req.session.mortgage_value,
        "mortgage_charge": req.session.mortgage_charge
      });
    });

    // Create DEED - send this page a session var:
    app.get('/v3-1/conveyancer/create-mortgage-deed', function (req, res) {
      res.render('v3-1/conveyancer/create-mortgage-deed', {
        "case_reference": req.session.case_reference,
        "md_ref": req.session.md_ref
      });
    });
    app.get('/v3-1/conveyancer/create-mortgage-confirmed', function (req, res) {
      res.render('v3-1/conveyancer/create-mortgage-confirmed', {
        "case_reference": req.session.case_reference
      });
    });

    // Completion
    app.get('/v3-1/conveyancer/case-confirm-completion', function (req, res) {
      var today = new Date();
      var monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ];
      req.session.completion_date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear()
      res.render('v3-1/conveyancer/case-confirm-completion', {
        "case_reference": req.session.case_reference,
        "completion_date": req.session.completion_date
      });
    });

    // Apply to Register
    app.get('/v3-1/conveyancer/case-apply-deed', function (req, res) {
      res.render('v3-1/conveyancer/case-apply-deed', {
        "case_reference": req.session.case_reference,
        "md_ref": req.session.md_ref,
        "completion_date": req.session.completion_date
      });
    });

    // HANDLERS --------------------

    // Reference handler
    app.get('/v3-1/conveyancer/case-reference-handler', function (req, res) {
      req.session.case_reference = req.query.caseref;
      res.redirect('/v3-1/conveyancer/case');
    });

    // Property handler
    app.get('/v3-1/conveyancer/case-property-handler', function (req, res) {
      // if there's no reference set, use the first line of the address
      if (typeof req.session.case_reference === 'undefined') {
        req.session.case_reference = '83 Lordship Park';
      }
      req.session.property = true;
      res.redirect('/v3-1/conveyancer/case');
    });

    // Borrower handler
    app.get('/v3-1/conveyancer/case-borrower-handler', function (req, res) {
      if (typeof req.session.borrower_1 === 'undefined') {
        req.session.borrower_1 = true;
      } else {
        req.session.borrower_2 = true;
      }
      res.redirect('/v3-1/conveyancer/case');
    });

    // Mortgage deed handler
    app.get('/v3-1/conveyancer/case-mortgage-handler', function (req, res) {
      req.session.deed_created = true;
      req.session.case_status = 'Mortgage deed created';
      res.redirect('/v3-1/conveyancer/case');
    });

    // Mortgage value handler
    app.get('/v3-1/conveyancer/mortgage-value-handler', function (req, res) {
      req.session.mortgage_value = req.query.mortgage_value;
      req.session.mortgage_charge = req.query.mortgage_charge;
      res.redirect('/v3-1/conveyancer/case');
    });

    // Completion handler
    app.get('/v3-1/conveyancer/completion-handler', function (req, res) {
      req.session.case_status = 'Completion confirmed';
      if (req.query.apply_immediately === 'on') {
        res.redirect('/v3-1/conveyancer/case-apply-deed');
      } else {
        res.redirect('/v3-1/conveyancer/case');
      }
    });

    // Apply to Register handler
    app.get('/v3-1/conveyancer/apply-to-register-handler', function (req, res) {
      req.session.applied = true;
      req.session.case_status = '<span class="highlight-yellow">Applied to Register</span>';
      res.redirect('/v3-1/conveyancer/case');
    });

    // end v3-1 -------------------------------------------------------------
    // ----------------------------------------------------------------------


    // V3 --------------------------------------------------------

    app.get('/v3/conveyancer/*', function(req, res, next) {

      var n = req.session.views || 0;
      req.session.views = ++n;
      console.log('views: ' + req.session.views);

      // To help. A list of all the session vars used:
      console.log('new_case: ' + req.session.new_case);
      console.log('case_reference: ' + req.session.case_reference);
      console.log('case_status: ' + req.session.case_status);
      console.log('property: ' + req.session.property);
      console.log('borrower_1: ' + req.session.borrower_1);
      console.log('borrower_2: ' + req.session.borrower_2);
      console.log('md_ref: ' + req.session.md_ref);
      console.log('mortgage_value: ' + req.session.mortgage_value);
      console.log('mortgage_charge: ' + req.session.mortgage_charge);
      console.log('deed_created: ' + req.session.deed_created);

      console.log('conveyancer_returns: ' + req.session.conveyancer_returns);

      console.log('completion_date: ' + req.session.completion_date);
      console.log('deed_signed: ' + req.session.deed_signed);
      console.log('applied: ' + req.session.applied);
      console.log('\n');

      next();
    });


    // CITIZEN --------------------

    // Unhappy path catcher
    app.get('/deed-journeys/deed-transaction/*', function(req, res, next) {
      var answer = req.query['radio-inline-group'];
      if (answer === 'No') {
        res.redirect('/deed-journeys/deed-transaction/unhappy-path');
      } else {
        next();
      }
    });

    // Once the CITIZEN demo journey is complete, set deed_signed to true
    app.get('/deed-journeys/deed-transaction/deed-agreed', function(req, res) {
      req.session.deed_signed = true;
      res.render('deed-journeys/deed-transaction/deed-agreed');
    });

    // CONVEYANCER ----------------

    // Sign in page ALWAYS flushes the session UNLESS we're coming back from index
    app.get('/v3/conveyancer/login', function (req, res) {
      // destroy the session if there's no "preserve" query
      if (typeof req.query.preserve === 'undefined') {
        req.session = null;
      } else {
        req.session.conveyancer_returns = true;
        // if anything is undefined, give it a value according to our default scenarios
        req.session.new_case = true;
        if (typeof req.session.case_reference === 'undefined') {
          req.session.case_reference = '83 Lordship Park';
        }
        req.session.case_status = '<span class="highlight-yellow">Mortgage deed signed</span>';
        req.session.property = true;
        req.session.borrower_1 = true;
        req.session.borrower_2 = true;
        if (typeof req.session.md_ref === 'undefined') {
          req.session.md_ref = 'MD1234F';
        }
        if (typeof req.session.mortgage_value === 'undefined') {
          req.session.mortgage_value = '240000';
          req.session.mortgage_charge = '40';
        }
        req.session.deed_created = true;
        req.session.deed_signed = true;
      }
      res.render('v3/conveyancer/login');
    });

    // Case List - send this page some session vars:
    app.get('/v3/conveyancer/case-list', function (req, res) {
      res.render('v3/conveyancer/case-list', {
        "new_case": req.session.new_case,
        "case_reference": req.session.case_reference,
        "case_status": req.session.case_status,
        "completion_date": req.session.completion_date,
        "deed_signed": req.session.deed_signed,
        "applied": req.session.applied
      });
    });

    // Case - send this page some session vars:
    app.get('/v3/conveyancer/case', function (req, res) {
      req.session.new_case = true;
      if (
        typeof req.session.case_status === 'undefined' &&
        typeof req.session.property !== 'undefined' &&
        typeof req.session.borrower_1 !== 'undefined' &&
        typeof req.session.md_ref !== 'undefined' &&
        typeof req.session.mortgage_value !== 'undefined' &&
        typeof req.session.deed_available === 'undefined'
        ) {
        req.session.case_status = 'Mortgage not yet created';
        req.session.deed_available = true;
      }
      res.render('v3/conveyancer/case', {
        "case_reference": req.session.case_reference,
        "case_status": req.session.case_status,
        "property": req.session.property,
        "borrower_1": req.session.borrower_1,
        "borrower_2": req.session.borrower_2,
        "md_ref": req.session.md_ref,
        "mortgage_value": req.session.mortgage_value,
        "mortgage_charge": req.session.mortgage_charge,
        "deed_available": req.session.deed_available,
        "deed_created": req.session.deed_created,
        "conveyancer_returns": req.session.conveyancer_returns,
        "deed_signed": req.session.deed_signed,
        "completion_date": req.session.completion_date,
        "applied": req.session.applied
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

    // Add mortgage value - send this page a session var:
    app.get('/v3/conveyancer/case-mortgage-value', function (req, res) {
      res.render('v3/conveyancer/case-mortgage-value', {
        "case_reference": req.session.case_reference,
        "mortgage_value": req.session.mortgage_value,
        "mortgage_charge": req.session.mortgage_charge
      });
    });

    // Create DEED - send this page a session var:
    app.get('/v3/conveyancer/create-mortgage-deed', function (req, res) {
      res.render('v3/conveyancer/create-mortgage-deed', {
        "case_reference": req.session.case_reference,
        "md_ref": req.session.md_ref
      });
    });
    app.get('/v3/conveyancer/create-mortgage-confirmed', function (req, res) {
      res.render('v3/conveyancer/create-mortgage-confirmed', {
        "case_reference": req.session.case_reference
      });
    });

    // Completion
    app.get('/v3/conveyancer/case-confirm-completion', function (req, res) {
      var today = new Date();
      var monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ];
      req.session.completion_date = today.getDate() + ' ' + monthNames[today.getMonth()] + ' ' + today.getFullYear()
      res.render('v3/conveyancer/case-confirm-completion', {
        "case_reference": req.session.case_reference,
        "completion_date": req.session.completion_date
      });
    });

    // Apply to Register
    app.get('/v3/conveyancer/case-apply-deed', function (req, res) {
      res.render('v3/conveyancer/case-apply-deed', {
        "case_reference": req.session.case_reference,
        "md_ref": req.session.md_ref,
        "completion_date": req.session.completion_date
      });
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

    // Mortgage deed handler
    app.get('/v3/conveyancer/case-mortgage-handler', function (req, res) {
      req.session.deed_created = true;
      req.session.case_status = 'Mortgage deed created';
      res.redirect('/v3/conveyancer/case');
    });

    // Mortgage value handler
    app.get('/v3/conveyancer/mortgage-value-handler', function (req, res) {
      req.session.mortgage_value = req.query.mortgage_value;
      req.session.mortgage_charge = req.query.mortgage_charge;
      res.redirect('/v3/conveyancer/case');
    });

    // Completion handler
    app.get('/v3/conveyancer/completion-handler', function (req, res) {
      req.session.case_status = 'Completion confirmed';
      if (req.query.apply_immediately === 'on') {
        res.redirect('/v3/conveyancer/case-apply-deed');
      } else {
        res.redirect('/v3/conveyancer/case');
      }
    });

    // Apply to Register handler
    app.get('/v3/conveyancer/apply-to-register-handler', function (req, res) {
      req.session.applied = true;
      req.session.case_status = '<span class="highlight-yellow">Applied to Register</span>';
      res.redirect('/v3/conveyancer/case');
    });

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------

    // v2 step 1 - create case

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
