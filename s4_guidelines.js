const S4_SCORING_GRID = {
  S1: {
    Greeting: { ME: 3, BE: 0 },
    Reflect: { ME: 15, BE: 0 },
    Authenticate: { HE: 4, ME: 2, BE: 0 }
  },
  S2: {
    Probe: { HE: 7, ME: 4, BE: 0 },
    Resolve: { HE: 14, ME: 7, BE: 0 },
    BuildValue: { ME: 6, BE: 0 }
  },
  S3: {
    Transition: { ME: 3, BE: 0 },
    Present: { HE: 6, ME: 3, BE: 0 },
    Close: { ME: 4, BE: 0 }
  },
  S4: {
    Summarize: { ME: 7, BE: 0 },
    CloseContact: { HE: 4, ME: 4, BE: 0 },
    Documentation: { ME: 3, BE: 0 }
  },
  Behaviors: {
    Tone: { ME: 3, BE: 0 },
    Listening: { ME: 3, BE: 0 },
    Contact: { ME: 3, BE: 0 },
    Responsibility: { ME: 4, BE: 0 },
    Rapport: { ME: 4, BE: 0 }
  }
};

function evaluateS4Response(text, stage, conversationHistory) {
  let comment = `*${stage}: `;
  let score = 0;
  let scores = {};

  const lowerText = text.toLowerCase();

  if (stage === 'S1') {
    // Greeting
    if (lowerText.match(/comcast/i) && lowerText.match(/this is/i) && lowerText.match(/name please|assist/i)) {
      comment += `Greeting ME (3), `;
      score += S4_SCORING_GRID.S1.Greeting.ME;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.ME;
    } else {
      comment += `Greeting BE (0), `;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.BE;
    }

    // Reflect
    if (conversationHistory.some(msg => msg.content.match(/bill doubled/i)) && lowerText.match(/sorry|inconvenience/i)) {
      comment += `Reflect ME (15), `;
      score += S4_SCORING_GRID.S1.Reflect.ME;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.ME;
    } else if (conversationHistory.length > 0) {
      comment += `Reflect BE (0), `;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.BE;
    }

    // Authenticate
    if (lowerText.match(/verify|account number|address|telephone|name please/i)) {
      if (lowerText.match(/may i/i)) {
        comment += `Authenticate HE (4), `;
        score += S4_SCORING_GRID.S1.Authenticate.HE;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.HE;
      } else {
        comment += `Authenticate ME (2), `;
        score += S4_SCORING_GRID.S1.Authenticate.ME;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.ME;
      }
    } else {
      comment += `Authenticate BE (0), `;
      scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.BE;
    }
  } else if (stage === 'S2') {
    // Probe
    if (lowerText.match(/check|verify|describe/i)) {
      comment += `Probe ME (4), `;
      score += S4_SCORING_GRID.S2.Probe.ME;
      scores.Probe = S4_SCORING_GRID.S2.Probe.ME;
    } else {
      comment += `Probe BE (0), `;
      scores.Probe = S4_SCORING_GRID.S2.Probe.BE;
    }

    // Resolve
    if (lowerText.match(/fixed|corrected|take care of/i)) {
      if (lowerText.match(/reason/i)) {
        comment += `Resolve HE (14), `;
        score += S4_SCORING_GRID.S2.Resolve.HE;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.HE;
      } else {
        comment += `Resolve ME (7), `;
        score += S4_SCORING_GRID.S2.Resolve.ME;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.ME;
      }
    } else {
      comment += `Resolve BE (0), `;
      scores.Resolve = S4_SCORING_GRID.S2.Resolve.BE;
    }

    // Build Value
    if (lowerText.match(/email|online|self-service/i)) {
      comment += `BuildValue ME (6), `;
      score += S4_SCORING_GRID.S2.BuildValue.ME;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.ME;
    } else {
      comment += `BuildValue BE (0), `;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.BE;
    }
  } else if (stage === 'S3') {
    // Transition
    if (lowerText.match(/offer|discount|best value/i)) {
      comment += `Transition ME (3), `;
      score += S4_SCORING_GRID.S3.Transition.ME;
      scores.Transition = S4_SCORING_GRID.S3.Transition.ME;
    } else {
      comment += `Transition BE (0), `;
      scores.Transition = S4_SCORING_GRID.S3.Transition.BE;
    }

    // Present
    if (lowerText.match(/recommend|benefits|discount/i)) {
      if (lowerText.match(/50%/i)) {
        comment += `Present HE (6), `;
        score += S4_SCORING_GRID.S3.Present.HE;
        scores.Present = S4_SCORING_GRID.S3.Present.HE;
      } else {
        comment += `Present ME (3), `;
        score += S4_SCORING_GRID.S3.Present.ME;
        scores.Present = S4_SCORING_GRID.S3.Present.ME;
      }
    } else {
      comment += `Present BE (0), `;
      scores.Present = S4_SCORING_GRID.S3.Present.BE;
    }

    // Close
    if (lowerText.match(/schedule|callback/i)) {
      comment += `Close ME (4), `;
      score += S4_SCORING_GRID.S3.Close.ME;
      scores.Close = S4_SCORING_GRID.S3.Close.ME;
    } else {
      comment += `Close BE (0), `;
      scores.Close = S4_SCORING_GRID.S3.Close.BE;
    }
  } else if (stage === 'S4') {
    // Summarize
    if (lowerText.match(/recap|corrected|next steps/i)) {
      comment += `Summarize ME (7), `;
      score += S4_SCORING_GRID.S4.Summarize.ME;
      scores.Summarize = S4_SCORING_GRID.S4.Summarize.ME;
    } else {
      comment += `Summarize BE (0), `;
      scores.Summarize = S4_SCORING_GRID.S4.Summarize.BE;
    }

    // Close Contact
    if (lowerText.match(/anything else|thank you|lovely day/i)) {
      if (lowerText.match(/pleasure|lovely/i)) {
        comment += `CloseContact HE (4), `;
        score += S4_SCORING_GRID.S4.CloseContact.HE;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.HE;
      } else {
        comment += `CloseContact ME (4), `;
        score += S4_SCORING_GRID.S4.CloseContact.ME;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.ME;
      }
    } else {
      comment += `CloseContact BE (0), `;
      scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.BE;
    }

    // Documentation
    comment += `Documentation ME (3), `;
    score += S4_SCORING_GRID.S4.Documentation.ME;
    scores.Documentation = S4_SCORING_GRID.S4.Documentation.ME;
  }

  // Behaviors
  if (lowerText.match(/sorry|please|thank you/i)) {
    comment += `Tone ME (3), Rapport ME (4), `;
    score += S4_SCORING_GRID.Behaviors.Tone.ME + S4_SCORING_GRID.Behaviors.Rapport.ME;
    scores.Tone = S4_SCORING_GRID.Behaviors.Tone.ME;
    scores.Rapport = S4_SCORING_GRID.Behaviors.Rapport.ME;
  } else {
    comment += `Tone BE (0), Rapport BE (0), `;
    scores.Tone = S4_SCORING_GRID.Behaviors.Tone.BE;
    scores.Rapport = S4_SCORING_GRID.Behaviors.Rapport.BE;
  }
  comment += `Listening ME (3), Contact ME (3), Responsibility ME (4), `;
  score += S4_SCORING_GRID.Behaviors.Listening.ME + S4_SCORING_GRID.Behaviors.Contact.ME + S4_SCORING_GRID.Behaviors.Responsibility.ME;
  scores.Listening = S4_SCORING_GRID.Behaviors.Listening.ME;
  scores.Contact = S4_SCORING_GRID.Behaviors.Contact.ME;
  scores.Responsibility = S4_SCORING_GRID.Behaviors.Responsibility.ME;

  comment += `Score: ${score}*`;
  return { comment, score, scores };
}

export { S4_SCORING_GRID, evaluateS4Response };
