var express = require('express')
var router = express.Router()
var moment = require('moment')

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/start-page', function (req, res) {
  req.session.destroy()
  res.render('start-page')
})

router.get('/event-dates-routing', function (req, res) {
    // get the answer from the query string
  var eventStartDate = req.session.data['event-start-date']
  var eventEndDate = req.session.data['event-end-date']
  var arrayStart = eventStartDate.split('/')
  var arrayEnd = eventEndDate.split('/')
  var parsedEventStartDate = new Date(arrayStart[2] + '/' + arrayStart[1] + '/' + arrayStart[0])
  var parsedEventEndDate = new Date(arrayEnd[2] + '/' + arrayEnd[1] + '/' + arrayEnd[0])
  var diffDates = parseInt((parsedEventEndDate - parsedEventStartDate) / (1000 * 60 * 60 * 24))
  var today = new Date()
  var fiveDays = new Date()
  var dateList = []
  fiveDays.setDate(today.getDate() + 5)
  var tenDays = new Date()
  tenDays.setDate(today.getDate() + 10)
  for (var i = 0; i < diffDates + 1; i++) {
      var thisDate = new Date()
      thisDate.setTime(parsedEventStartDate.getTime() + i * 86400000)
      dateList.push(moment(thisDate).format('D MMM YYYY'))
  }
  req.session.data['event-dates'] = dateList
  if (parseInt(diffDates) > 7) {
    // redirect to the relevant page
    res.redirect('ineligible/duration')
  } else if (parsedEventStartDate < fiveDays) {
    // redirect to the relevant page
    res.redirect('ineligible/too-late')
  } else if (parsedEventStartDate < tenDays) {
    // redirect to the relevant page
    res.redirect('ineligible/late')
  } else {
    // render the page requested
    res.render('event-capacity')
  }
})

router.get('/licensable-activities', function (req, res) {
    // get the answer from the query string
  var eventCapacity = req.session.data['event-capacity']
  if (parseInt(eventCapacity) > 499) {
        // redirect to the relevant page
    res.redirect('ineligible/attendance')
  } else {
        // render the page requested
    res.render('licensable-activities')
  }
})

router.get('/licensable-activity-alcohol-v3', function (req, res) {
    // get the answer from the query string
  var licensableActivities = req.session.data['licensable-activities']
  if (licensableActivities == 'None') { // use == for checkboxes
        // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else if (licensableActivities.indexOf('Alcohol') !== -1) {
        // render the page requested
    res.render('licensable-activity-alcohol-v3')
  } else {
        // redirect to the relevant page
    res.redirect('licensable-activity-members')
  }
})

router.get('/licensable-activity-members', function (req, res) {
    // get the answer from the query string
  var licensableActivities = req.session.data['licensable-activities']
  if (licensableActivities.indexOf('Members') !== -1) {
        // render the page requested
    res.render('licensable-activity-members')
  } else {
        // redirect to the relevant page
    res.redirect('licensable-activity-entertainment')
  }
})

router.get('/licensable-activity-entertainment', function (req, res) {
    // get the answer from the query string
  var licensableActivities = req.session.data['licensable-activities']
  if (licensableActivities.indexOf('Entertainment') !== -1) {
        // render the page requested
    res.render('licensable-activity-entertainment')
  } else {
        // redirect to the relevant page
    res.redirect('licensable-activity-nudity')
  }
})

router.get('/licensable-activity-nudity', function (req, res) {
    // get the answer from the query string
  var licensableActivities = req.session.data['licensable-activities']
  if (licensableActivities.indexOf('Nudity') !== -1) {
        // render the page requested
    res.render('licensable-activity-nudity')
  } else {
        // redirect to the relevant page
    res.redirect('licensable-activity-food')
  }
})

router.get('/licensable-activity-food', function (req, res) {
    // get the answer from the query string
  var licensableActivities = req.session.data['licensable-activities']
  if (licensableActivities.indexOf('Food') !== -1) {
        // render the page requested
    res.render('licensable-activity-food')
  } else {
        // redirect to the relevant page
    res.redirect('event-description')
  }
})

router.get('/ten-required', function (req, res) {
  // get the answer from the query string
  var existingLicence = req.session.data['existing-licence']
  var licenceCover = req.session.data['licence-cover']
  if (existingLicence === 'yes' && licenceCover === 'yes') {
    // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else {
    // render the page requested
    res.render('ten-required')
  }
})

router.get('/previous-event-description', function (req, res) {
  // get the answer from the query string
  var previousLicence = req.session.data['previous-licence']
  if (previousLicence == 'no') { // use == for checkboxes
    // redirect to the relevant page
    res.redirect('task-list#event-details')
  } else {
    // render the page requested
    res.render('previous-event-description')
  }
})

router.get('/event-description', function (req, res) {
  // get the answer from the query string
  var duration = req.session.data['event-duration']

  if (duration === 'over-seven-days') {
    res.redirect('ineligible')
  } else {
    res.render('event-description')
  }
})

router.get('/previous-events-close', function (req, res) {
    // get the answer from the query string
  var personalLicence = req.session.data['personal-licence']
  var previousNotice = req.session.data['previous-notice']
  var previousNoticeStandard = req.session.data['previous-notice-standard-num']
  var previousNoticeLate = req.session.data['previous-notice-late-num']
  var numStandard = previousNotice.indexOf('standard') > -1 ? parseInt(previousNoticeStandard) || 0 : 0
  var numLate = previousNotice.indexOf('late') > -1 ? parseInt(previousNoticeLate) || 0 : 0
  if (personalLicence == 'yes') { // use == for checkboxes
    if (numLate < 10 && numStandard + numLate < 50) {
            // render the page requested
      res.render('previous-events-close')
    } else {
            // redirect to the relevant page
      res.redirect('ineligible/limit')
    }
  } else {
    if (numLate < 2 && numStandard + numLate < 5) {
            // render the page requested
      res.render('previous-events-close')
    } else {
            // redirect to the relevant page
      res.redirect('ineligible/limit')
    }
  }
})

router.get('/contact-address', function (req, res) {
    // get the answer from the query string
  var previousEventsClose = req.session.data['previous-events-close']
  if (previousEventsClose.indexOf('before') > -1) {
        // redirect to the relevant page
    res.redirect('ineligible/before')
  } else if (previousEventsClose.indexOf('after') > -1) {
        // redirect to the relevant page
    res.redirect('ineligible/after')
  } else {
        // render the page requested
    res.render('contact-address')
  }
})

router.get('/agent-details-postcode', function (req, res) {
    // get the answer from the query string
  var applicant = req.session.data['applicant-type']

  if (applicant == 'applicant') {
    res.redirect('contact-details')
  } else {
    res.render('agent-details-postcode')
  }
})

router.get('/timeout', function (req, res) {
  req.session.destroy()
  res.render('timeout')
})

module.exports = router
