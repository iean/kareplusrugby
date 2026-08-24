/**
 * Kare Plus Rugby — rebuild the applicant screening form.
 *
 * WHAT THIS FIXES
 *   The current form asks ten questions and none of them is an email address
 *   or a phone number, so a completed application gives you no way to contact
 *   the person. It also does not auto-collect email, because that would force
 *   a Google sign-in. This script rebuilds the form so you always get contact
 *   details, and so nobody is asked to sign in.
 *
 * WHY THERE ARE NO FILE UPLOADS HERE
 *   A file upload question makes Google force every respondent to sign in to a
 *   Google account. That is a Google rule and no setting turns it off. Asking
 *   for documents on the FIRST form is what was blocking applicants. Documents
 *   now belong on the second form, sent once a coordinator has spoken to them.
 *
 * HOW TO RUN IT
 *   1. Open the form you want to rebuild, in edit mode.
 *   2. Three dots (top right) -> Apps Script.
 *   3. Delete whatever is in the editor, paste this whole file, Save.
 *   4. Press Run. Google will ask you to authorise it once - that is normal,
 *      it is your own script acting on your own form.
 *   5. Reload the form. Done.
 *
 * SAFETY
 *   This REPLACES every question. It refuses to run if the form already has
 *   responses, so you cannot lose data by accident. If you genuinely want to
 *   rebuild a form that has responses, make a copy of it first (File -> Make a
 *   copy), then set ALLOW_REBUILD_WITH_RESPONSES to true below.
 */

var ALLOW_REBUILD_WITH_RESPONSES = false;

function rebuildApplicationForm() {
  var form = FormApp.getActiveForm();

  if (form.getResponses().length > 0 && !ALLOW_REBUILD_WITH_RESPONSES) {
    throw new Error(
      'This form already has ' + form.getResponses().length + ' response(s). ' +
      'Make a copy of the form first (File > Make a copy), then either run this ' +
      'on the copy, or set ALLOW_REBUILD_WITH_RESPONSES = true.'
    );
  }

  // ---- Settings -----------------------------------------------------------
  // setCollectEmail(true) would force a Google sign-in, which is the exact
  // problem we are solving. Email is asked as a normal validated question
  // instead, so anyone can apply without a Google account.
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);

  form.setTitle('Apply to join Kare Plus Rugby');
  form.setDescription(
    'Thank you for your interest in working with us.\n\n' +
    'This takes about five minutes and you can do it on your phone. You do not ' +
    'need a Google account, and you do not need to upload anything yet.\n\n' +
    'We recruit care assistants, support workers and nurses across Rugby, ' +
    'Coventry, Leicester and Northampton. No care experience is needed - we ' +
    'train you.\n\n' +
    'Pay is £12.71 an hour plus 12.07% holiday pay, which is £14.24 for every ' +
    'hour you work. Travel time between calls is paid.'
  );

  // Wipe the old questions. Backwards, so indexes stay valid as we delete.
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) form.deleteItem(items[i]);

  // ---- 1. How we reach you -----------------------------------------------
  // First, and required. This is the part that was missing entirely.
  form.addSectionHeaderItem()
    .setTitle('1. How we reach you')
    .setHelpText('A coordinator will contact you about next steps, usually within a few working days.');

  form.addTextItem()
    .setTitle('Your full name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email address')
    .setHelpText('We send interview invitations here, so please check it is right.')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Please enter a valid email address, for example name@example.com')
        .requireTextIsEmail()
        .build()
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Mobile number')
    .setHelpText('Shifts often come up at short notice, so a number we can call or text matters.')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Please enter a UK phone number, for example 07700 900123.')
        .requireTextMatchesPattern('^[\\s\\+\\(\\)0-9]{10,20}$')
        .build()
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Your town or postcode')
    .setHelpText('This is how we work out which shifts are realistically close to you. A postcode is ideal.')
    .setRequired(true);

  // ---- 2. Where and when you can work ------------------------------------
  form.addPageBreakItem()
    .setTitle('2. Where and when you can work')
    .setHelpText('Tell us what actually suits you. We would rather match you properly than offer you hours you cannot get to.');

  form.addCheckboxItem()
    .setTitle('Which areas could you work in?')
    .setHelpText('Tick every area that works for you.')
    .setChoiceValues(['Rugby', 'Coventry', 'Leicester and Leicestershire', 'Northampton and Northamptonshire'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('What kind of work are you interested in?')
    .setChoiceValues([
      'Visiting people in their own homes',
      'Shifts in care homes',
      'Supported living',
      'I am not sure yet - happy to be advised'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('When are you available?')
    .setHelpText('Tick everything you could do.')
    .setChoiceValues([
      'Weekday daytimes',
      'Weekday evenings',
      'Nights',
      'Weekends',
      'Bank / flexible shifts as they come up'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Do you drive?')
    .setHelpText('Not essential everywhere, but it opens up more work in the villages and across Northamptonshire.')
    .setChoiceValues([
      'Yes, and I have use of a car',
      'Yes, but I do not have a car at the moment',
      'No, I do not drive'
    ])
    .setRequired(true);

  // ---- 3. Experience and checks ------------------------------------------
  form.addPageBreakItem()
    .setTitle('3. Experience and checks')
    .setHelpText('Honest answers help us place you well. "No" to any of these does not rule you out.');

  form.addListItem()
    .setTitle('How long have you worked in care in the UK?')
    .setChoiceValues([
      'None yet - this would be my first care role',
      'Less than 6 months',
      '6 months to 1 year',
      '1 to 3 years',
      'More than 3 years'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Do you have an enhanced DBS check?')
    .setHelpText('If you do not have one, we will arrange it. It is not a barrier to applying.')
    .setChoiceValues([
      'Yes, and it is on the DBS Update Service',
      'Yes, but it is not on the Update Service',
      'No, I do not have one yet'
    ])
    .setRequired(true);

  // Replaces the free-text "Visa status?" question. Asking about the right to
  // work is lawful and necessary; asking for visa or nationality details at
  // screening invites information you should not be selecting on.
  form.addMultipleChoiceItem()
    .setTitle('Do you have the right to work in the UK?')
    .setHelpText('We check documents for everyone we take on, at the same stage, whoever they are.')
    .setChoiceValues([
      'Yes, with no restrictions',
      'Yes, with a visa that allows this work',
      'I would need sponsorship'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Is there anything else you would like us to know?')
    .setHelpText('Optional. Previous roles, training you have done, hours you need to work around, anything at all.')
    .setRequired(false);

  form.addListItem()
    .setTitle('How did you hear about us?')
    .setChoiceValues(['Our website', 'Indeed or another job site', 'Facebook', 'A friend or family member', 'Someone who works here', 'Other'])
    .setRequired(false);

  // ---- 4. Consent ---------------------------------------------------------
  // UK GDPR Article 13: applicants must be told what happens to their data.
  form.addPageBreakItem()
    .setTitle('4. Before you send it')
    .setHelpText('One last thing, and then you are done.');

  form.addCheckboxItem()
    .setTitle('Please confirm')
    .setHelpText(
      'We use what you have told us to consider you for work and to contact you ' +
      'about it. We keep it for up to 12 months and we do not share it with ' +
      'anyone outside Kare Plus Rugby. You can ask us to delete it at any time ' +
      'by emailing kp.rugby@kareplus.co.uk. Full details are in the privacy ' +
      'policy at www.kareplusrugby.co.uk/privacy-policy'
    )
    .setChoiceValues(['I understand how my information will be used'])
    .setRequired(true);

  // Equal opportunities, deliberately last and deliberately optional.
  // The old form asked gender as a REQUIRED screening question. Gender is a
  // protected characteristic under the Equality Act 2010, and requiring it as
  // part of screening looks like you are selecting on it. Monitoring is fine -
  // it just has to be optional, separated, and visibly not part of the decision.
  form.addSectionHeaderItem()
    .setTitle('Equal opportunities monitoring (optional)')
    .setHelpText(
      'This is optional and is NOT used to decide who we take on. It only helps ' +
      'us check we are reaching people fairly. You can skip it and it will make ' +
      'no difference to your application.'
    );

  form.addMultipleChoiceItem()
    .setTitle('Gender')
    .setChoiceValues(['Male', 'Female', 'Prefer to self-describe', 'Prefer not to say'])
    .setRequired(false);

  form.setConfirmationMessage(
    'Thank you - we have got your application.\n\n' +
    'A care coordinator will be in touch, normally within a few working days. ' +
    'If you would rather talk to someone now, call us on 01788 422422 or email ' +
    'kp.rugby@kareplus.co.uk.\n\n' +
    'Nothing else is needed from you at this stage. We will ask for documents ' +
    'like your ID and references once we have spoken.'
  );

  Logger.log('Done. Rebuilt "%s" with %s items.', form.getTitle(), form.getItems().length);
}
