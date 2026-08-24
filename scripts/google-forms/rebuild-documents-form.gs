/**
 * Kare Plus Rugby — rebuild the documents form (the second form).
 *
 * WHAT THIS FORM IS FOR
 *   Collecting documents from someone a coordinator has ALREADY spoken to.
 *   It is not the application. Do not put this link on the website and do not
 *   send it to someone who has not been contacted yet.
 *
 * WHY IT IS SEPARATE
 *   This form has file upload questions, and Google forces anyone answering a
 *   form with a file upload to sign in to a Google account. There is no
 *   setting that turns that off. That sign-in wall is fine here - by this
 *   point the person has spoken to you and wants the job, so they will push
 *   through it. It was NOT fine on the first form, where it was silently
 *   costing applicants before you ever heard from them.
 *
 *   If someone cannot sign in, that is not a dead end: tell them to email the
 *   documents to kp.rugby@kareplus.co.uk or send them on WhatsApp instead.
 *   The form is a convenience, not the only route.
 *
 * HOW TO RUN IT
 *   Open the SECOND form in edit mode -> three dots -> Apps Script -> paste
 *   this in -> Save -> Run -> authorise once. Reload the form.
 *
 * SAFETY
 *   Refuses to run if the form already has responses. See the note in
 *   rebuild-application-form.gs.
 */

var ALLOW_REBUILD_WITH_RESPONSES = false;

function rebuildDocumentsForm() {
  var form = FormApp.getActiveForm();

  if (form.getResponses().length > 0 && !ALLOW_REBUILD_WITH_RESPONSES) {
    throw new Error(
      'This form already has ' + form.getResponses().length + ' response(s). ' +
      'Make a copy first, or set ALLOW_REBUILD_WITH_RESPONSES = true.'
    );
  }

  // Sign-in is unavoidable here (file uploads), so we may as well take the
  // email address Google gives us - it saves the applicant typing it.
  safeSet('collectEmail', function () { form.setCollectEmail(true); });
  safeSet('limitOneResponse', function () { form.setLimitOneResponsePerUser(false); });
  // so they can come back and add a missing document
  safeSet('allowResponseEdits', function () { form.setAllowResponseEdits(true); });
  safeSet('progressBar', function () { form.setProgressBar(true); });
  safeSet('respondAgainLink', function () { form.setShowLinkToRespondAgain(false); });

  form.setTitle('Kare Plus Rugby - your documents');
  form.setDescription(
    'We have spoken about a role with us - this is where you send the documents ' +
    'we need before you can start.\n\n' +
    'Google will ask you to sign in to a Google account. That is because this ' +
    'form accepts file uploads; it is a Google requirement and we cannot switch ' +
    'it off. If you would rather not sign in, just email your documents to ' +
    'kp.rugby@kareplus.co.uk or send them to us on WhatsApp - that is completely fine.\n\n' +
    'A clear photo taken on your phone is fine for any of these. Nothing needs ' +
    'to be scanned.'
  );

  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) form.deleteItem(items[i]);

  // ---- Who this is ---------------------------------------------------------
  form.addSectionHeaderItem()
    .setTitle('First, so we can match this to your application')
    .setHelpText('Please use the same name you gave us when you applied.');

  form.addTextItem().setTitle('Your full name').setRequired(true);

  form.addTextItem()
    .setTitle('Mobile number')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Please enter a UK phone number, for example 07700 900123.')
        .requireTextMatchesPattern('^[\\s\\+\\(\\)0-9]{10,20}$')
        .build()
    )
    .setRequired(true);

  // ---- Right to work -------------------------------------------------------
  form.addPageBreakItem()
    .setTitle('Proof of your right to work')
    .setHelpText('We are legally required to check this for everyone before they start. We check it the same way for every person we take on.');

  form.addFileUploadItem()
    .setTitle('Photo ID')
    .setHelpText('Your passport photo page, or your BRP / eVisa share code screenshot, or your driving licence. One clear photo is enough.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Share code, if you have one')
    .setHelpText('Optional. If you have an eVisa or BRP you can give us your Home Office share code instead of uploading a document.')
    .setRequired(false);

  // ---- DBS -----------------------------------------------------------------
  form.addPageBreakItem()
    .setTitle('DBS')
    .setHelpText('If you do not have a DBS yet, skip this page - we will arrange one for you.');

  form.addFileUploadItem()
    .setTitle('Your DBS certificate')
    .setHelpText('Optional. Only if you already have one.')
    .setRequired(false);

  form.addTextItem()
    .setTitle('DBS certificate number')
    .setHelpText('Optional. Useful if you are on the Update Service, as we can check it online.')
    .setRequired(false);

  // ---- Training ------------------------------------------------------------
  form.addPageBreakItem()
    .setTitle('Training certificates')
    .setHelpText('Optional. If you have none of these it is genuinely not a problem - we will train you.');

  form.addFileUploadItem()
    .setTitle('Any training certificates you already have')
    .setHelpText('Care Certificate, moving and handling, safeguarding, medication, first aid, NVQ - whatever you have. You can attach more than one.')
    .setNumberOfFiles(10)
    .setRequired(false);

  form.addFileUploadItem()
    .setTitle('Your CV')
    .setHelpText('Optional, and only if you have one ready. We do not need a CV to take you on.')
    .setRequired(false);

  // ---- References ----------------------------------------------------------
  // Regulated activity: employment history and conduct evidence are required
  // under Schedule 3 of the Health and Social Care Act 2008 (Regulated
  // Activities) Regulations 2014.
  form.addPageBreakItem()
    .setTitle('References')
    .setHelpText('We need two. If you have not worked before, a college tutor, a volunteer supervisor or someone who has known you a long time in a professional capacity is fine - it just cannot be family.');

  form.addTextItem().setTitle('Reference 1 - name').setRequired(true);
  form.addTextItem().setTitle('Reference 1 - their relationship to you')
    .setHelpText('For example: my manager at [employer], my college tutor.').setRequired(true);
  form.addTextItem()
    .setTitle('Reference 1 - email address')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);
  form.addTextItem().setTitle('Reference 1 - phone number').setRequired(false);

  form.addTextItem().setTitle('Reference 2 - name').setRequired(true);
  form.addTextItem().setTitle('Reference 2 - their relationship to you').setRequired(true);
  form.addTextItem()
    .setTitle('Reference 2 - email address')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);
  form.addTextItem().setTitle('Reference 2 - phone number').setRequired(false);

  // UK GDPR Article 14: referees are people whose data you are collecting from
  // someone else. They have to be told, and the applicant should know that.
  form.addCheckboxItem()
    .setTitle('Please confirm')
    .setHelpText(
      'We will contact these people to ask for a reference, and we will tell ' +
      'them you gave us their details. Please make sure they are happy to be ' +
      'contacted before you submit this.'
    )
    .setChoiceValues(['I have their permission to give you their details'])
    .setRequired(true);

  form.setConfirmationMessage(
    'Thank you - we have got your documents.\n\n' +
    'We will check them and come back to you about starting. If anything is ' +
    'missing we will ring you rather than leave you wondering.\n\n' +
    'Any questions, call 01788 422422 or email kp.rugby@kareplus.co.uk.'
  );

  Logger.log('Done. Rebuilt "%s" with %s items.', form.getTitle(), form.getItems().length);
}

/**
 * Apply a form setting, tolerating the ones a given account or Workspace
 * configuration will not accept. Without this, one unsupported setting would
 * abort the whole rebuild and leave the form half-built.
 */
function safeSet(label, fn) {
  try { fn(); } catch (e) { Logger.log('Skipped setting "%s": %s', label, e.message); }
}
