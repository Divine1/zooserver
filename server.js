const express = require("express");
const webPush = require("web-push");
const constants = require("./constants");
const cors = require("cors");

webPush.setVapidDetails(
    'mailto:cdivine304@gmail.com',
    constants.vapidKeys.publicKey,
    constants.vapidKeys.privateKey
);

const USER_SUBSCRIPTIONS = [];
const app = express();
const PORT=3000;

app.use(cors())
app.use(express.json())

app.post("/registerPushnotification",(req,res)=>{
    console.log("in registerPushnotification")
    const reqBody = req.body;
    console.log("reqBody ",reqBody)

   let flag =  USER_SUBSCRIPTIONS.find((obj)=>{
        return obj.endpoint == reqBody.endpoint
    })

    if(flag){
        console.log("subscription already present")
    }
    else{
        console.log("subscription not present")
        USER_SUBSCRIPTIONS.push(reqBody);
    }

    
    res.send({"data" : "from registerPushnotification"})
})

app.post("/sendMessage",(req,res)=>{
    console.log("in sendMessage")
    const reqBody = req.body;

    console.log("reqBody ",reqBody);
    console.log("USER_SUBSCRIPTIONS length ",USER_SUBSCRIPTIONS.length);
    const notificationPayload = {
        "data": {
            "name" : "divine",
            "city" : "madurai"
        }
    }
    /*
    const notificationPayload = {
        "notification": {
            "silent" : "true",
          "title": "New Notification!",
          "body" : "News latest breaking story",
          "actions": [
            {"action": "foo", "title": "Open new tab"},
            {"action": "bar", "title": "Focus last"},
            {"action": "baz", "title": "Navigate last"},
            {"action": "qux", "title": "Just notify existing clients"}
          ],
          "data": {
            "primaryKey" : Date.now(),
            "dateOfArrival" : Date.now(),
            "onActionClick": {
              "default": {"operation": "openWindow"},
              "foo": {"operation": "openWindow", "url": "/absolute/path"},
              "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
              "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"}
            }
          }
        }
      }
      */
      
     /*
      const notificationPayload = {
            "notification": {
                "title": "New Notification!",
                "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
                "icon": "staticFolder/ccard.png",
                "vibrate": [200, 100, 200, 100, 200, 100, 400],
                "tag": "request",
                "actions": [
                    { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
                    { "action": "no", "title": "No", "icon": "images/no.png" }
                ]
            }
        };
    */

      
    USER_SUBSCRIPTIONS.map((subscription)=>{
        webPush.sendNotification(subscription,JSON.stringify(notificationPayload)).then(()=>{
            console.log("subscription ",subscription," message sent successfully");
        }).catch((err)=>{
            console.log("error while sending notification ",err);
        })

    })
    res.send({data : "sendMessage"})
})

app.listen(PORT,()=>{
    console.log("server is listening on port ",PORT)
})




