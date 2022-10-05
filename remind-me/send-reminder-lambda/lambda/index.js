const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const extractReminderData = event => {
    const record = event.Records[0];
    const reminderData = record?.dynamodb?.OldImage;
    return reminderData ? unmarshall(reminderData) : undefined;
 };

const lambda = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
          },
        isBase64Encoded: false
      };

      try {
        console.log('Incoming event --> ' + JSON.stringify(event));
        const reminderData = extractReminderData(event);
        console.log(`Sending message: ${reminderData.message} to userId: ${reminderData.user_id} via notificationType: ${reminderData.notification_type}`);
        response.body = {
            message: 'Notification sent'
          };
    } catch (error) {
        console.log(error);
      }
      return response;
}

exports.lambda = lambda;