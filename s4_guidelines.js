const S4_SCORING_GRID = {
  S1: {
    Greeting: { HE: 3, ME: 3, BE: 0, weight: 0.03 },
    Reflect: { ME: 15, BE: 0, weight: 0.15 },
    Authenticate: { HE: 4, ME: 2, BE: 0, weight: 0.04 }
  },
  S2: {
    Probe: { HE: 7, ME: 4, BE: 0, weight: 0.07 },
    Resolve: { HE: 14, ME: 7, BE: 0, weight: 0.14 },
    BuildValue: { ME: 6, BE: 0, weight: 0.06 }
  },
  S3: {
    Transition: { HE: 6, ME: 3, BE: 0, weight: 0.06 },
    Present: { HE: 6, ME: 3, BE: 0, weight: 0.06 },
    Objections: { HE: 4, ME: 2, BE: 0, weight: 0.04 },
    Close: { ME: 4, BE: 0, weight: 0.04 }
  },
  S4: {
    Summarize: { HE: 7, ME: 7, BE: 0, weight: 0.07 },
    CloseContact: { HE: 4, ME: 4, BE: 0, weight: 0.04 },
    Documentation: { HE: 3, ME: 3, BE: 0, weight: 0.03 }
  },
  Behaviors: {
    Tone: { ME: 3, BE: 0, weight: 0.03 },
    Listening: { ME: 3, BE: 0, weight: 0.03 },
    Contact: { ME: 3, BE: 0, weight: 0.03 },
    Responsibility: { ME: 4, BE: 0, weight: 0.04 },
    Rapport: { ME: 4, BE: 0, weight: 0.04 }
  }
};

const S4_CRITERIA = {
  S1: {
    Greeting: {
      ME: "Must include Comcast name, agent’s first name, and offer of assistance, delivered clearly.",
      Example: "Thank you for choosing Comcast, my name is Maria. How may I help you today?"
    },
    Reflect: {
      ME: "Must reflect customer’s reason for call, empathize without blaming Comcast, assure action.",
      Example: "I’m sorry you’re experiencing this issue. That can be frustrating. I’ll take care of it."
    },
    Authenticate: {
      ME: "Must verify caller (e.g., ask for name, account details).",
      HE: "Asks permission, verifies without SSN, plans account review.",
      Example: "For security purposes, may I ask who I’m speaking with?"
    }
  },
  S2: {
    Probe: {
      ME: "Asks questions to understand issue, engages customer.",
      HE: "Probes for root causes.",
      Example: "Can you describe when this issue started?"
    },
    Resolve: {
      ME: "Explains issue, resolves inquiry, uses tools.",
      HE: "Explains why issue occurred, educates customer.",
      Example: "I’ve fixed the billing error. You can check your bill online to confirm."
    },
    BuildValue: {
      ME: "Shares benefits of existing service or captures email.",
      Example: "Can I confirm your email for service updates?"
    }
  },
  S3: {
    Transition: {
      ME: "Bridges to sales after resolution.",
      HE: "Uses discovery questions.",
      Example: "Now that we’ve fixed your issue, I’d like to ensure you’re getting the best value."
    },
    Present: {
      ME: "Shares benefits of product.",
      HE: "Includes total bill, multiple benefits.",
      Example: "I recommend our mobile service for a 50% discount."
    },
    Objections: {
      ME: "Acknowledges objection, re-emphasizes benefits.",
      HE: "Tailors response to needs.",
      Example: "I understand it’s a cost, but it’ll save you money long-term."
    },
    Close: {
      ME: "Asks for sale or schedules callback.",
      Example: "Can I schedule a callback to set this up?"
    }
  },
  S4: {
    Summarize: {
      ME: "Recaps actions, provides next steps.",
      HE: "Thoroughly documents resolution.",
      Example: "We’ve corrected your bill to $200. You’ll see this next month."
    },
    CloseContact: {
      ME: "Offers further assistance, expresses appreciation.",
      HE: "Personalizes closing.",
      Example: "Is there anything else I can help with? Have a great day!"
    },
    Documentation: {
      ME: "Documents caller, reason, actions.",
      Example: "I’ve noted the billing correction on your account."
    }
  },
  Behaviors: {
    Tone: { ME: "Professional, pleasant, clear." },
    Listening: { ME: "No interruptions, refers to customer input." },
    Contact: { ME: "Minimizes dead air, explains holds." },
    Responsibility: { ME: "Assures resolution, avoids negatives." },
    Rapport: { ME: "Shows interest, acknowledges feelings." }
  }
};

function evaluateS4Response(text, stage, conversationHistory) {
  let comment = `<b>${stage} Evaluation:</b><br>`;
  let score = 0;
  let scores = {};

  const lowerText = text.toLowerCase();

  if (stage === 'S1') {
    // Greeting
    if (lowerText.match(/comcast/i) && lowerText.match(/my name is|this is/i) && lowerText.match(/(help|assist|name please)/i)) {
      comment += `<i>Greeting: Meets Expectations. ${S4_CRITERIA.S1.Greeting.ME}</i><br>`;
      score += S4_SCORING_GRID.S1.Greeting.ME;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.ME;
    } else {
      comment += `<i>Greeting: Below Expectations. Missing elements. Recommended: "${S4_CRITERIA.S1.Greeting.Example}"</i><br>`;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.BE;
    }

    // Reflect
    if (conversationHistory.some(msg => msg.content.match(/bill doubled/i)) && lowerText.match(/(sorry|inconvenience)/i)) {
      comment += `<i>Reflect: Meets Expectations. ${S4_CRITERIA.S1.Reflect.ME}</i><br>`;
      score += S4_SCORING_GRID.S1.Reflect.ME;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.ME;
    } else if (conversationHistory.length > 0) {
      comment += `<i>Reflect: Below Expectations. Fails to empathize. Recommended: "${S4_CRITERIA.S1.Reflect.Example}"</i><br>`;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.BE;
    }

    // Authenticate
    if (lowerText.match(/(verify|account number|address|telephone)/i)) {
      if (lowerText.match(/may i/i)) {
        comment += `<i>Authenticate: Highly Effective. ${S4_CRITERIA.S1.Authenticate.HE}</i><br>`;
        score += S4_SCORING_GRID.S1.Authenticate.HE;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.HE;
      } else {
        comment += `<i>Authenticate: Meets Expectations. ${S4_CRITERIA.S1.Authenticate.ME}</i><br>`;
        score += S4_SCORING_GRID.S1.Authenticate.ME;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.ME;
      }
    } else {
      comment += `<i>Authenticate: Below Expectations. No verification. Recommended: "${S4_CRITERIA.S1.Authenticate.Example}"</i><br>`;
      scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.BE;
    }
  } else if (stage === 'S2') {
    // Probe
    if (lowerText.match(/(check|verify|describe)/i)) {
      comment += `<i>Probe: Meets Expectations. ${S4_CRITERIA.S2.Probe.ME}</i><br>`;
      score += S4_SCORING_GRID.S2.Probe.ME;
      scores.Probe = S4_SCORING_GRID.S2.Probe.ME;
    } else {
      comment += `<i>Probe: Below Expectations. No questions asked. Recommended: "${S4_CRITERIA.S2.Probe.Example}"</i><br>`;
      scores.Probe = S4_SCORING_GRID.S2.Probe.BE;
    }

    // Resolve
    if (lowerText.match(/(fixed|corrected|take care of)/i)) {
      if (lowerText.match(/explain|reason/i)) {
        comment += `<i>Resolve: Highly Effective. ${S4_CRITERIA.S2.Resolve.HE}</i><br>`;
        score += S4_SCORING_GRID.S2.Resolve.HE;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.HE;
      } else {
        comment += `<i>Resolve: Meets Expectations. ${S4_CRITERIA.S2.Resolve.ME}</i><br>`;
        score += S4_SCORING_GRID.S2.Resolve.ME;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.ME;
      }
    } else {
      comment += `<i>Resolve: Below Expectations. Issue not addressed. Recommended: "${S4_CRITERIA.S2.Resolve.Example}"</i><br>`;
      scores.Resolve = S4_SCORING_GRID.S2.Resolve.BE;
    }

    // Build Value
    if (lowerText.match(/(email|online|self-service)/i)) {
      comment += `<i>Build Value: Meets Expectations. ${S4_CRITERIA.S2.BuildValue.ME}</i><br>`;
      score += S4_SCORING_GRID.S2.BuildValue.ME;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.ME;
    } else {
      comment += `<i>Build Value: Below Expectations. No value shared. Recommended: "${S4_CRITERIA.S2.BuildValue.Example}"</i><br>`;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.BE;
    }
  } else if (stage === 'S3') {
    // Transition
    if (lowerText.match(/(review|best value|offer)/i)) {
      comment += `<i>Transition: Meets Expectations. ${S4_CRITERIA.S3.Transition.ME}</i><br>`;
      score += S4_SCORING_GRID.S3.Transition.ME;
      scores.Transition = S4_SCORING_GRID.S3.Transition.ME;
    } else {
      comment += `<i>Transition: Below Expectations. No sales bridge. Recommended: "${S4_CRITERIA.S3.Transition.Example}"</i><br>`;
      scores.Transition = S4_SCORING_GRID.S3.Transition.BE;
    }

    // Present Offer
    if (lowerText.match(/(recommend|benefits|discount)/i)) {
      if (lowerText.match(/50%/i)) {
        comment += `<i>Present: Highly Effective. ${S4_CRITERIA.S3.Present.HE}</i><br>`;
        score += S4_SCORING_GRID.S3.Present.HE;
        scores.Present = S4_SCORING_GRID.S3.Present.HE;
      } else {
        comment += `<i>Present: Meets Expectations. ${S4_CRITERIA.S3.Present.ME}</i><br>`;
        score += S4_SCORING_GRID.S3.Present.ME;
        scores.Present = S4_SCORING_GRID.S3.Present.ME;
      }
    } else {
      comment += `<i>Present: Below Expectations. No benefits shared. Recommended: "${S4_CRITERIA.S3.Present.Example}"</i><br>`;
      scores.Present = S4_SCORING_GRID.S3.Present.BE;
    }

    // Close
    if (lowerText.match(/(schedule|set up|callback)/i)) {
      comment += `<i>Close: Meets Expectations. ${S4_CRITERIA.S3.Close.ME}</i><br>`;
      score += S4_SCORING_GRID.S3.Close.ME;
      scores.Close = S4_SCORING_GRID.S3.Close.ME;
    } else {
      comment += `<i>Close: Below Expectations. No close attempt. Recommended: "${S4_CRITERIA.S3.Close.Example}"</i><br>`;
      scores.Close = S4_SCORING_GRID.S3.Close.BE;
    }
  } else if (stage === 'S4') {
    // Summarize
    if (lowerText.match(/(recap|corrected|next steps)/i)) {
      comment += `<i>Summarize: Meets Expectations. ${S4_CRITERIA.S4.Summarize.ME}</i><br>`;
      score += S4_SCORING_GRID.S4.Summarize.ME;
      scores.Summarize = S4_SCORING_GRID.S4.Summarize.ME;
    } else {
      comment += `<i>Summarize: Below Expectations. No recap. Recommended: "${S4_CRITERIA.S4.Summarize.Example}"</i><br>`;
      scores.Summarize = S4_SCORING_GRID.S4.Summarize.BE;
    }

    // Close Contact
    if (lowerText.match(/(anything else|thank you|lovely day)/i)) {
      if (lowerText.match(/pleasure|lovely/i)) {
        comment += `<i>Close Contact: Highly Effective. ${S4_CRITERIA.S4.CloseContact.HE}</i><br>`;
        score += S4_SCORING_GRID.S4.CloseContact.HE;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.HE;
      } else {
        comment += `<i>Close Contact: Meets Expectations. ${S4_CRITERIA.S4.CloseContact.ME}</i><br>`;
        score += S4_SCORING_GRID.S4.CloseContact.ME;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.ME;
      }
    } else {
      comment += `<i>Close Contact: Below Expectations. No assistance offered. Recommended: "${S4_CRITERIA.S4.CloseContact.Example}"</i><br>`;
      scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.BE;
    }

    // Documentation
    scores.Documentation = S4_SCORING_GRID.S4.Documentation.ME;
    comment += `<i>Documentation: Meets Expectations. ${S4_CRITERIA.S4.Documentation.ME}</i><br>`;
    score += S4_SCORING_GRID.S4.Documentation.ME;
  }

  // Behaviors
  if (lowerText.match(/(sorry|please|thank you)/i)) {
    comment += `<i>Tone/Rapport: Meets Expectations. ${S4_CRITERIA.Behaviors.Tone.ME}</i><br>`;
    score += S4_SCORING_GRID.Behaviors.Tone.ME + S4_SCORING_GRID.Behaviors.Rapport.ME;
    scores.Tone = S4_SCORING_GRID.Behaviors.Tone.ME;
    scores.Rapport = S4_SCORING_GRID.Behaviors.Rapport.ME;
  } else {
    comment += `<i>Tone/Rapport: Below Expectations. Lacks politeness. Recommended: "Thank you for calling Comcast."</i><br>`;
    scores.Tone = S4_SCORING_GRID.Behaviors.Tone.BE;
    scores.Rapport = S4_SCORING_GRID.Behaviors.Rapport.BE;
  }
  scores.Listening = S4_SCORING_GRID.Behaviors.Listening.ME;
  scores.Contact = S4_SCORING_GRID.Behaviors.Contact.ME;
  scores.Responsibility = S4_SCORING_GRID.Behaviors.Responsibility.ME;
  score += S4_SCORING_GRID.Behaviors.Listening.ME + S4_SCORING_GRID.Behaviors.Contact.ME + S4_SCORING_GRID.Behaviors.Responsibility.ME;

  return { comment, score, scores };
}

export { S4_SCORING_GRID, S4_CRITERIA, evaluateS4Response };
