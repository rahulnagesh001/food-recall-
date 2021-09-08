/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
       // const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';
        const speakOutput = 'Welcome to food recall, What meal would you like me to record?';
        //const repromptText = ' '
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const LoadMealInterceptor = {
    async process(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = await attributesManager.getPersistentAttributes() || {};

        const meal = sessionAttributes.hasOwnProperty('meal') ? sessionAttributes.meal : 0;
        const food = sessionAttributes.hasOwnProperty('food') ? sessionAttributes.food : 0;
        const place = sessionAttributes.hasOwnProperty('place') ? sessionAttributes.place : 0;

        if (meal && food && place) {
            attributesManager.setSessionAttributes(sessionAttributes);
        }
    }
};

const SetFoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetFoodIntent';
    },
    async handle(handlerInput) {
    
    const food = handlerInput.requestEnvelope.request.intent.slots.food.value;
    const meal = handlerInput.requestEnvelope.request.intent.slots.meal.value;
    const place = handlerInput.requestEnvelope.request.intent.slots.place.value;
    const attributesManager = handlerInput.attributesManager;

    const mealAttributes = {
    "meal" : meal,
    "food" : food,
    "place" : place
    };
    //const speechtext = 'You had ' + foodname + ' for ' + meal;
    attributesManager.setPersistentAttributes(mealAttributes);
    await attributesManager.savePersistentAttributes();    

    const speakOutput = `Thanks, I'll remember you had ${food} for ${meal} at ${place} .`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
        
    }
};

const LoadSavedMealIntentHandler = {
    canHandle(handlerInput) {
      //  return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        //    && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LoadSavedMealIntent';
            
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};

        const meal = sessionAttributes.hasOwnProperty('meal') ? sessionAttributes.meal : 0;
        const food = sessionAttributes.hasOwnProperty('food') ? sessionAttributes.food : 0;
        const place = sessionAttributes.hasOwnProperty('place') ? sessionAttributes.place : 0;

        return Alexa.getRequestType(handlerInput.requestEnvelope) === `IntentRequest` && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LoadSavedMealIntent'

            && meal

            && food

            && place;
    },
    handle(handlerInput) {
     //  console.log("Api Request [LoadSavedMeal]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getPersistentAttributes() || {};
      //  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const meal = sessionAttributes.hasOwnProperty('meal') ? sessionAttributes.meal : 0;
        const food = sessionAttributes.hasOwnProperty('food') ? sessionAttributes.food : 0;
        const place = sessionAttributes.hasOwnProperty('place') ? sessionAttributes.place : 0;
        
        
        /* if (sessionAttributes.meal && sessionAttributes.food && sessionAttributes.place ) {
            var meal = sessionAttributes.meal;
            var food = sessionAttributes.food;
            var place = sessionAttributes.place;
        }*/
        const speakOutput = `Welcome back. you had ${food} for ${meal}`;

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
    new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        LaunchRequestHandler,
        SetFoodIntentHandler,
        LoadSavedMealIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
        .addRequestInterceptors(
    LoadMealInterceptor
)
 
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();