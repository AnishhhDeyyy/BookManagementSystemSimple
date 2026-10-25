// AWS SNS client is used to send push-style notifications to an SNS topic.
// This service is responsible for publishing a message to a configured topic.
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Create one reusable SNS client for the app.
// The region is read from AWS_REGION and falls back to Mumbai (ap-south-1).
const snsClient = new SNSClient({
    region: process.env.AWS_REGION || "ap-south-1"
});

// Publishes a notification to the configured SNS topic.
// subject: title/heading of the message
// message: main text payload being sent
export async function publishNotification(subject: string, message: string) {
    // Read the SNS topic ARN from environment variables.
    // If it is not set, fail fast instead of trying to send to an invalid topic.
    const topicArn = process.env.SNS_TOPIC_ARN;
    if (!topicArn) {
        throw new Error("SNS Topic Arn is not Configured");
    }

    // Build the AWS SNS publish request.
    // TopicArn identifies the destination topic, and Subject/Message are the payload.
    const command = new PublishCommand({
        TopicArn: topicArn,
        Subject: subject,
        Message: message
    });

    // Send the request to AWS SNS and return the server response.
    return await snsClient.send(command);
}