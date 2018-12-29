# Blanketyou
blanketyou facebook bot interface

## Data Flow
### 1. Static Response (/api/staticResponse.js)
Return status code 200 to facebook
### 2. Session  (/api/services/session.js)
Loop through all events sent by Facebook. For each event, create new session for new users and old users. For old users, create new session if their session expired. If their sessions are not expired, retrieve those sessions and save them in an event_context object. Pass the event_context object to nlp processing unit asynchronously.
### 3. NLP (/api/services/nlp.js)
Partition the events based on their types. In message handler, read the event object in event_context object, then partition based on nlp entities. Each nlp contributes to the user response, which is stored in "event_context.next_message". When all critical questions are answered by users, register or update user information by using functions in user.js (/api/services/user.js). If the user is a donor, call functions in doneeMatcher.js (/api/services/doneeMatcher.js) to obtain donee recommendations asynchronously. When all transactions are done, call messageSender asynchronously.
### 4. Send Message (/api/services/messageSender.js)
Send messages to facebook via facebook api asynchronously. Errors are written in both console logs and log files (in case this application is deployed in Linux machines).

## Config Files
### appConfig.js
Include configurations for server and database
### confidenceLevel.js
Include default nlp confidence level to use facebook default nlp api
### fbConfig.js
Include facebook api url and access TOKEN
### matcherConfig.js
Include recommend cooldown for donee
### questionMapping.js
Include question types and corresponding sentences
