const S4_SCORING_GRID = {
  S1: {
    Greeting: { HE: 3, ME: 3, BE: 0, weight: 0.03 },
    Reflect: { ME: 15, BE: 0, weight: 0.15 }, // Includes Reflect, Relate, Empathize
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
      ME: "Must include Comcast name, agent’s first name, and offer of assistance, delivered clearly and unrushed.",
      HE: "Same as ME (no additional criteria).",
      Example: "Thank you for choosing Comcast, my name is Maria. How may I help you today?"
    },
    Reflect: {
      ME: "Must reflect customer’s reason for call using their words, empathize without blaming Comcast, and assure action.",
      Example: "I’m sorry you’re experiencing this issue. That can be frustrating. I’ll take care of it."
    },
    Authenticate: {
      ME: "Must verify caller (e.g., ask for name) and set agenda.",
      HE: "Asks permission to ask questions, verifies without SSN, plans for account review.",
      Example: "For security purposes, may I ask who I’m speaking with?"
    }
  },
  S2: {
    Probe: {
      ME: "Asks open/closed-ended questions to understand issue, engages customer.",
      HE: "Asks follow-up questions to probe root causes.",
      Example: "Can you describe when this issue started?"
    },
    Resolve: {
      ME: "Explains issue, uses tools, resolves inquiry, addresses underlying needs.",
      HE: "Explains why issue occurred, educates customer, confirms resolution.",
      Example: "I’ve reset your modem to fix the outage. You can restart it this way if it happens again."
    },
    BuildValue: {
      ME: "Attempts email capture, shares benefits of existing service.",
      Example: "Can I confirm your email to send service updates?"
    }
  },
  S3: {
    Transition: {
      ME: "Bridges to sales after resolving issue, ties to customer needs.",
      HE: "Uses bridging statements, asks discovery questions.",
      Example: "Now that we’ve fixed your issue, I’d like to ensure you’re getting the best value."
    },
    Present: {
      ME: "Shares benefits of recommended product.",
      HE: "Presents as expert, discusses multiple benefits, includes total bill.",
      Example: "I recommend our high-speed Internet for your business needs."
    },
    Objections: {
      ME: "Acknowledges objection, re-emphasizes benefits.",
      HE: "Tailors response to customer needs, discusses alternatives.",
      Example: "I understand it’s a higher cost, but it’ll improve your speed significantly."
    },
    Close: {
      ME: "Asks for sale using closing techniques.",
      Example: "Can I set you up with this service today?"
    }
  },
  S4: {
    Summarize: {
      ME: "Recaps actions, provides next steps to prevent repeat calls.",
      HE: "Thoroughly documents resolution.",
      Example: "We’ve resolved your billing issue and updated your account."
    },
    CloseContact: {
      ME: "Offers further assistance, expresses appreciation.",
      HE: "Personalizes closing.",
      Example: "Is there anything else I can help with? Thank you for calling!"
    },
    Documentation: {
      ME: "Documents caller, reason, actions taken.",
      Example: "I’ve noted the billing correction on your account."
    }
  },
  Behaviors: {
    Tone: { ME: "Professional, pleasant, clear pace." },
    Listening: { ME: "Shows active listening, no interruptions." },
    Contact: { ME: "Minimizes dead air, explains holds." },
    Responsibility: { ME: "Assures issue resolution, avoids negatives." },
    Rapport: { ME: "Shows genuine interest, acknowledges feelings." }
  }
};

function evaluateS4Response(text, stage, conversationHistory) {
  let comment = `<b>${stage} Evaluation:</b><br>`;
  let score = 0;
  let scores = {};

  const lowerText = text.toLowerCase();

  if (stage === 'S1') {
    // Greeting
    if (lowerText.match(/comcast/i) && lowerText.match(/my name is/i) && lowerText.match(/(how may|can) i (help|assist)/i)) {
      comment += `Greeting: Meets Expectations. ${S4_CRITERIA.S1.Greeting.ME}<br>`;
      score += S4_SCORING_GRID.S1.Greeting.ME;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.ME;
    } else {
      comment += `Greeting: Below Expectations. Missing required elements. Recommended: "${S4_CRITERIA.S1.Greeting.Example}"<br>`;
      scores.Greeting = S4_SCORING_GRID.S1.Greeting.BE;
    }

    // Reflect, Relate, Empathize
    if (conversationHistory.length > 0 && lowerText.match(/(sorry|understand|frustrating)/i)) {
      comment += `Reflect: Meets Expectations. ${S4_CRITERIA.S1.Reflect.ME}<br>`;
      score += S4_SCORING_GRID.S1.Reflect.ME;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.ME;
    } else {
      comment += `Reflect: Below Expectations. Fails to empathize. Recommended: "${S4_CRITERIA.S1.Reflect.Example}"<br>`;
      scores.Reflect = S4_SCORING_GRID.S1.Reflect.BE;
    }

    // Authenticate
    if (lowerText.match(/(verify|authenticate|who am i speaking with|account number)/i)) {
      if (lowerText.match(/may i ask/i)) {
        comment += `Authenticate: Highly Effective. ${S4_CRITERIA.S1.Authenticate.HE}<br>`;
        score += S4_SCORING_GRID.S1.Authenticate.HE;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.HE;
      } else {
        comment += `Authenticate: Meets Expectations. ${S4_CRITERIA.S1.Authenticate.ME}<br>`;
        score += S4_SCORING_GRID.S1.Authenticate.ME;
        scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.ME;
      }
    } else {
      comment += `Authenticate: Below Expectations. No verification. Recommended: "${S4_CRITERIA.S1.Authenticate.Example}"<br>`;
      scores.Authenticate = S4_SCORING_GRID.S1.Authenticate.BE;
    }
  } else if (stage === 'S2') {
    // Probe
    if (lowerText.match(/(what|how|when|describe)/i)) {
      if (lowerText.match(/(root cause|other issues)/i)) {
        comment += `Probe: Highly Effective. ${S4_CRITERIA.S2.Probe.HE}<br>`;
        score += S4_SCORING_GRID.S2.Probe.HE;
        scores.Probe = S4_SCORING_GRID.S2.Probe.HE;
      } else {
        comment += `Probe: Meets Expectations. ${S4_CRITERIA.S2.Probe.ME}<br>`;
        score += S4_SCORING_GRID.S2.Probe.ME;
        scores.Probe = S4_SCORING_GRID.S2.Probe.ME;
      }
    } else {
      comment += `Probe: Below Expectations. No clarifying questions. Recommended: "${S4_CRITERIA.S2.Probe.Example}"<br>`;
      scores.Probe = S4_SCORING_GRID.S2.Probe.BE;
    }

    // Resolve
    if (lowerText.match(/(fixed|resolved|take care of)/i)) {
      if (lowerText.match(/(explain|educate|prevent)/i)) {
        comment += `Resolve: Highly Effective. ${S4_CRITERIA.S2.Resolve.HE}<br>`;
        score += S4_SCORING_GRID.S2.Resolve.HE;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.HE;
      } else {
        comment += `Resolve: Meets Expectations. ${S4_CRITERIA.S2.Resolve.ME}<br>`;
        score += S4_SCORING_GRID.S2.Resolve.ME;
        scores.Resolve = S4_SCORING_GRID.S2.Resolve.ME;
      }
    } else {
      comment += `Resolve: Below Expectations. Fails to address issue. Recommended: "${S4_CRITERIA.S2.Resolve.Example}"<br>`;
      scores.Resolve = S4_SCORING_GRID.S2.Resolve.BE;
    }

    // Build Value
    if (lowerText.match(/(email|self-service|features)/i)) {
      comment += `Build Value: Meets Expectations. ${S4_CRITERIA.S2.BuildValue.ME}<br>`;
      score += S4_SCORING_GRID.S2.BuildValue.ME;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.ME;
    } else {
      comment += `Build Value: Below Expectations. No value mentioned. Recommended: "${S4_CRITERIA.S2.BuildValue.Example}"<br>`;
      scores.BuildValue = S4_SCORING_GRID.S2.BuildValue.BE;
    }
  } else if (stage === 'S3') {
    // Transition
    if (lowerText.match(/(review your account|best value)/i)) {
      if (lowerText.match(/probing|discovery/i)) {
        comment += `Transition: Highly Effective. ${S4_CRITERIA.S3.Transition.HE}<br>`;
        score += S4_SCORING_GRID.S3.Transition.HE;
        scores.Transition = S4_SCORING_GRID.S3.Transition.HE;
      } else {
        comment += `Transition: Meets Expectations. ${S4_CRITERIA.S3.Transition.ME}<br>`;
        score += S4_SCORING_GRID.S3.Transition.ME;
        scores.Transition = S4_SCORING_GRID.S3.Transition.ME;
      }
    } else {
      comment += `Transition: Below Expectations. No sales bridge. Recommended: "${S4_CRITERIA.S3.Transition.Example}"<br>`;
      scores.Transition = S4_SCORING_GRID.S3.Transition.BE;
    }

    // Present Offer
    if (lowerText.match(/(recommend|upgrade|benefits)/i)) {
      if (lowerText.match(/total bill|multiple benefits/i)) {
        comment += `Present: Highly Effective. ${S4_CRITERIA.S3.Present.HE}<br>`;
        score += S4_SCORING_GRID.S3.Present.HE;
        scores.Present = S4_SCORING_GRID.S3.Present.HE;
      } else {
        comment += `Present: Meets Expectations. ${S4_CRITERIA.S3.Present.ME}<br>`;
        score += S4_SCORING_GRID.S3.Present.ME;
        scores.Present = S4_SCORING_GRID.S3.Present.ME;
      }
    } else {
      comment += `Present: Below Expectations. No benefits shared. Recommended: "${S4_CRITERIA.S3.Present.Example}"<br>`;
      scores.Present = S4_SCORING_GRID.S3.Present.BE;
    }

    // Objections (if applicable)
    if (conversationHistory.some(msg => msg.content.match(/too expensive|not interested/i))) {
      if (lowerText.match(/(understand|alternative)/i)) {
        comment += `Objections: Meets Expectations. ${S4_CRITERIA.S3.Objections.ME}<br>`;
        score += S4_SCORING_GRID.S3.Objections.ME;
        scores.Objections = S4_SCORING_GRID.S3.Objections.ME;
      } else {
        comment += `Objections: Below Expectations. Poor objection handling. Recommended: "${S4_CRITERIA.S3.Objections.Example}"<br>`;
        scores.Objections = S4_SCORING_GRID.S3.Objections.BE;
      }
    } else {
      scores.Objections = 0; // N/A
    }

    // Close
    if (lowerText.match(/(set up|schedule|purchase)/i)) {
      comment += `Close: Meets Expectations. ${S4_CRITERIA.S3.Close.ME}<br>`;
      score += S4_SCORING_GRID.S3.Close.ME;
      scores.Close = S4_SCORING_GRID.S3.Close.ME;
    } else {
      comment += `Close: Below Expectations. No close attempt. Recommended: "${S4_CRITERIA.S3.Close.Example}"<br>`;
      scores.Close = S4_SCORING_GRID.S3.Close.BE;
    }
  } else if (stage === 'S4') {
    // Summarize
    if (lowerText.match(/(recap|next steps|we have done)/i)) {
      if (lowerText.match(/thoroughly|document/i)) {
        comment += `Summarize: Highly Effective. ${S4_CRITERIA.S4.Summarize.HE}<br>`;
        score += S4_SCORING_GRID.S4.Summarize.HE;
        scores.Summarize = S4_SCORING_GRID.S4.Summarize.HE;
      } else {
        comment += `Summarize: Meets Expectations. ${S4_CRITERIA.S4.Summarize.ME}<br>`;
        score += S4_SCORING_GRID.S4.Summarize.ME;
        scores.Summarize = S4_SCORING_GRID.S4.Summarize.ME;
      }
    } else {
      comment += `Summarize: Below Expectations. No recap. Recommended: "${S4_CRITERIA.S4.Summarize.Example}"<br>`;
      scores.Summarize = S4_SCORING_GRID.S4.Summarize.BE;
    }

    // Close Contact
    if (lowerText.match(/(anything else|thank you)/i)) {
      if (lowerText.match(/personalize|evening/i)) {
        comment += `Close Contact: Highly Effective. ${S4_CRITERIA.S4.CloseContact.HE}<br>`;
        score += S4_SCORING_GRID.S4.CloseContact.HE;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.HE;
      } else {
        comment += `Close Contact: Meets Expectations. ${S4_CRITERIA.S4.CloseContact.ME}<br>`;
        score += S4_SCORING_GRID.S4.CloseContact.ME;
        scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.ME;
      }
    } else {
      comment += `Close Contact: Below Expectations. No assistance offered. Recommended: "${S4_CRITERIA.S4.CloseContact.Example}"<br>`;
      scores.CloseContact = S4_SCORING_GRID.S4.CloseContact.BE;
    }

    // Documentation (assumed)
    scores.Documentation = S4_SCORING_GRID.S4.Documentation.ME; // Assume ME for speech-based
    comment += `Documentation: Meets Expectations. ${S4_CRITERIA.S4.Documentation.ME}<br>`;
    score += S4_SCORING_GRID.S4.Documentation.ME;
  }

  // Behaviors
  if (lowerText.match(/(sorry|please|thank you)/i)) {
    comment += `Tone/Rapport: Meets Expectations. ${S4_CRITERIA.Behaviors.Tone.ME}<br>`;
    score += S4_SCORING_GRID.Behaviors.Tone.ME + S4_SCORING_GRID.Behaviors.Rapport.ME;
    scores.Tone = S4_SCORING_GRID.Behaviors.Tone.ME;
    scores.Rapport = S4_SCORING_GRID.Behaviors.Rapport.ME;
  } else {
    comment += `Tone/Rapport: Below Expectations. Lacks politeness. Recommended: "Thank you for calling Comcast."<br>`;
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
