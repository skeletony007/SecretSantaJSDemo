/**
 *
 * @function
 * @description Yearly function runs automagically ✨ every year ... at some point
 */
function year() {
  const storage = {
    file: DriveApp.getFileById(''), // TODO: Fill this in.
    backup: DriveApp.getFileById(''), // TODO: Fill this in.
    dataSchema: {
      state: [
        {
          name: 'string',
          stats: {
            meanRecipientWeight: 'number',
            previousRecipient: 'string',
            recipientRepeatFrequency: 'number',
            recipients: [{name: 'string', weight: 'number', frequency: 'number'}],
          },
        },
      ],
    },
  };

  const stateAsString = storage.file.getBlob().getDataAsString();
  const data = JSON.parse(stateAsString);

  validateJson(data, storage.dataSchema);

  const secretSanta = new SecretSanta(data.state);

  for (let name of data.participants) secretSanta.addParticipant(name);

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
  for (const contact of data.contacts) nameToEmail.set(contact.name, contact.email);

  const date = new Date();
  santaPairs.forEach(pair => {
    console.info(`🎄 Processing ${pair.name}.`);
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

  data.state = secretSanta.toJSON();
  const nextStateAsString = JSON.stringify(data);

  validateJson(data, storage.dataSchema);

  storage.backup.setContent(stateAsString);
  storage.file.setContent(nextStateAsString);
}

function test(years) {
  const secretSanta = new SecretSanta(data.state);

  for (let i = 0; i < years; i++) {
    validateJson(data, {
      state: [
        {
          name: 'string',
          stats: {
            meanRecipientWeight: 'number',
            previousRecipient: 'string',
            recipientRepeatFrequency: 'number',
            recipients: [{name: 'string', weight: 'number', frequency: 'number'}],
          },
        },
      ],
    });

    secretSanta.clear();

    for (let name of data.participants) secretSanta.addParticipant(name);

    const pairs = secretSanta.draw();

    data.state = secretSanta.toJSON();

    const recipients = new Set();
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (recipients.has(pair.recipient)) {
        throw new Error('Duplicate recipients found in Secret Santa pairs.');
      } else if (pair.name == pair.recipient) {
        throw new Error('Pair name matches recipient name in Secret Santa pairs.');
      } else {
        recipients.add(pair.recipient);
      }
    }
  }

  console.log(
    'Average number of repeated recipients per year:',
    data.state.reduce((acc, participant) => {
      return acc + participant.stats.recipientRepeatFrequency;
    }, 0) / years
  );

  return data;
}
