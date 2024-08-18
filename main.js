/**
 *
 * @function
 * @description Yearly function runs automagically ✨ every year ... at some point
 */
function year() {
  const storage = {
    file: DriveApp.getFileById(''), // TODO: Fill this in.
    backup: DriveApp.getFileById(''), // TODO: Fill this in.
    stateSchema: {
      people: [
        {
          name: 'string',
          email: 'string',
          recipients: [{name: 'string', weight: 'number', frequency: 'number'}],
          stats: {recipientRepeatFrequency: 'number', previousRecipient: 'string'},
        },
      ],
    },
  };

  const stateAsString = storage.file.getBlob().getDataAsString();
  const state = JSON.parse(stateAsString);

  validateJson(state, storage.stateSchema);

  const secretSanta = new SecretSanta(state);
  const santaPairs = secretSanta.draw();

  const recipients = new Set();
  for (let i = 0; i < santaPairs.length; i++) {
    const pair = santaPairs[i];
    if (recipients.has(pair.recipient)) {
      throw new Error('Duplicate recipients found in Secret Santa pairs. Emails will not be sent.');
    } else if (pair.name == pair.recipient) {
      throw new Error('Pair name matches recipient name in Secret Santa pairs. Emails will not be sent.');
    } else {
      recipients.add(pair.recipient);
    }
  }

  const nameToEmail = new Map();
  for (const person of state.people) {
    nameToEmail.set(person.name, person.email);
  }

  const date = new Date();
  santaPairs.forEach(pair => {
    console.info(`🎄 ${pair.name} has ${pair.recipient} for Secret Santa.`);
    MailApp.sendEmail({
      to: nameToEmail.get(pair.name),
      subject: `Secret Santa ${date.getFullYear()} results for ${pair.name}`,
      htmlBody: `
          <p style="display:none; font-size:0; color:#ffffff; line-height:0; max-height:0; max-width:0; opacity:0; overflow:hidden;">🎄 Open this email to find out who you have for Secret Santa this year! Maybe buy them some tasty dark chocolate?</p>
          <p>Hello ${pair.name},</p>
          <p>You have ${pair.recipient} for Secret Santa this year!</p>
        `,
    });
  });

  const nextDataAsString = JSON.stringify(secretSanta.toJSON());

  validateJson(nextDataAsString, storage.stateSchema);

  storage.backup.setContent(stateAsString);
  storage.file.setContent(nextDataAsString);
}

function test(years) {
  for (let i = 0; i < years; i++) {
    const secretSanta = new SecretSanta(state);
    const draw = secretSanta.draw();
    state = secretSanta.toJSON();

    validateJson(state, {
      people: [
        {
          name: 'string',
          email: 'string',
          recipients: [{name: 'string', weight: 'number', frequency: 'number'}],
          stats: {recipientRepeatFrequency: 'number', previousRecipient: 'string'},
        },
      ],
    });

    const recipients = new Set();
    for (let i = 0; i < draw.length; i++) {
      const pair = draw[i];
      if (recipients.has(pair.recipient)) {
        throw new Error('Duplicate recipients found in Secret Santa pairs. Emails will not be sent.');
      } else if (pair.name == pair.recipient) {
        throw new Error('Pair name matches recipient name in Secret Santa pairs. Emails will not be sent.');
      } else {
        recipients.add(pair.recipient);
      }
    }
  }

  console.log(
    'Average number of repeated recipients per year:',
    state.people.reduce((acc, person) => {
      return acc + person.stats.recipientRepeatFrequency;
    }, 0) / years
  );

  return state;
}
